import { pokemonTypes, type Pokemon, type PokemonType } from "./pokemons";

const API_BASE_URL = "https://pokeapi.co/api/v2";
const POKEMON_LIST_LIMIT = 20;

export type PokemonListItem = {
    name: string;
    url: string;
};

type PokemonListResponse = {
    results: PokemonListItem[];
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

export async function fetchPokemonList(signal: AbortSignal) {
    const data = await fetchJson<PokemonListResponse>(
        `${API_BASE_URL}/pokemon?limit=${POKEMON_LIST_LIMIT}&offset=0`,
        signal,
    );
    return data.results;
}

export async function fetchPokemon(url: string, signal: AbortSignal) {
    const detail = await fetchJson<PokemonDetailResponse>(url, signal);
    const species = await fetchJson<PokemonSpeciesResponse>(
        detail.species.url,
        signal,
    );
    return toPokemon(detail, species);
}
