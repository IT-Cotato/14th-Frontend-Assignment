import type { Pokemon } from '../types/pokemon';
import { POKEMONS } from './pokemons';

export const TEAM_SIZE = 6;

const TEAM_IDS = [25, 6, 1];

// 도감에 없는 번호는 flatMap에서 빈 배열로 걸러지고, 정원을 넘는 인원은 잘라냄.
export const TEAM: readonly Pokemon[] = TEAM_IDS.flatMap(
  (id) => POKEMONS.find((pokemon) => pokemon.id === id) ?? [],
).slice(0, TEAM_SIZE);
