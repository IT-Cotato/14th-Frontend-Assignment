const BASE_URL = "https://pokeapi.co/api/v2";
export const LIST_LIMIT = 20;

export type PokemonData = {
  id: number;
  name: string; // 한글 이름 (실패하면 영문)
  type: string; // 대표 타입 (영문 소문자)
  types: string[]; // 전체 타입 (1~2개)
  image: string;
  height: number;
  weight: number;
  abilities: string[];
  stats: { name: string; value: number }[];
  description: string;
};

export type CardResult =
  | { status: "ok"; data: PokemonData }
  | { status: "failed"; id: number; name: string };

export class HttpError extends Error {
  status: number;

  constructor(status: number) {
    super(`HTTP ${status}`);
    this.status = status;
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

// fetch는 404/500에서도 reject되지 않으므로 res.ok를 직접 확인
async function getJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new HttpError(res.status);
  return (await res.json()) as T;
}

// "  Pikachu " → "pikachu", "#0025" → "25"
export function normalizeQuery(query: string): string {
  const keyword = query.trim().toLowerCase().replace(/^#/, "");
  return /^\d+$/.test(keyword) ? String(Number(keyword)) : keyword;
}

// "https://pokeapi.co/api/v2/pokemon/149/" → 149
function getIdFromUrl(url: string): number {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? Number(match[1]) : 0;
}

// 상세 요청이 실패했을 때 쓰는 대체 이미지 주소
export function getArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

type PokemonResponse = {
  id: number;
  name: string;
  height: number;
  weight: number;
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  species: { url: string };
  sprites: {
    front_default: string | null;
    other?: { "official-artwork"?: { front_default: string | null } };
  };
  types: { slot: number; type: { name: string } }[];
};

type SpeciesResponse = {
  names: { name: string; language: { name: string } }[];
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
};

export async function fetchAbilityName(name: string, signal: AbortSignal): Promise<string> {
  const ability = await getJson<Pick<SpeciesResponse, "names">>(
    `${BASE_URL}/ability/${encodeURIComponent(name)}`,
    signal,
  );
  return ability.names.find(({ language }) => language.name === "ko")?.name ??
    ability.names.find(({ language }) => language.name === "en")?.name ?? name;
}

// target: 도감 번호 또는 영문 이름
export async function fetchPokemon(
  target: string,
  signal: AbortSignal,
): Promise<PokemonData> {
  if (target === "" || target === "." || target === "..") throw new HttpError(404);
  const url = `${BASE_URL}/pokemon/${encodeURIComponent(target)}`;
  const data = await getJson<PokemonResponse>(url, signal);

  // 한글 이름은 species API에 있음. 실패해도 카드는 영문 이름으로 표시
  let name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
  let description = "설명이 없어요.";
  try {
    const species = await getJson<SpeciesResponse>(data.species.url, signal);
    name = species.names.find((n) => n.language.name === "ko")?.name ?? name;
    const entries = species.flavor_text_entries.map(({ flavor_text, language }) => ({
      text: flavor_text.replace(/\s+/g, " ").trim(),
      language: language.name,
    }));
    description = entries.find((entry) => entry.language === "ko" && entry.text)?.text ??
      entries.find((entry) => entry.language === "en" && entry.text)?.text ?? description;
  } catch (error) {
    if (isAbortError(error)) throw error;
  }

  const types = [...data.types]
    .sort((a, b) => a.slot - b.slot)
    .map((t) => t.type.name);

  return {
    id: data.id,
    name,
    description,
    height: data.height / 10,
    weight: data.weight / 10,
    abilities: data.abilities.map(({ ability }) => ability.name),
    stats: data.stats.map(({ base_stat, stat }) => ({ name: stat.name, value: base_stat })),
    type: types[0] ?? "normal",
    types: types.length > 0 ? types : ["normal"],
    image:
      data.sprites.other?.["official-artwork"]?.front_default ??
      data.sprites.front_default ??
      "",
  };
}

// ── 추가: query key ──
export type PageParams = { limit: number; offset: number };

export const pokemonKeys = {
  list: (params: PageParams) => ["pokemon", "list", params] as const,
  detail: (target: string) => ["pokemon", "detail", target] as const,
  search: (target: string) => ["pokemon", "search", target] as const,
};

// ── 추가: 목록 응답 → 화면 모델 ──
export type PokemonListItem = { id: number; url: string; name: string };

export type PokemonPage = {
  count: number;
  items: PokemonListItem[];
  next: PageParams | null;
  previous: PageParams | null;
};

// 수정: count, next, previous 추가
type ListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
};

// next/previous URL → { limit, offset }
function toPageParams(url: string | null): PageParams | null {
  if (!url) return null;
  const params = new URL(url).searchParams;
  return {
    limit: Number(params.get("limit")),
    offset: Number(params.get("offset")),
  };
}

export async function fetchPokemonPage(
  { limit, offset }: PageParams,
  signal: AbortSignal,
): Promise<PokemonPage> {
  const list = await getJson<ListResponse>(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
    signal,
  );

  return {
    count: list.count,
    items: list.results.map(({ name, url }) => ({
      id: getIdFromUrl(url),
      url,
      name,
    })),
    next: toPageParams(list.next),
    previous: toPageParams(list.previous),
  };
}

// ── 아래는 기존 코드 (W06에서는 더 이상 쓰이지 않음) ──
export async function loadCards(
  query: string,
  signal: AbortSignal,
): Promise<CardResult[]> {
  // 검색: 번호/이름 하나만 조회 (404면 호출한 쪽에서 처리)
  if (query.trim()) {
    const data = await fetchPokemon(normalizeQuery(query), signal);
    return [{ status: "ok", data }];
  }

  // 목록: 목록 → 카드별 상세. 하나가 실패해도 나머지는 유지
  const list = await getJson<ListResponse>(
    `${BASE_URL}/pokemon?limit=${LIST_LIMIT}&offset=0`,
    signal,
  );

  const settled = await Promise.allSettled(
    list.results.map((item) => fetchPokemon(item.name, signal)),
  );

  return settled.map((result, i): CardResult => {
    if (result.status === "fulfilled") {
      return { status: "ok", data: result.value };
    }

    // 상세가 실패해도 목록 응답의 URL에서 번호를 알 수 있음
    const { name, url } = list.results[i];
    return { status: "failed", id: getIdFromUrl(url), name };
  });
}

// 실패한 카드 1개만 다시 요청 (id로 상세 요청)
export async function retryCard(
  id: number,
  name: string,
  signal: AbortSignal,
): Promise<CardResult> {
  try {
    const data = await fetchPokemon(String(id), signal);
    return { status: "ok", data };
  } catch (error) {
    if (isAbortError(error)) throw error;
    return { status: "failed", id, name };
  }
}
