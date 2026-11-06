import { useEffect, useRef, useState } from 'react'
import { searchPokemon } from '../api/pokemon'
import type { Pokemon } from '../types/pokemon'

type SearchState = {
  query: string
  status: 'loading' | 'success' | 'empty' | 'error'
  pokemon: Pokemon | null
}

export function usePokemonSearch() {
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState<SearchState | null>(null)
  const searchController = useRef<AbortController | null>(null)

  function changeQuery(value: string) {
    searchController.current?.abort()
    setQuery(value)
    setSearch(null)
  }

  async function submitSearch(value: string) {
    searchController.current?.abort()
    const term = value.trim()
    setQuery(term)
    if (!term) {
      setSearch(null)
      return
    }
    const controller = new AbortController()
    searchController.current = controller
    setSearch({ query: term, status: 'loading', pokemon: null })
    try {
      const result = await searchPokemon(term, controller.signal)
      if (controller.signal.aborted || searchController.current !== controller) return
      setSearch({ query: term, status: result ? 'success' : 'empty', pokemon: result })
    } catch {
      if (controller.signal.aborted || searchController.current !== controller) return
      setSearch({ query: term, status: 'error', pokemon: null })
    }
  }

  useEffect(() => () => searchController.current?.abort(), [])

  return { query, search, changeQuery, submitSearch }
}
