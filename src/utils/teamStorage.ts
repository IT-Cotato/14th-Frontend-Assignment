import { isPokemonType } from '../api/pokeapi';
import { POKEMONS } from '../data/pokemons';
import { INITIAL_TEAM, TEAM_ROLES, TEAM_SIZE, createTeamPokemonId } from '../data/team';
import type { Pokemon, TeamMember, TeamRole } from '../types/pokemon';

const STORAGE_KEY = 'pokemate-team';
const TEAM_POKEMON_ID_PATTERN = /^tp_\d+$/;

interface StoredMember {
  teamPokemonId: string;
  pokemon: Pokemon;
  nickname: string;
  role?: TeamRole;
  memo: string;
}

export interface LoadedTeam {
  team: readonly TeamMember[];
  recovered: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toPokemon(value: unknown): Pokemon | null {
  if (!isRecord(value)) return null;

  const { id, name, types, imageUrl } = value;
  const localPokemon = POKEMONS.find((pokemon) => pokemon.id === id);
  if (localPokemon) return localPokemon;

  if (typeof id !== 'number' || typeof name !== 'string' || typeof imageUrl !== 'string') return null;
  if (!Array.isArray(types) || !types.every((type) => typeof type === 'string' && isPokemonType(type))) {
    return null;
  }
  return { id, name, types, imageUrl };
}

function toMember(item: unknown): (Omit<TeamMember, 'teamPokemonId'> & { teamPokemonId?: string }) | null {
  if (!isRecord(item)) return null;

  const { teamPokemonId, nickname, role, memo } = item;
  if (typeof nickname !== 'string') return null;
  if (role !== undefined && !TEAM_ROLES.includes(role as TeamRole)) return null;

  if (teamPokemonId === undefined) {
    const pokemon = POKEMONS.find((entry) => entry.id === item.id);
    return pokemon ? { pokemon, nickname, role: role as TeamRole | undefined, memo: '' } : null;
  }

  if (typeof teamPokemonId !== 'string' || !TEAM_POKEMON_ID_PATTERN.test(teamPokemonId)) return null;
  if (typeof memo !== 'string') return null;

  const pokemon = toPokemon(item.pokemon);
  return pokemon ? { teamPokemonId, pokemon, nickname, role: role as TeamRole | undefined, memo } : null;
}

export function loadTeam(): LoadedTeam {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
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
    if (!member) return recoveredResult;

    const isDuplicate = team.some(
      (current) =>
        current.pokemon.id === member.pokemon.id || current.teamPokemonId === member.teamPokemonId,
    );
    if (isDuplicate) return recoveredResult;

    team.push({ ...member, teamPokemonId: member.teamPokemonId ?? createTeamPokemonId(team) });
  }

  return { team, recovered: false };
}

export function saveTeam(team: readonly TeamMember[]): boolean {
  const data: StoredMember[] = team.map(({ teamPokemonId, pokemon, nickname, role, memo }) => ({
    teamPokemonId,
    pokemon: { id: pokemon.id, name: pokemon.name, types: pokemon.types, imageUrl: pokemon.imageUrl },
    nickname,
    role,
    memo,
  }));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}