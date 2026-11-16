import { pokemonTypes, type Pokemon, type PokemonType } from "./pokemons";

const API_BASE_URL = "https://pokeapi.co/api/v2";
const MAX_RETRY_COUNT = 3;
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

export type PokemonStat = {
    label: string;
    value: number;
};

export type PokemonProfile = {
    pokemon: Pokemon;
    height: number;
    weight: number;
    ability: string | null;
    stats: PokemonStat[];
    description: string | null;
};

type LocalizedName = {
    name: string;
    language: { name: string };
};

type PokemonListResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: { name: string; url: string }[];
};

type PokemonAbilityEntry = {
    ability: { name: string; url: string };
};

type PokemonDetailResponse = {
    id: number;
    name: string;
    height: number;
    weight: number;
    sprites: {
        other: {
            "official-artwork": {
                front_default: string;
            };
        };
    };
    types: { type: { name: string } }[];
    abilities: PokemonAbilityEntry[];
    stats: { base_stat: number; stat: { name: string } }[];
    species: { url: string };
};

type PokemonSpeciesResponse = {
    names: LocalizedName[];
    flavor_text_entries: {
        flavor_text: string;
        language: { name: string };
    }[];
};

type PokemonAbilityResponse = {
    names: LocalizedName[];
};

const profileStats = [
    { name: "hp", label: "HP" },
    { name: "attack", label: "Attack" },
    { name: "defense", label: "Defense" },
    { name: "speed", label: "Speed" },
];

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

export function shouldRetryRequest(failureCount: number, error: unknown) {
    return !isNotFoundError(error) && failureCount < MAX_RETRY_COUNT;
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

function findKoreanName(names: LocalizedName[]) {
    return names.find((entry) => entry.language.name === "ko")?.name;
}

function toPokemon(
    detail: PokemonDetailResponse,
    species: PokemonSpeciesResponse,
): Pokemon {
    return {
        id: detail.id,
        name: findKoreanName(species.names) ?? detail.name,
        types: detail.types
            .map((entry) => entry.type.name)
            .filter(isPokemonType),
        imageUrl: detail.sprites.other["official-artwork"].front_default,
    };
}

function getDescription(species: PokemonSpeciesResponse) {
    const entries = species.flavor_text_entries;
    const entry =
        entries.find((item) => item.language.name === "ko") ??
        entries.find((item) => item.language.name === "en");
    return entry === undefined
        ? null
        : entry.flavor_text.replace(/\s+/g, " ").trim();
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

async function fetchAbilityName(
    entry: PokemonAbilityEntry | undefined,
    signal: AbortSignal,
) {
    if (entry === undefined) {
        return null;
    }
    const ability = await fetchJson<PokemonAbilityResponse>(
        entry.ability.url,
        signal,
    );
    return findKoreanName(ability.names) ?? entry.ability.name;
}

export async function fetchPokemonProfile(
    idOrName: string,
    signal: AbortSignal,
): Promise<PokemonProfile> {
    const detail = await fetchJson<PokemonDetailResponse>(
        getPokemonUrl(idOrName),
        signal,
    );
    const [species, ability] = await Promise.all([
        fetchJson<PokemonSpeciesResponse>(detail.species.url, signal),
        fetchAbilityName(detail.abilities[0], signal),
    ]);
    return {
        pokemon: toPokemon(detail, species),
        height: detail.height / 10,
        weight: detail.weight / 10,
        ability,
        stats: profileStats.map(({ name, label }) => ({
            label,
            value:
                detail.stats.find((entry) => entry.stat.name === name)
                    ?.base_stat ?? 0,
        })),
        description: getDescription(species),
    };
}
