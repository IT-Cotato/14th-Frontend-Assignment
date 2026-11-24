import { useQueries, useQuery } from '@tanstack/react-query';
import { fetchPokemonByIdOrName } from '../api/pokeapi';
import { pokemonKeys, teamKeys } from '../api/queryKeys';
import { fetchTeam } from '../api/team';
import { POKEMONS } from '../data/pokemons';
import type { TeamMember } from '../types/pokemon';

export type TeamStatus = 'loading' | 'error' | 'success';

function findLocalPokemon(id: number) {
  return POKEMONS.find((pokemon) => pokemon.id === id);
}

export function useTeam() {
  const teamQuery = useQuery({
    queryKey: teamKeys.all,
    queryFn: () => fetchTeam(),
  });

  const items = teamQuery.data ?? [];
  const remoteIds = items
    .map((item) => item.pokemonId)
    .filter((id) => findLocalPokemon(id) === undefined);

  const pokemonQueries = useQueries({
    queries: remoteIds.map((id) => ({
      queryKey: pokemonKeys.detail(id),
      queryFn: ({ signal }: { signal: AbortSignal }) => fetchPokemonByIdOrName(String(id), signal),
    })),
  });

  const members: TeamMember[] = items.flatMap((item) => {
    const pokemon =
      findLocalPokemon(item.pokemonId) ?? pokemonQueries[remoteIds.indexOf(item.pokemonId)]?.data;
    if (!pokemon) return [];
    return [
      {
        teamPokemonId: item.id,
        pokemon,
        nickname: item.nickname,
        role: item.role || undefined,
        memo: item.memo,
      },
    ];
  });

  const missingQueries = pokemonQueries.filter((query) => query.data === undefined);

  let status: TeamStatus = 'success';
  if (teamQuery.data === undefined) {
    status = teamQuery.isError && !teamQuery.isFetching ? 'error' : 'loading';
  } else if (missingQueries.length > 0) {
    const isFetching = missingQueries.some((query) => query.isFetching);
    status = !isFetching && missingQueries.some((query) => query.isError) ? 'error' : 'loading';
  }

  function retry() {
    if (teamQuery.data === undefined) {
      void teamQuery.refetch();
      return;
    }
    missingQueries.forEach((query) => void query.refetch());
  }

  return {
    status,
    members,
    pokemonIds: items.map((item) => item.pokemonId),
    retry,
  };
}