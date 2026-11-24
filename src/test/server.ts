import { setupServer } from 'msw/node';
import { TEAM_STORAGE_KEY, createTeamHandlers } from '../mocks/team';

const storage = new Map<string, string>();

export const server = setupServer(
  ...createTeamHandlers({
    storage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => {
        storage.set(key, value);
      },
    },
    latencyMs: 0,
  }),
);

export function seedTeam(pokemonIds: readonly number[]) {
  const team = pokemonIds.map((pokemonId, index) => ({
    id: `seed-${index + 1}`,
    pokemonId,
    nickname: '',
    role: '',
    memo: '',
  }));
  storage.set(TEAM_STORAGE_KEY, JSON.stringify(team));
}

export function readTeam(): { id: string; pokemonId: number; nickname: string }[] {
  return JSON.parse(storage.get(TEAM_STORAGE_KEY) ?? '[]');
}

export function resetTeamStorage() {
  storage.clear();
}