import { useQuery } from '@tanstack/react-query';
import type { Pokemon } from '../App';
import { toPokemon, type PokemonDetailResponse } from './usePokemonList';

const POKE_API_URL = 'https://pokeapi.co/api/v2';

// 상세 화면에서 보여줄 스탯과 라벨
const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  speed: 'Speed',
};

// 스탯 바가 꽉 차는 기준값 (디자인 시안 기준: HP 78 → 280px 중 182px)
export const STAT_MAX = 120;

interface LocalizedName {
  name: string;
  language: { name: string };
}

interface PokemonFullResponse extends PokemonDetailResponse {
  height: number;
  weight: number;
  species: { url: string };
  abilities: Array<{ ability: { name: string; url: string } }>;
  stats: Array<{ base_stat: number; stat: { name: string } }>;
  sprites: PokemonDetailResponse['sprites'] & {
    other?: {
      'official-artwork'?: { front_default: string | null };
    };
  };
}

interface SpeciesResponse {
  names: LocalizedName[];
  flavor_text_entries: Array<{ flavor_text: string; language: { name: string } }>;
}

interface AbilityResponse {
  names: LocalizedName[];
}

export interface PokemonStat {
  key: string;
  label: string;
  value: number;
}

export interface PokemonDetail {
  pokemon: Pokemon;
  displayName: string;
  description: string;
  artwork: string;
  heightM: number;
  weightKg: number;
  ability: string;
  stats: PokemonStat[];
}

// PokéAPI가 404를 반환했을 때(= 데이터 없음) 구분하기 위한 에러
export class PokemonNotFoundError extends Error {
  constructor(pokemonId: string) {
    super(`'${pokemonId}'에 해당하는 포켓몬이 없습니다.`);
    this.name = 'PokemonNotFoundError';
  }
}

async function fetchJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`요청 실패: ${response.status}`);
  }

  return (await response.json()) as T;
}

function findKorean(names: LocalizedName[] | undefined): string | undefined {
  return names?.find(({ language }) => language.name === 'ko')?.name;
}

function cleanFlavorText(text: string): string {
  return text.replace(/[\n\f\r]/g, ' ').replace(/\s+/g, ' ').trim();
}

// "0006", "Charizard" → "6", "charizard"
export function normalizePokemonId(pokemonId: string): string {
  const trimmed = pokemonId.trim().toLowerCase();
  return /^\d+$/.test(trimmed) ? String(Number(trimmed)) : trimmed;
}

async function fetchPokemonDetail(
  pokemonId: string,
  signal: AbortSignal
): Promise<PokemonDetail> {
  const response = await fetch(
    `${POKE_API_URL}/pokemon/${encodeURIComponent(pokemonId)}`,
    { signal }
  );

  if (response.status === 404) {
    throw new PokemonNotFoundError(pokemonId);
  }

  if (!response.ok) {
    throw new Error(`포켓몬 상세 정보 요청 실패: ${response.status}`);
  }

  const detail = (await response.json()) as PokemonFullResponse;
  const firstAbility = detail.abilities[0]?.ability;

  // 한국어 이름·설명·특성은 부가 정보라서 실패해도 화면은 보여줍니다.
  const [species, ability] = await Promise.allSettled([
    fetchJson<SpeciesResponse>(detail.species.url, signal),
    firstAbility
      ? fetchJson<AbilityResponse>(firstAbility.url, signal)
      : Promise.reject(new Error('특성 없음')),
  ]);

  const speciesData = species.status === 'fulfilled' ? species.value : undefined;
  const flavorEntries = speciesData?.flavor_text_entries ?? [];
  const flavor =
    flavorEntries.find(({ language }) => language.name === 'ko') ??
    flavorEntries.find(({ language }) => language.name === 'en');

  return {
    pokemon: toPokemon(detail),
    displayName: findKorean(speciesData?.names) ?? detail.name,
    description: flavor ? cleanFlavorText(flavor.flavor_text) : '설명이 없어요',
    artwork:
      detail.sprites.other?.['official-artwork']?.front_default ??
      detail.sprites.front_default ??
      '',
    heightM: detail.height / 10,
    weightKg: detail.weight / 10,
    ability:
      (ability.status === 'fulfilled' && findKorean(ability.value.names)) ||
      firstAbility?.name ||
      '-',
    stats: Object.keys(STAT_LABELS).map((key) => ({
      key,
      label: STAT_LABELS[key],
      value: detail.stats.find(({ stat }) => stat.name === key)?.base_stat ?? 0,
    })),
  };
}

export function usePokemonDetail(pokemonId: string) {
  const normalizedId = normalizePokemonId(pokemonId);

  return useQuery({
    queryKey: ['pokemon-detail', normalizedId],
    queryFn: ({ signal }) => fetchPokemonDetail(normalizedId, signal),
    // 404(데이터 없음)는 다시 요청해도 결과가 같으므로 재시도하지 않습니다.
    retry: (failureCount, error) =>
      !(error instanceof PokemonNotFoundError) && failureCount < 2,
  });
}
