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
