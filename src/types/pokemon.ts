export type PokemonType = 'ELECTRIC' | 'FIRE' | 'GRASS' | 'WATER';

export interface Pokemon {
  id: number;
  name: string;
  type: PokemonType;
  imageUrl: string;
}
