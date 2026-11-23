import type { Pokemon, PokemonDetail, PokemonStat, PokemonType } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export interface PokemonListItem {
  name: string;
  url: string;
}

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

interface PokemonDetailResponse {
  id: number;
  name: string;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string | null;
      };
    };
  };
  types: { type: { name: string } }[];
  species: { url: string };
}

interface PokemonSpeciesResponse {
  names: { name: string; language: { name: string } }[];
}

interface PokemonProfileResponse extends PokemonDetailResponse {
  height: number;
  weight: number;
  abilities: { ability: { name: string; url: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
}

interface PokemonSpeciesDetailResponse extends PokemonSpeciesResponse {
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
}

interface AbilityResponse {
  names: { name: string; language: { name: string } }[];
}

export class HttpError extends Error {
  status: number;

  constructor(status: number) {
    super(`HTTP ${status}`);
    this.name = 'HttpError';
    this.status = status;
  }
}

export function getIdFromUrl(url: string): number {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? Number(match[1]) : 0;
}

export function isNotFoundError(error: unknown): boolean {
  return error instanceof HttpError && error.status === 404;
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new HttpError(response.status);
  }
  return (await response.json()) as T;
}


const POKEMON_TYPES: readonly PokemonType[] = [
  'NORMAL', 'FIRE', 'WATER', 'ELECTRIC', 'GRASS', 'ICE',
  'FIGHTING', 'POISON', 'GROUND', 'FLYING', 'PSYCHIC', 'BUG',
  'ROCK', 'GHOST', 'DRAGON', 'DARK', 'STEEL', 'FAIRY',
];

export function isPokemonType(value: string): value is PokemonType {
  return (POKEMON_TYPES as readonly string[]).includes(value);
}


async function toPokemon(detail: PokemonDetailResponse, signal?: AbortSignal): Promise<Pokemon> {
  const species = await fetchJson<PokemonSpeciesResponse>(detail.species.url, signal);
  const koreanName = species.names.find(({ language }) => language.name === 'ko')?.name;

  return {
    id: detail.id,
    name: koreanName ?? detail.name,
    types: detail.types.map(({ type }) => type.name.toUpperCase()).filter(isPokemonType),
    imageUrl: detail.sprites.other['official-artwork'].front_default ?? '',
  };
}

export const POKEDEX_PAGE_SIZE = 20;

export interface PokemonListParams {
  limit: number;
  offset: number;
}

export interface PokemonListEntry {
  id: number;
  url: string;
}

export interface PokemonListPage {
  count: number;
  items: PokemonListEntry[];
  next: PokemonListParams | null;
  previous: PokemonListParams | null;
}

function toListParams(url: string | null): PokemonListParams | null {
  if (url === null) return null;
  const { searchParams } = new URL(url);
  return {
    limit: Number(searchParams.get('limit')),
    offset: Number(searchParams.get('offset')),
  };
}

export async function fetchPokemonList(
  { limit, offset }: PokemonListParams,
  signal?: AbortSignal,
): Promise<PokemonListPage> {
  const data = await fetchJson<PokemonListResponse>(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
    signal,
  );
  return {
    count: data.count,
    items: data.results.map(({ url }) => ({ id: getIdFromUrl(url), url })),
    next: toListParams(data.next),
    previous: toListParams(data.previous),
  };
}

export async function fetchPokemonByUrl(url: string, signal?: AbortSignal): Promise<Pokemon> {
  const detail = await fetchJson<PokemonDetailResponse>(url, signal);
  return toPokemon(detail, signal);
}

export async function fetchPokemonByIdOrName(
  query: string,
  signal?: AbortSignal,
): Promise<Pokemon> {
  const idOrName = query.trim().toLowerCase();
  const detail = await fetchJson<PokemonDetailResponse>(
    `${BASE_URL}/pokemon/${encodeURIComponent(idOrName)}`,
    signal,
  );
  return toPokemon(detail, signal);
}

const STAT_LABELS: { name: string; label: PokemonStat['label'] }[] = [
  { name: 'hp', label: 'HP' },
  { name: 'attack', label: 'Attack' },
  { name: 'defense', label: 'Defense' },
  { name: 'speed', label: 'Speed' },
];

function cleanFlavorText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

async function fetchAbilityName(
  ability: { name: string; url: string },
  signal?: AbortSignal,
): Promise<string> {
  try {
    const data = await fetchJson<AbilityResponse>(ability.url, signal);
    return data.names.find(({ language }) => language.name === 'ko')?.name ?? ability.name;
  } catch {
    return ability.name;
  }
}

export async function fetchPokemonDetail(
  idOrName: string,
  signal?: AbortSignal,
): Promise<PokemonDetail> {
  const detail = await fetchJson<PokemonProfileResponse>(
    `${BASE_URL}/pokemon/${encodeURIComponent(idOrName)}`,
    signal,
  );
  const firstAbility = detail.abilities[0]?.ability;

  const [species, ability] = await Promise.all([
    fetchJson<PokemonSpeciesDetailResponse>(detail.species.url, signal),
    firstAbility ? fetchAbilityName(firstAbility, signal) : Promise.resolve(''),
  ]);

  const findText = (lang: string) =>
    species.flavor_text_entries.find(({ language }) => language.name === lang)?.flavor_text;
  const description = findText('ko') ?? findText('en');

  return {
    id: detail.id,
    name: species.names.find(({ language }) => language.name === 'ko')?.name ?? detail.name,
    types: detail.types.map(({ type }) => type.name.toUpperCase()).filter(isPokemonType),
    imageUrl: detail.sprites.other['official-artwork'].front_default ?? '',
    height: detail.height / 10,
    weight: detail.weight / 10,
    ability,
    description: description ? cleanFlavorText(description) : '설명이 없어요',
    stats: STAT_LABELS.map(({ name, label }) => ({
      label,
      value: detail.stats.find(({ stat }) => stat.name === name)?.base_stat ?? 0,
    })),
  };
}