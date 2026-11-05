import { useState, type FormEvent } from 'react'
import searchIcon from '../assets/search.svg'
import {
  getPageParamsFromUrl,
  usePokemonPage,
  usePokemonSearch,
  type PokemonCardModel,
  type PokemonPageParams,
} from '../hooks/usePokemonPage'
import { POKEMON, type Pokemon } from '../pokemon'
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

const INITIAL_PAGE: PokemonPageParams = { limit: 20, offset: 0 }

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
  const [pageParams, setPageParams] = useState<PokemonPageParams>(INITIAL_PAGE)
  const isCatalog = mode === 'catalog'
  const pageQuery = usePokemonPage(pageParams, isCatalog)
  const searchQuery = usePokemonSearch(submittedQuery, isCatalog)

  const isSearching = submittedQuery.length > 0
  const searchResult = searchQuery.data
  const pageData = pageQuery.data
  const isInitialLoading = isSearching
    ? searchQuery.isPending
    : pageQuery.isPending && !pageData
  const hasFullError = isSearching
    ? searchQuery.isError
    : pageQuery.isError && !pageData
  const isEmpty = isSearching && searchQuery.isSuccess && searchResult === null
  const isBackgroundFetching = isSearching
    ? searchQuery.isFetching && searchResult !== undefined
    : pageQuery.isFetching && Boolean(pageData)

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmittedQuery(query.trim().toLowerCase())
  }

  const clearSearch = () => {
    setQuery('')
    setSubmittedQuery('')
  }

  const retryActiveRequest = () => {
    if (isSearching) {
      void searchQuery.refetch()
      return
    }
    void pageQuery.refetch()
  }

  const moveToPage = (url: string | null) => {
    if (!url) return
    setPageParams(getPageParamsFromUrl(url))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderPokemonCard = (pokemon: Pokemon) => (
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

  const renderApiCard = (card: PokemonCardModel) => {
    if (card.status === 'success') return renderPokemonCard(card.pokemon)

    return (
      <article className="pokemon-card pokemon-card--error" key={card.key}>
        <span className="pokemon-card__artwork pokemon-card__artwork--fallback">!</span>
        <span className="pokemon-card__number">#{String(card.id).padStart(4, '0')}</span>
        <strong className="pokemon-card__name">상세 정보 실패</strong>
        <button className="pokemon-card__team-button" type="button" onClick={() => void pageQuery.refetch()}>
          다시 시도
        </button>
      </article>
    )
  }

  if (mode !== 'catalog') {
    return (
      <section className={`pokemon-list-wrap pokemon-list-wrap--${mode}`} aria-label="포켓몬 목록">
        <div className="pokemon-list">
          {items.length === 0 ? (
            <div className="pokemon-list__empty">
              <strong>포켓몬이 없어요</strong>
              <span>표시할 포켓몬을 추가해 주세요.</span>
            </div>
          ) : items.map(renderPokemonCard)}
        </div>
      </section>
    )
  }

  const currentPage = Math.floor(pageParams.offset / pageParams.limit) + 1
  const visibleCards = isSearching
    ? searchResult ? [renderPokemonCard(searchResult)] : []
    : pageData?.cards.map(renderApiCard) ?? []

  return (
    <section className="pokemon-list-wrap pokemon-list-wrap--catalog" aria-labelledby="live-pokedex-title">
      <div className="live-pokedex-heading">
        <div>
          <h1 id="live-pokedex-title">포켓몬 도감</h1>
          <p>페이지를 이동해도 이전 포켓몬을 빠르게 다시 볼 수 있어요.</p>
        </div>
        <span className={`cache-status${isBackgroundFetching ? ' is-fetching' : ''}`}>
          {isBackgroundFetching ? '목록 갱신 중…' : '최신 목록'}
        </span>
      </div>

      <form className="catalog-search" role="search" onSubmit={submitSearch}>
        <label>
          <span className="sr-only">영문 이름 또는 도감 번호 검색</span>
          <img src={searchIcon} alt="" />
          <input
            type="search"
            placeholder="이름 또는 번호"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <button type="submit">검색</button>
      </form>

      {isInitialLoading && (
        <div className="api-state-panel" role="status">
          <span className="api-state-panel__symbol">…</span>
          <strong>포켓몬을 불러오는 중</strong>
          <p>잠시만 기다려 주세요.</p>
        </div>
      )}

      {isEmpty && (
        <div className="api-state-panel api-state-panel--empty">
          <span className="api-state-panel__symbol">0</span>
          <strong>검색 결과가 없어요</strong>
          <p>존재하는 영문 이름이나 도감 번호인지 확인해 주세요.</p>
          <button type="button" onClick={clearSearch}>목록으로 돌아가기</button>
        </div>
      )}

      {hasFullError && (
        <div className="api-state-panel api-state-panel--error" role="alert">
          <span className="api-state-panel__symbol">!</span>
          <strong>연결이 원활하지 않아요</strong>
          <p>네트워크를 확인하고 다시 시도해 주세요.</p>
          <button type="button" onClick={retryActiveRequest}>다시 시도</button>
        </div>
      )}

      {!isInitialLoading && !isEmpty && !hasFullError && visibleCards.length > 0 && (
        <>
          {pageQuery.isError && pageData && (
            <p className="background-fetch-error" role="status">
              새 목록을 가져오지 못했지만 캐시된 포켓몬을 표시하고 있어요.
              <button type="button" onClick={retryActiveRequest}>다시 시도</button>
            </p>
          )}
          <div className="pokemon-list pokemon-list--api">{visibleCards}</div>
          {!isSearching && pageData && (
            <nav className="api-pagination" aria-label="도감 페이지 이동">
              <button
                type="button"
                aria-label="이전 페이지"
                disabled={!pageData.previousUrl || pageQuery.isPlaceholderData}
                onClick={() => moveToPage(pageData.previousUrl)}
              >
                ‹
              </button>
              <span aria-current="page">{currentPage}</span>
              <button
                type="button"
                aria-label="다음 페이지"
                disabled={!pageData.nextUrl || pageQuery.isPlaceholderData}
                onClick={() => moveToPage(pageData.nextUrl)}
              >
                ›
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  )
}

export default PokemonList
