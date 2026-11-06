import { queryOptions } from '@tanstack/react-query'
import { fetchPokemonCardResults, fetchPokemonList } from '../api/pokemon'

const POKEMON_LIMIT = 32

export function pokemonPageOptions(limit: number, offset: number) {
  return queryOptions({
    queryKey: ['pokemon', 'list', { limit, offset, maxCount: POKEMON_LIMIT }] as const,
    queryFn: async ({ queryKey, signal }) => {
      const { limit: pageSize, offset: pageOffset, maxCount } = queryKey[2]
      if (pageOffset < 0 || pageOffset >= maxCount || pageSize <= 0) {
        throw new Error('도감 페이지 범위를 벗어났습니다.')
      }
      const requestSize = Math.min(pageSize, maxCount - pageOffset)
      const page = await fetchPokemonList(requestSize, pageOffset, signal)
      const count = Math.min(page.count, maxCount)
      const results = page.results.slice(0, Math.max(0, count - pageOffset))
      const cards = await fetchPokemonCardResults(results, signal)
      signal.throwIfAborted()
      return {
        count,
        next: pageOffset + pageSize < count ? page.next : null,
        previous: pageOffset > 0 ? page.previous : null,
        cards,
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  })
}
