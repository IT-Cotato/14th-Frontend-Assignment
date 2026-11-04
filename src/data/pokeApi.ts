import { pokemonTypes, type Pokemon, type PokemonType } from "./pokemons";

const API_BASE_URL = "https://pokeapi.co/api/v2";
export const POKEMON_LIST_LIMIT = 20;

export type PokemonListItem = {
    id: number;
    name: string;
    url: string;
};

export type PokemonListPage = {
    items: PokemonListItem[];
    currentPage: number;
    totalPages: number;
    previousOffset: number | null;
    nextOffset: number | null;
};

type PokemonListResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: { name: string; url: string }[];
};

type PokemonDetailResponse = {
    id: number;
    name: string;
    sprites: {
        other: {
            "official-artwork": {
                front_default: string;
            };
        };
    };
    types: { type: { name: string } }[];
    species: { url: string };
};

type PokemonSpeciesResponse = {
    names: { name: string; language: { name: string } }[];
};

export class PokeApiError extends Error {
    status: number;

    constructor(status: number) {
        super(`PokéAPI request failed: ${status}`);
        this.name = "PokeApiError";
        this.status = status;
    }
}

export function isNotFoundError(error: unknown) {
    return error instanceof PokeApiError && error.status === 404;
}

export function isValidPokemonQuery(query: string) {
    return /^[a-z0-9-]+$/.test(query);
}

export function getPokemonUrl(idOrName: string) {
    return `${API_BASE_URL}/pokemon/${encodeURIComponent(idOrName)}`;
}

export function getPokemonIdFromUrl(url: string) {
    const match = url.match(/\/pokemon\/(\d+)\/?$/);
    return Number(match?.[1]);
}

function getOffsetFromUrl(url: string | null) {
    if (url === null) {
        return null;
    }
    return Number(new URL(url).searchParams.get("offset"));
}

async function fetchJson<T>(url: string, signal: AbortSignal): Promise<T> {
    const response = await fetch(url, { signal });
    if (!response.ok) {
        throw new PokeApiError(response.status);
    }
    return response.json() as Promise<T>;
}

function isPokemonType(value: string): value is PokemonType {
    return pokemonTypes.includes(value as PokemonType);
}

function toPokemon(
    detail: PokemonDetailResponse,
    species: PokemonSpeciesResponse,
): Pokemon {
    const koreanName = species.names.find(
        (entry) => entry.language.name === "ko",
    );
    return {
        id: detail.id,
        name: koreanName?.name ?? detail.name,
        types: detail.types
            .map((entry) => entry.type.name)
            .filter(isPokemonType),
        imageUrl: detail.sprites.other["official-artwork"].front_default,
    };
}

function toPokemonListPage(
    response: PokemonListResponse,
    limit: number,
    offset: number,
): PokemonListPage {
    return {
        items: response.results.map((result) => ({
            id: getPokemonIdFromUrl(result.url),
            name: result.name,
            url: result.url,
        })),
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(response.count / limit),
        previousOffset: getOffsetFromUrl(response.previous),
        nextOffset: getOffsetFromUrl(response.next),
    };
}

export async function fetchPokemonList(
    limit: number,
    offset: number,
    signal: AbortSignal,
) {
    const response = await fetchJson<PokemonListResponse>(
        `${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
        signal,
    );
    return toPokemonListPage(response, limit, offset);
}

export async function fetchPokemon(url: string, signal: AbortSignal) {
    const detail = await fetchJson<PokemonDetailResponse>(url, signal);
    const species = await fetchJson<PokemonSpeciesResponse>(
        detail.species.url,
        signal,
    );
    return toPokemon(detail, species);
}
