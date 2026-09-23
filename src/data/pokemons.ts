import pikachu from "../assets/pikachu.png";
import charizard from "../assets/charizard.png";
import bulbasaur from "../assets/bulbasaur.png";
import blastoise from "../assets/blastoise.png";

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
    {
        id: 25,
        name: "피카츄",
        types: ["electric"],
        imageUrl: pikachu,
    },
    {
        id: 6,
        name: "리자몽",
        types: ["fire", "flying"],
        imageUrl: charizard,
    },
    {
        id: 1,
        name: "이상해씨",
        types: ["grass", "poison"],
        imageUrl: bulbasaur,
    },
    {
        id: 9,
        name: "거북왕",
        types: ["water"],
        imageUrl: blastoise,
    },
];
