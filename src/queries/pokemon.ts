import { queryOptions } from '@tanstack/react-query'
import { fetchPokemonCardResults, fetchPokemonList } from '../api/pokemon'



export function pokemonPageOptions(limit: number, offset: number) {
  return queryOptions({
    queryKey: ['pokemon', 'list', { limit, offset }] as const,
    queryFn: async ({ queryKey, signal }) => {
      const { limit: pageSize, offset: pageOffset } = queryKey[2]
      if (pageOffset < 0 || pageSize <= 0) {
        throw new Error('도감 페이지 범위를 벗어났습니다.')
      }
      const requestSize = pageSize
      const page = await fetchPokemonList(requestSize, pageOffset, signal)
      const count = page.count
      const results = page.results
      const cards = await fetchPokemonCardResults(results, signal)
      signal.throwIfAborted()
      return {
        count,
        next: page.next,
        previous: page.previous,
        cards,
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  })
}
