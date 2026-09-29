import type { Pokemon } from '../types/pokemon';

import pikachu from '../assets/Pikachu.png';
import charizard from '../assets/Charizard.png';
import bulbasaur from '../assets/Bulbasaur.png';
import blastoise from '../assets/Blastoise.png';
import gengar from '../assets/Gengar.png';
import eevee from '../assets/Eevee.png';
import psyduck from '../assets/Psyduck.png';
import dragonite from '../assets/Dragonite.png';

export const POKEMONS: Pokemon[] = [
  { id: 25, name: '피카츄', types: ['ELECTRIC'], imageUrl: pikachu },
  { id: 6, name: '리자몽', types: ['FIRE'], imageUrl: charizard },
  { id: 1, name: '이상해씨', types: ['GRASS'], imageUrl: bulbasaur },
  { id: 9, name: '거북왕', types: ['WATER'], imageUrl: blastoise },
  { id: 94, name: '팬텀', types: ['GHOST', 'POISON'], imageUrl: gengar },
  { id: 133, name: '이브이', types: ['NORMAL'], imageUrl: eevee },
  { id: 54, name: '고라파덕', types: ['WATER'], imageUrl: psyduck },
  { id: 149, name: '망나뇽', types: ['DRAGON', 'FLYING'], imageUrl: dragonite },
];