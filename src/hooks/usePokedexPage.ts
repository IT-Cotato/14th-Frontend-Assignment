import { useQueries, useQuery } from '@tanstack/react-query';
import { POKEDEX_PAGE_SIZE, fetchPokemonByUrl, fetchPokemonList } from '../api/pokeapi';
import { pokemonKeys } from '../api/queryKeys';
import type { FailedPokemon, Pokemon } from '../types/pokemon';

export type PokedexPageStatus = 'loading' | 'error' | 'success';

export function usePokedexPage(offset: number, enabled: boolean) {
  const params = { limit: POKEDEX_PAGE_SIZE, offset };

  const listQuery = useQuery({
    queryKey: pokemonKeys.list(params),
    queryFn: ({ signal }) => fetchPokemonList(params, signal),
    enabled,
  });

  const items = listQuery.data?.items ?? [];

  const detailQueries = useQueries({
    queries: items.map((item) => ({
      queryKey: pokemonKeys.detail(item.id),
      queryFn: ({ signal }) => fetchPokemonByUrl(item.url, signal),
      enabled,
    })),
  });

  let status: PokedexPageStatus = 'success';
  if (listQuery.data === undefined) {
    status = listQuery.isError && !listQuery.isFetching ? 'error' : 'loading';
  } else if (detailQueries.some((query) => !query.isFetched)) {
    status = 'loading';
  }

  const isBackgroundFetching =
    status === 'success' &&
    (listQuery.isFetching || detailQueries.some((query) => query.isFetching));

  const pokemons: (Pokemon | FailedPokemon)[] = items.map(
    (item, index) => detailQueries[index]?.data ?? { id: item.id, failed: true },
  );

  function retry() {
    void listQuery.refetch();
  }

  function retryCard(id: number) {
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return;
    void detailQueries[index].refetch();
  }

  return {
    status,
    isBackgroundFetching,
    pokemons,
    count: listQuery.data?.count ?? 0,
    previousOffset: listQuery.data?.previous?.offset ?? null,
    nextOffset: listQuery.data?.next?.offset ?? null,
    retry,
    retryCard,
  };
}

export type PokedexPage = ReturnType<typeof usePokedexPage>;