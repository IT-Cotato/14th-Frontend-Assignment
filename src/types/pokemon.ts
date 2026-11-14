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

export interface PokemonStat {
  label: 'HP' | 'Attack' | 'Defense' | 'Speed';
  value: number;
}

export interface PokemonDetail extends Pokemon {
  height: number;
  weight: number;
  ability: string;
  description: string;
  stats: PokemonStat[];
}
export interface FailedPokemon {
  id: number;
  failed: true;
}

export interface LoadingPokemon {
  id: number;
  loading: true;
}

export type TeamRole = '공격' | '방어' | '서포트';

export interface TeamMember {
  teamPokemonId: string;
  pokemon: Pokemon;
  nickname: string;
  role?: TeamRole;
  memo: string;
}

export type TeamMemberEdit = Pick<TeamMember, 'nickname' | 'role' | 'memo'>;


export type SortOrder = 'asc' | 'desc';