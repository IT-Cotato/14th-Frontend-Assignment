import type { Pokemon } from '../PokemonCard';
import chuImg from '../assets/chu.png';

export type PokemonListItem = {
    name: string
    url: string
};

export type PokemonListResponse = {
    next: string | null
    previous: string | null
    results: PokemonListItem[]
}

export async function fetchPokemonList(
    limit: number,
    offset: number
): Promise<PokemonListResponse> {
    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );
 
    if(!response.ok) {
        throw new Error("포켓몬 목록을 가져오지 못했어요.")
    }

    const data: PokemonListResponse = await response.json()

    return data
}

type PokemonDetailResponse = {
    id: number
    name: string
    height: number
    weight: number

    sprites: {
        front_default: string | null; //sprites는 객체이고, 그 안의 front_default는 문자열 또는 null이다.
        other: {
            'official-artwork': {
                front_default: string | null;
            };
        };
    };

    types: {
        type: {
            name: string
        };
    }[];

    species: {
        url: string
    }

    abilities: {
        ability: {
            name: string
            url: string
        }
    }[];

    stats: {
        base_stat: number
        stat: {
            name: string
        }
    }[];
};

type PokemonSpeciesResponse = {
    names: {
        name: string,
        language: { 
            name: string 
        };
    }[];

    flavor_text_entries: {
        flavor_text: string,
        language: { 
            name: string
        }
    }[];
}

type PokemonAbilityResponse = {
    names: {
        name: string
        language: {
            name: string
        }
    }[];
}

export type PokemonDetail = Pokemon & {
    height: number
    weight: number
    description: string
    abilities: string[];
    stats: {
        name: string
        value: number
    }[];
};

async function fetchAbilityName(url: string): Promise<string> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('특성 정보를 가져오지 못했어요.');
    }
    
    const data: PokemonAbilityResponse = await response.json();

    const koreanName = data.names.find((item) => {
        return item.language.name === 'ko'
    });

    return koreanName?.name ?? '특성 이름 없음'
}
export async function fetchPokemonDetail(url : string): Promise<PokemonDetail>{
    
    const response = await fetch(url);

    if (response.status === 404) {
        throw new Error (`POKEMON_NOT_FOUND`)
    }

    if(!response.ok) {
        throw new Error('포켓몬 상세 정보를 가져오지 못했어요.');
    }

    const data: PokemonDetailResponse = await response.json();

    const speciesResponse = await fetch(data.species.url);

    if(!speciesResponse.ok) {
        throw new Error('포켓몬 이름 정보를 가져오지 못했어요.');
    }

    const speciesData: PokemonSpeciesResponse = await speciesResponse.json();

    const koreanEntry = speciesData.names.find((item) => {
        return item.language.name === 'ko'
    });

    const koreanDescription = speciesData.flavor_text_entries.find((item) => {
        return item.language.name === 'ko'
    })

    const abilities = await Promise.all(
        data.abilities.map((item) => {
            return fetchAbilityName(item.ability.url)
        })
    )

    return {
        id: data.id,
        name: koreanEntry?.name ?? data.name,
        image: 
            data.sprites.other['official-artwork'].front_default
            ?? data.sprites.front_default
            ?? chuImg,
        types: data.types.map((item) => {
            return item.type.name.toUpperCase();
        }),
        height: data.height / 10,
        weight: data.weight / 10,
        description: koreanDescription?.flavor_text ?? '설명이 없어요',

        abilities: abilities,

        stats: data.stats.map((item) => {
            return {
                name: item.stat.name,
                value: item.base_stat,
            }
        })
    };
}