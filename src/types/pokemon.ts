export type PokemonType =
  | 'NORMAL'
  | 'FIRE'
  | 'WATER'
  | 'ELECTRIC'
  | 'GRASS'
  | 'ICE'
  | 'FIGHTING'
  | 'POISON'
  | 'GROUND'
  | 'FLYING'
  | 'PSYCHIC'
  | 'BUG'
  | 'ROCK'
  | 'GHOST'
  | 'DRAGON'
  | 'DARK'
  | 'STEEL'
  | 'FAIRY';

export interface Pokemon {
  id: number;
  name: string;
  types: readonly PokemonType[];
  imageUrl: string;
}
export interface FailedPokemon {
  id: number;
  failed: true;
}

export type TeamRole = '공격' | '방어' | '서포트';

export interface TeamMember {
  pokemon: Pokemon;
  nickname: string;
  role?: TeamRole;
}


export type SortOrder = 'asc' | 'desc';