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

export type TeamRole = '공격' | '방어' | '서포트';

// 팀 슬롯 한 칸에 들어가는 정보: 도감 포켓몬 + 팀에서만 쓰는 별명·역할
export interface TeamMember {
  pokemon: Pokemon;
  nickname: string;
  role?: TeamRole;
}