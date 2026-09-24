import type { Pokemon } from "../types/pokemon";
import pikachu from "../assets/pokemon/Pikachu.png";
import charizard from "../assets/pokemon/Charizard.png";
import bulbasaur from "../assets/pokemon/Bulbasaur.png";
import blastoise from "../assets/pokemon/Blastoise.png";

export const pokemons: Pokemon[] = [
  { id: "#0025", name: "피카츄", image: pikachu, type: "electric" },
  { id: "#0006", name: "리자몽", image: charizard, type: "fire" },
  { id: "#0001", name: "이상해씨", image: bulbasaur, type: "grass" },
  { id: "#0009", name: "거북왕", image: blastoise, type: "water" },
];
