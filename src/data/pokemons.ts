import type { Pokemon } from '../types/pokemon';

import pikachu from '../assets/Pikachu.png';
import charizard from '../assets/Charizard.png';
import bulbasaur from '../assets/Bulbasaur.png';
import blastoise from '../assets/Blastoise.png';

export const POKEMONS: Pokemon[] = [
  { id: 25, name: '피카츄', type: 'ELECTRIC', imageUrl: pikachu },
  { id: 6, name: '리자몽', type: 'FIRE', imageUrl: charizard },
  { id: 1, name: '이상해씨', type: 'GRASS', imageUrl: bulbasaur },
  { id: 9, name: '거북왕', type: 'WATER', imageUrl: blastoise },
];
