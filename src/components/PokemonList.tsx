import { useEffect, useState, type FormEvent } from 'react'
import searchIcon from '../assets/search.svg'
import { POKEMON, type Pokemon, type PokemonType } from '../pokemon'
import PokemonCard from './PokemonCard'

interface PokemonListProps {
  items?: Pokemon[]
  mode?: 'featured' | 'catalog' | 'team'
  onAdd?: (pokemon: Pokemon) => void
  onEdit?: (id: number) => void
  onView?: (id: number) => void
  teamIds?: number[]
  teamFull?: boolean
}

interface PokemonListResponse {
  results: Array<{ name: string; url: string }>
}

interface PokemonDetailResponse {
  id: number
  name: string
  sprites: {
    front_default: string | null
    other?: { 'official-artwork'?: { front_default: string | null } }
  }
  types: Array<{ type: { name: string } }>
}

interface ApiCardEntry {
  key: string
  name: string
  url: string
  status: 'loading' | 'success' | 'error'
  pokemon?: Pokemon
}

type RequestStatus = 'loading' | 'success' | 'empty' | 'error'

const API_URL = 'https://pokeapi.co/api/v2/pokemon'

const toPokemon = (detail: PokemonDetailResponse): Pokemon => ({
  id: detail.id,
  number: String(detail.id).padStart(4, '0'),
  name: detail.name.replaceAll('-', ' '),
  type: (detail.types[0]?.type.name.toUpperCase() ?? 'NORMAL') as PokemonType,
  imageUrl:
    detail.sprites.other?.['official-artwork']?.front_default ??
    detail.sprites.front_default ??
    '',
})

const getIdFromUrl = (url: string) => Number(url.split('/').filter(Boolean).at(-1))

function PokemonList({
  items = POKEMON,
  mode = 'featured',
  onAdd,
  onEdit,
  onView,
  teamIds = [],
  teamFull = false,
}: PokemonListProps) {
  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('loading')
  const [apiCards, setApiCards] = useState<ApiCardEntry[]>([])

  useEffect(() => {
    if (mode !== 'catalog') return

    const controller = new AbortController()

    const fetchDetail = async (url: string) => {
      const response = await fetch(url, { signal: controller.signal })
      if (!response.ok) throw new Error(`상세 요청 실패: ${response.status}`)
      return toPokemon(await response.json() as PokemonDetailResponse)
    }

    const loadPokemon = async () => {
      setRequestStatus('loading')
      setApiCards([])

      try {
        if (submittedQuery) {
          const response = await fetch(`${API_URL}/${encodeURIComponent(submittedQuery)}`, {
            signal: controller.signal,
          })

          if (response.status === 404) {
            setRequestStatus('empty')
            return
          }
          if (!response.ok) throw new Error(`검색 요청 실패: ${response.status}`)

          const pokemon = toPokemon(await response.json() as PokemonDetailResponse)
          setApiCards([{ key: String(pokemon.id), name: pokemon.name, url: `${API_URL}/${pokemon.id}`, status: 'success', pokemon }])
          setRequestStatus('success')
          return
        }

        const listResponse = await fetch(`${API_URL}?limit=20&offset=0`, {
          signal: controller.signal,
        })
        if (!listResponse.ok) throw new Error(`목록 요청 실패: ${listResponse.status}`)

        const listData = await listResponse.json() as PokemonListResponse
        if (listData.results.length === 0) {
          setRequestStatus('empty')
          return
        }

        const cards = await Promise.all(
          listData.results.map(async (item): Promise<ApiCardEntry> => {
            try {
              const pokemon = await fetchDetail(item.url)
              return { key: item.url, name: item.name, url: item.url, status: 'success', pokemon }
            } catch (error) {
              if (error instanceof DOMException && error.name === 'AbortError') throw error
              return { key: item.url, name: item.name, url: item.url, status: 'error' }
            }
          }),
        )

        if (!controller.signal.aborted) {
          setApiCards(cards)
          setRequestStatus('success')
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setRequestStatus('error')
      }
    }

    void loadPokemon()
    return () => controller.abort()
  }, [mode, retryCount, submittedQuery])

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmittedQuery(query.trim().toLowerCase())
    setRetryCount((count) => count + 1)
  }

  const retryRequest = () => setRetryCount((count) => count + 1)

  const retryCard = async (entry: ApiCardEntry) => {
    setApiCards((cards) => cards.map((card) =>
      card.key === entry.key ? { ...card, status: 'loading' } : card,
    ))

    try {
      const response = await fetch(entry.url)
      if (!response.ok) throw new Error(`상세 요청 실패: ${response.status}`)
      const pokemon = toPokemon(await response.json() as PokemonDetailResponse)
      setApiCards((cards) => cards.map((card) =>
        card.key === entry.key ? { ...card, status: 'success', pokemon } : card,
      ))
    } catch {
      setApiCards((cards) => cards.map((card) =>
        card.key === entry.key ? { ...card, status: 'error' } : card,
      ))
    }
  }

  const renderCard = (pokemon: Pokemon) => (
    <PokemonCard
      {...pokemon}
      actionDisabled={mode !== 'team' && (teamFull || teamIds.includes(pokemon.id))}
      actionLabel={
        mode === 'team'
          ? '편집'
          : teamIds.includes(pokemon.id)
            ? '추가됨'
            : teamFull
              ? '팀 가득 참'
              : '팀에 추가'
      }
      key={pokemon.id}
      onAction={mode === 'team' ? (selectedPokemon) => onEdit?.(selectedPokemon.id) : onAdd}
      onView={mode === 'catalog' ? undefined : onView}
    />
  )

  if (mode !== 'catalog') {
    return (
      <section className={`pokemon-list-wrap pokemon-list-wrap--${mode}`} aria-label="포켓몬 목록">
        <div className="pokemon-list">
          {items.length === 0 ? (
            <div className="pokemon-list__empty">
              <strong>포켓몬이 없어요</strong>
              <span>표시할 포켓몬을 추가해 주세요.</span>
            </div>
          ) : items.map(renderCard)}
        </div>
      </section>
    )
  }

  return (
    <section className="pokemon-list-wrap pokemon-list-wrap--catalog" aria-labelledby="live-pokedex-title">
      <div className="live-pokedex-heading">
        <div>
          <h1 id="live-pokedex-title">실시간 포켓몬 도감</h1>
          <p>이름이나 도감 번호로 포켓몬을 바로 찾아보세요.</p>
        </div>
        <span className={`api-status api-status--${requestStatus}`}>
          {requestStatus === 'error' ? 'PokéAPI 연결 오류' : requestStatus === 'loading' ? 'PokéAPI 연결 중' : 'PokéAPI 온라인'}
        </span>
      </div>

      <form className="catalog-search" role="search" onSubmit={submitSearch}>
        <label>
          <span className="sr-only">영문 이름 또는 도감 번호 검색</span>
          <img src={searchIcon} alt="" />
          <input
            type="search"
            placeholder="pikachu 또는 25"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <button type="submit">검색</button>
      </form>

      {requestStatus === 'loading' && (
        <div className="api-state-panel" role="status">
          <span className="api-state-panel__symbol">…</span>
          <strong>포켓몬을 불러오는 중</strong>
          <p>잠시만 기다려 주세요.</p>
        </div>
      )}

      {requestStatus === 'empty' && (
        <div className="api-state-panel api-state-panel--empty">
          <span className="api-state-panel__symbol">0</span>
          <strong>검색 결과가 없어요</strong>
          <p>존재하는 영문 이름이나 도감 번호인지 확인해 주세요.</p>
          <button type="button" onClick={() => {
            setQuery('')
            setSubmittedQuery('')
          }}>목록으로 돌아가기</button>
        </div>
      )}

      {requestStatus === 'error' && (
        <div className="api-state-panel api-state-panel--error" role="alert">
          <span className="api-state-panel__symbol">!</span>
          <strong>연결이 원활하지 않아요</strong>
          <p>네트워크를 확인하고 다시 시도해 주세요.</p>
          <button type="button" onClick={retryRequest}>다시 시도</button>
        </div>
      )}

      {requestStatus === 'success' && (
        <div className="pokemon-list pokemon-list--api">
          {apiCards.map((entry) => {
            if (entry.status === 'success' && entry.pokemon) return renderCard(entry.pokemon)

            return (
              <article className={`pokemon-card pokemon-card--${entry.status}`} key={entry.key}>
                <span className="pokemon-card__artwork pokemon-card__artwork--fallback">
                  {entry.status === 'loading' ? '…' : '!'}
                </span>
                <span className="pokemon-card__number">#{String(getIdFromUrl(entry.url)).padStart(4, '0')}</span>
                <strong className="pokemon-card__name">
                  {entry.status === 'loading' ? '다시 불러오는 중' : '상세 정보 실패'}
                </strong>
                <button
                  className="pokemon-card__team-button"
                  type="button"
                  disabled={entry.status === 'loading'}
                  onClick={() => void retryCard(entry)}
                >
                  {entry.status === 'loading' ? '불러오는 중…' : '다시 시도'}
                </button>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default PokemonList
