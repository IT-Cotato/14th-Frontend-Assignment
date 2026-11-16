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
    sprites: {
        front_default: string | null; //sprites는 객체이고, 그 안의 front_default는 문자열 또는 null이다.
    };

    types: {
        type: {
            name: string
        };
    }[];

    species: {
        url: string
    }

};

type PokemonSpeciesResponse = {
    names: {
        name: string,
        language: { 
            name: string 
        };
    }[];
};

export async function fetchPokemonDetail(url : string): Promise<Pokemon>{
    
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

    return {
        id: data.id,
        name: koreanEntry?.name ?? data.name,
        image: data.sprites.front_default ?? chuImg,
        types: data.types.map((item) => {
            return item.type.name.toUpperCase();
        }),
    };
}