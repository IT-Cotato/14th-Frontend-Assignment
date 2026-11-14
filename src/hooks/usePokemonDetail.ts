import { useQuery } from '@tanstack/react-query';
import { fetchPokemonDetail, isNotFoundError } from '../api/pokeapi';
import { pokemonKeys } from '../api/queryKeys';

export type PokemonDetailStatus = 'loading' | 'error' | 'notFound' | 'success';

export function usePokemonDetail(pokemonId: string) {
  const idOrName = pokemonId.trim().toLowerCase();

  const query = useQuery({
    queryKey: pokemonKeys.profile(idOrName),
    queryFn: ({ signal }) => fetchPokemonDetail(idOrName, signal),
  });

  let status: PokemonDetailStatus = 'loading';
  if (query.data) status = 'success';
  else if (query.isError && !query.isFetching) {
    status = isNotFoundError(query.error) ? 'notFound' : 'error';
  }

  function retry() {
    void query.refetch();
  }

  return { status, pokemon: query.data, retry };
}