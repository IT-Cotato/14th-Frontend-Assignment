import type { TeamMember, TeamRole } from '../types/pokemon';
import { POKEMONS } from './pokemons';

export const TEAM_SIZE = 6;

export const TEAM_ROLES: readonly TeamRole[] = ['공격', '방어', '서포트'];


const INITIAL_MEMBERS: { id: number; role: TeamRole }[] = [
  { id: 25, role: '공격' },
  { id: 6, role: '공격' },
  { id: 1, role: '서포트' },
];

function toTeamPokemonId(number: number): string {
  return `tp_${String(number).padStart(2, '0')}`;
}

export function createTeamPokemonId(team: readonly { teamPokemonId: string }[]): string {
  const maxNumber = Math.max(0, ...team.map(({ teamPokemonId }) => Number(teamPokemonId.slice(3)) || 0));
  return toTeamPokemonId(maxNumber + 1);
}

export const INITIAL_TEAM: readonly TeamMember[] = INITIAL_MEMBERS.flatMap(({ id, role }) => {
  const pokemon = POKEMONS.find((item) => item.id === id);
  return pokemon ? [{ pokemon, nickname: '', role, memo: '' }] : [];
})
  .slice(0, TEAM_SIZE)
  .map((member, index) => ({ ...member, teamPokemonId: toTeamPokemonId(index + 1) }));