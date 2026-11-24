import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pokemonKeys, teamKeys } from '../api/queryKeys';
import { addTeamItem, deleteTeamItem, updateTeamItem, type TeamItemEdit } from '../api/team';
import { POKEMONS } from '../data/pokemons';
import type { Pokemon } from '../types/pokemon';

function useInvalidateTeam() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: teamKeys.all });
}

export function useAddTeamItem() {
  const queryClient = useQueryClient();
  const invalidateTeam = useInvalidateTeam();
  return useMutation({
    mutationFn: (pokemon: Pokemon) => addTeamItem(pokemon.id),
    onSuccess: (_item, pokemon) => {
      const isLocal = POKEMONS.some(({ id }) => id === pokemon.id);
      const detailKey = pokemonKeys.detail(pokemon.id);
      if (!isLocal && queryClient.getQueryData(detailKey) === undefined) {
        queryClient.setQueryData(detailKey, pokemon);
      }
    },
    onSettled: invalidateTeam,
  });
}

export function useUpdateTeamItem() {
  const invalidateTeam = useInvalidateTeam();
  return useMutation({
    mutationFn: ({ id, changes }: { id: string; changes: TeamItemEdit }) => updateTeamItem(id, changes),
    onSettled: invalidateTeam,
  });
}

export function useDeleteTeamItem() {
  const invalidateTeam = useInvalidateTeam();
  return useMutation({
    mutationFn: (id: string) => deleteTeamItem(id),
    onSettled: invalidateTeam,
  });
}