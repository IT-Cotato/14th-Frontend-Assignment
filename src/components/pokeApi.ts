const BASE_URL = "https://pokeapi.co/api/v2";
export const LIST_LIMIT = 20;

export type PokemonData = {
  id: number;
  name: string; // 한글 이름 (실패하면 영문)
  type: string; // 대표 타입 (영문 소문자)
  types: string[]; // 전체 타입 (1~2개)
  image: string;
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
  species: { url: string };
  sprites: {
    front_default: string | null;
    other?: { "official-artwork"?: { front_default: string | null } };
  };
  types: { slot: number; type: { name: string } }[];
};

type SpeciesResponse = {
  names: { name: string; language: { name: string } }[];
};

// target: 상세 URL 또는 도감 번호/영문 이름
export async function fetchPokemon(
  target: string,
  signal: AbortSignal,
): Promise<PokemonData> {
  const url = target.startsWith("http")
    ? target
    : `${BASE_URL}/pokemon/${target}`;
  const data = await getJson<PokemonResponse>(url, signal);

  // 한글 이름은 species API에 있음. 실패해도 카드는 영문 이름으로 표시
  let name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
  try {
    const species = await getJson<SpeciesResponse>(data.species.url, signal);
    name = species.names.find((n) => n.language.name === "ko")?.name ?? name;
  } catch (error) {
    if (isAbortError(error)) throw error;
  }

  const types = [...data.types]
    .sort((a, b) => a.slot - b.slot)
    .map((t) => t.type.name);

  return {
    id: data.id,
    name,
    type: types[0] ?? "normal",
    types: types.length > 0 ? types : ["normal"],
    image:
      data.sprites.other?.["official-artwork"]?.front_default ??
      data.sprites.front_default ??
      "",
  };
}

type ListResponse = { results: { name: string; url: string }[] };

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
    list.results.map((item) => fetchPokemon(item.url, signal)),
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