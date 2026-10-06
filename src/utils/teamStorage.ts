import { POKEMONS } from '../data/pokemons';
import { INITIAL_TEAM, TEAM_ROLES, TEAM_SIZE } from '../data/team';
import type { TeamMember, TeamRole } from '../types/pokemon';

const STORAGE_KEY = 'pokemate-team';


interface StoredMember {
  id: number;
  nickname: string;
  role?: TeamRole;
}

export interface LoadedTeam {
  team: readonly TeamMember[];
  recovered: boolean;
}

function toMember(item: unknown): TeamMember | null {
  if (typeof item !== 'object' || item === null) return null;

  const { id, nickname, role } = item as Record<string, unknown>;
  if (typeof nickname !== 'string') return null;
  if (role !== undefined && !TEAM_ROLES.includes(role as TeamRole)) return null;

  const pokemon = POKEMONS.find((entry) => entry.id === id);
  if (!pokemon) return null;

  return { pokemon, nickname, role: role as TeamRole | undefined };
}

export function loadTeam(): LoadedTeam {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    // 브라우저가 저장소 접근을 막은 경우: 손상이 아니므로 안내 없이 초기 팀
    return { team: INITIAL_TEAM, recovered: false };
  }

  if (raw === null) return { team: INITIAL_TEAM, recovered: false };

  const recoveredResult: LoadedTeam = { team: INITIAL_TEAM, recovered: true };

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return recoveredResult; 
  }

  if (!Array.isArray(data) || data.length > TEAM_SIZE) return recoveredResult;

  const team: TeamMember[] = [];
  for (const item of data) {
    const member = toMember(item);
    if (!member || team.some((current) => current.pokemon.id === member.pokemon.id)) {
      return recoveredResult;
    }
    team.push(member);
  }

  return { team, recovered: false };
}

export function saveTeam(team: readonly TeamMember[]): void {
  const data: StoredMember[] = team.map(({ pokemon, nickname, role }) => ({
    id: pokemon.id,
    nickname,
    role,
  }));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // 저장소를 쓸 수 없는 환경이면 저장만 건너뜀 
  }
}