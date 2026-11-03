import type { PokemonListParams } from './pokeapi';

export const pokemonKeys = {
  all: ['pokemon'] as const,
  list: (params: PokemonListParams) => ['pokemon', 'list', params] as const,
  detail: (id: number) => ['pokemon', 'detail', id] as const,
};