import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { searchPokemon } from '../api/pokemon'
import type { Pokemon } from '../types/pokemon'

type SearchState = {
  query: string
  status: 'loading' | 'success' | 'empty' | 'error'
  pokemon: Pokemon | null
}

export function usePokemonSearch() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const term = query.trim()
  // q alone is a submitted search; draft=1 preserves unfinished input too.
  const submitted = term !== '' && params.get('draft') !== '1'
  const result = useQuery({
    queryKey: ['pokemon', 'search', term, submitted],
    queryFn: ({ signal }) => searchPokemon(term, signal),
    enabled: submitted,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  function changeQuery(value: string) {
    setParams((current) => {
      const next = new URLSearchParams(current)
      if (value) {
        next.set('q', value)
        next.set('draft', '1')
      } else {
        next.delete('q')
        next.delete('draft')
      }
      return next
    }, { replace: true })
  }

  function submitSearch(value: string) {
    const valueToSearch = value.trim()
    if (submitted && valueToSearch === term) {
      void result.refetch()
      return
    }
    setParams((current) => {
      const next = new URLSearchParams(current)
      if (valueToSearch) next.set('q', valueToSearch)
      else next.delete('q')
      next.delete('draft')
      return next
    })
  }

  const search: SearchState | null = submitted ? {
    query: term,
    status: result.isPending ? 'loading' : result.isError ? 'error' : result.data ? 'success' : 'empty',
    pokemon: result.data ?? null,
  } : null

  return { query, search, changeQuery, submitSearch }
}
