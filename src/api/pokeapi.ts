import type { Pokemon, PokemonType } from '../types/pokemon';

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

function isPokemonType(value: string): value is PokemonType {
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

export async function fetchPokemonList(signal?: AbortSignal): Promise<PokemonListItem[]> {
  const data = await fetchJson<PokemonListResponse>(
    `${BASE_URL}/pokemon?limit=20&offset=0`,
    signal,
  );
  return data.results;
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