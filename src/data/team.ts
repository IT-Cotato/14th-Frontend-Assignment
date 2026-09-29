import type { TeamMember, TeamRole } from '../types/pokemon';
import { POKEMONS } from './pokemons';

export const TEAM_SIZE = 6;

export const TEAM_ROLES: readonly TeamRole[] = ['공격', '방어', '서포트'];


const INITIAL_MEMBERS: { id: number; role: TeamRole }[] = [
  { id: 25, role: '공격' },
  { id: 6, role: '공격' },
  { id: 1, role: '서포트' },
];

// 도감에 없는 번호는 flatMap에서 빈 배열로 걸러지고, 정원을 넘는 인원은 잘라냄.
export const INITIAL_TEAM: readonly TeamMember[] = INITIAL_MEMBERS.flatMap(({ id, role }) => {
  const pokemon = POKEMONS.find((item) => item.id === id);
  return pokemon ? [{ pokemon, nickname: '', role }] : [];
}).slice(0, TEAM_SIZE);