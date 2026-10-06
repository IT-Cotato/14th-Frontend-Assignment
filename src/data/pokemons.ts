import pikachu from "../assets/pikachu.png";
import charizard from "../assets/charizard.png";
import bulbasaur from "../assets/bulbasaur.png";
import blastoise from "../assets/blastoise.png";
import eevee from "../assets/eevee.png";
import gengar from "../assets/gengar.png";
import psyduck from "../assets/psyduck.png";
import dragonite from "../assets/dragonite.png";

export type PokemonType =
    | "normal"
    | "fire"
    | "water"
    | "electric"
    | "grass"
    | "ice"
    | "fighting"
    | "poison"
    | "ground"
    | "flying"
    | "psychic"
    | "bug"
    | "rock"
    | "ghost"
    | "dragon"
    | "dark"
    | "steel"
    | "fairy";

export type Pokemon = {
    id: number;
    name: string;
    types: PokemonType[];
    imageUrl: string;
};

export const pokemons: Pokemon[] = [
    { id: 25, name: "피카츄", types: ["electric"], imageUrl: pikachu },
    { id: 6, name: "리자몽", types: ["fire"], imageUrl: charizard },
    { id: 1, name: "이상해씨", types: ["grass"], imageUrl: bulbasaur },
    { id: 9, name: "거북왕", types: ["water"], imageUrl: blastoise },
    { id: 133, name: "이브이", types: ["normal"], imageUrl: eevee },
    { id: 94, name: "팬텀", types: ["ghost"], imageUrl: gengar },
    { id: 54, name: "고라파덕", types: ["water"], imageUrl: psyduck },
    { id: 149, name: "망나뇽", types: ["dragon"], imageUrl: dragonite },
];

export const typeLabels: Record<PokemonType, string> = {
    normal: "노말",
    fire: "불꽃",
    water: "물",
    electric: "전기",
    grass: "풀",
    ice: "얼음",
    fighting: "격투",
    poison: "독",
    ground: "땅",
    flying: "비행",
    psychic: "에스퍼",
    bug: "벌레",
    rock: "바위",
    ghost: "고스트",
    dragon: "드래곤",
    dark: "악",
    steel: "강철",
    fairy: "페어리",
};

export const pokemonTypes = Object.keys(typeLabels) as PokemonType[];

export type SortOrder = "asc" | "desc";

export type PokemonFilters = {
    types: PokemonType[];
    sortOrder: SortOrder | null; // null이면 기본(데이터) 순서
};

export const DEFAULT_FILTERS: PokemonFilters = {
    types: [],
    sortOrder: null,
};

export const sortOrderLabels: Record<SortOrder, string> = {
    asc: "번호 ↑",
    desc: "번호 ↓",
};

// 이름 일부 또는 도감 번호("25", "025", "#0025")로 검색
export function matchesQuery(pokemon: Pokemon, query: string) {
    const keyword = query.trim().replace(/^#/, "");
    if (keyword === "") {
        return true;
    }
    if (/^\d+$/.test(keyword)) {
        return pokemon.id === Number(keyword);
    }
    return pokemon.name.includes(keyword);
}

// 선택한 타입이 없으면 전체, 있으면 하나라도 일치하면 표시
export function matchesTypes(pokemon: Pokemon, selectedTypes: PokemonType[]) {
    return (
        selectedTypes.length === 0 ||
        pokemon.types.some((type) => selectedTypes.includes(type))
    );
}

// 렌더링 중 계산: 목록에 실제로 있는 타입만
export function getAvailableTypes(list: Pokemon[]) {
    return pokemonTypes.filter((type) =>
        list.some((pokemon) => pokemon.types.includes(type)),
    );
}

// 렌더링 중 계산: 검색어·타입·정렬을 적용한 목록
export function getVisiblePokemons(
    list: Pokemon[],
    query: string,
    filters: PokemonFilters,
) {
    const filtered = list.filter(
        (pokemon) =>
            matchesQuery(pokemon, query) &&
            matchesTypes(pokemon, filters.types),
    );
    if (filters.sortOrder === null) {
        return filtered;
    }
    // sort는 원본을 바꾸므로 복사본을 정렬
    return [...filtered].sort((a, b) =>
        filters.sortOrder === "asc" ? a.id - b.id : b.id - a.id,
    );
}
