import { useEffect, useRef, useState } from 'react'
import { fetchPokemonCardResults, fetchPokemonCard, fetchPokemonList, searchPokemon } from '../../api/pokemon'
import type { PokemonCardResult } from '../../api/pokemon.types'
import PokemonCard from '../PokemonCard/PokemonCard'
import PokemonErrorCard from '../PokemonCard/PokemonErrorCard'
import type { Pokemon } from '../../types/pokemon'
import { filterPokemon } from '../../utils/filterPokemon'
import PokemonSearch from '../PokemonSearch/PokemonSearch'
import PokemonList from '../PokemonList/PokemonList'
import StatePanel from '../StatePanel/StatePanel'

type PokedexPageProps = {
  onAdd: (pokemon: Pokemon) => void
}

type SearchState = {
  query: string
  status: 'loading' | 'success' | 'empty' | 'error'
  pokemon: Pokemon | null
}

function PokedexPage({ onAdd }: PokedexPageProps) {
  const [cards, setCards] = useState<PokemonCardResult[]>([])
  const [retryingUrls, setRetryingUrls] = useState<string[]>([])
  const retryControllers = useRef(new Map<string, AbortController>())
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState<SearchState | null>(null)
  const searchController = useRef<AbortController | null>(null)
  const listController = useRef<AbortController | null>(null)
  const [listRequest, setListRequest] = useState(0)

  function retryList() {
    listController.current?.abort()
    retryControllers.current.forEach((request) => request.abort())
    retryControllers.current.clear()
    setRetryingUrls([])
    setCards([])
    setError('')
    setLoading(true)
    setListRequest((current) => current + 1)
  }

  async function retryCard(card: PokemonCardResult) {
    if (retryControllers.current.has(card.url)) return
    const controller = new AbortController()
    retryControllers.current.set(card.url, controller)
    setRetryingUrls((current) => [...current, card.url])
    try {
      const pokemon = await fetchPokemonCard(card.url, controller.signal)
      if (controller.signal.aborted) return
      setCards((current) => current.map((item) => item.url === card.url
        ? { url: card.url, failed: false, pokemon } : item))
    } catch {
      // 재시도 실패 시 해당 오류 카드를 유지하고 다른 카드는 변경하지 않습니다.
    } finally {
      retryControllers.current.delete(card.url)
      if (!controller.signal.aborted) setRetryingUrls((current) => current.filter((url) => url !== card.url))
    }
  }

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

  useEffect(() => {
    const controller = new AbortController()
    listController.current = controller
    let active = true

    async function load() {
      try {
        const resources = await fetchPokemonList(controller.signal)
        if (!active || controller.signal.aborted) return
        // 전체 상세 응답을 기다리지 않고 준비된 카드부터 표시합니다.
        for (let offset = 0; offset < resources.length; offset += 24) {
          const batch = await fetchPokemonCardResults(resources.slice(offset, offset + 24), controller.signal)
          if (!active || controller.signal.aborted) return
          setCards((current) => [...current, ...batch])
        }
      } catch (cause) {
        if (!active || controller.signal.aborted) return
        setError(cause instanceof Error ? cause.message : '포켓몬을 불러오지 못했어요.')
      } finally {
        if (active && !controller.signal.aborted) setLoading(false)
      }
    }

    void load()
    return () => {
      active = false
      controller.abort()
    }
  }, [listRequest])

  useEffect(() => {
    const pendingRetries = retryControllers.current
    return () => {
      searchController.current?.abort()
      pendingRetries.forEach((request) => request.abort())
      pendingRetries.clear()
    }
  }, [])

  // 검색 결과는 파생 값이므로 별도 state나 Effect가 필요하지 않습니다.
  const filteredCards = cards.filter((card) => filterPokemon([card.pokemon], query, '').length > 0)

  return (
    <>
      <div className="pokedex-heading">
        <div>
          <h1 className="pokedex-title">실시간 포켓몬 도감</h1>
          <p className="pokedex-description">이름이나 도감 번호로 포켓몬을 바로 찾아보세요.</p>
        </div>
        <span className="pokedex-count-badge">
          {error ? 'PokéAPI 요청 실패' : loading ? 'PokéAPI 불러오는 중' : 'PokéAPI 온라인'}
        </span>
      </div>
      <PokemonSearch query={query} onQueryChange={changeQuery} onSearch={submitSearch}
        types={[]} selectedType="" onTypeChange={() => {}} />
      {search ? (
        <>
          {search.status === 'loading' && <StatePanel variant="loading" />}
          {search.status === 'empty' && <StatePanel variant="empty" />}
          {search.status === 'error' && (
            <StatePanel variant="error" onRetry={() => void submitSearch(search.query)} />
          )}
          {search.status === 'success' && search.pokemon && (
            <PokemonList pokemon={[search.pokemon]} onAdd={onAdd} />
          )}
        </>
      ) : (
        <>
          {filteredCards.length > 0 && (
            <div className="pokemon-card-list">
              {filteredCards.map((card) => card.failed ? (
                <PokemonErrorCard key={card.pokemon.number} pokemon={card.pokemon}
                  retrying={retryingUrls.includes(card.url)} onRetry={() => void retryCard(card)} />
              ) : (
                <PokemonCard key={card.pokemon.number} {...card.pokemon} onAdd={() => onAdd(card.pokemon)} />
              ))}
            </div>
          )}
          {filteredCards.length === 0 && !loading && !error && <StatePanel variant="empty" />}
          {loading && filteredCards.length === 0 && <StatePanel variant="loading" />}
          {error && <StatePanel variant="error" onRetry={retryList} />}
        </>
      )}
    </>
  )
}

export default PokedexPage
