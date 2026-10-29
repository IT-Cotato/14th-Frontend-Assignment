import { useRef, useState } from 'react'
import type { FormEvent, MouseEvent, ReactNode } from 'react'
import searchIcon from '../assets/pokemon/search.svg'
import { PokeApiHttpError, PokeApiNetworkError } from '../api/pokeapi.ts'
import { pokemonCatalog } from '../data/pokemons.ts'
import type { DexEntry, PokemonDexState } from '../hooks/usePokemonDex.ts'
import type { PokemonSearchState } from '../hooks/usePokemonSearch.ts'
import FilterDialog from './FilterDialog.tsx'
import PokemonCard, { PokemonCardError, PokemonCardLoading } from './PokemonCard.tsx'
import type { Pokemon, PokemonType } from './PokemonCard.tsx'
import StatePanel from './StatePanel.tsx'
import { getTypeOptions, getVisiblePokemons } from '../data/dex.ts'
import type { SortOrder } from '../data/dex.ts'
import { getAddStatus } from '../data/team.ts'
import type { TeamMember } from '../data/team.ts'

/** ?preview 로컬 화면: 한글 이름 일부·번호로 입력하는 즉시 거른다 (W04) */
const localSearchPlaceholder = '피카츄 또는 25'
const localSearchLabel = '포켓몬 이름 또는 번호로 검색'
/** PokéAPI 화면: 제출할 때 도감 번호·영문 이름으로 상세 검색한다 (W05 시안) */
const apiSearchPlaceholder = 'pikachu'
const apiSearchLabel = '도감 번호 또는 영문 이름으로 검색'
const emptyTitle = '검색 결과가 없어요'
const emptyDescription = '다른 이름이나 번호로 검색해 보세요.'

type PokemonListProps = {
  /** preview 설정으로 고른 전체 도감 목록 (검색·필터 적용 전) */
  pokemons: Pokemon[]
  team: TeamMember[]
  onAdd: (pokemon: Pokemon) => void
  /** 입력창에 보이는 원본 값. API 화면에서는 제출 전까지 요청·결과에 영향을 주지 않는다. */
  query: string
  /** 필터 창에서 적용한 타입들. 비어 있으면 전체 (로컬 화면 전용) */
  selectedTypes: PokemonType[]
  /** null이면 번호 정렬 없이 도감 데이터의 원래 순서 (로컬 화면 전용) */
  sortOrder: SortOrder | null
  onQueryChange: (query: string) => void
  onApplyFilter: (types: PokemonType[], sortOrder: SortOrder | null) => void
  /** 검색어와 타입 조건을 함께 해제한다. 정렬 방향은 유지한다. */
  onResetFilters: () => void
  teamPanel: ReactNode
  /**
   * PokéAPI 화면의 목록·검색 요청 상태. 있으면 API 목록과 제출형 상세 검색을 그리고,
   * 없으면(?preview 로컬 데이터) 기존처럼 pokemons에 로컬 검색·필터·정렬을 적용한다.
   */
  api?: {
    dex: {
      state: PokemonDexState
      /** 목록 전체 다시 시도 */
      retry: () => void
      /** 실패한 카드 한 장만 다시 시도 */
      retryEntry: (url: string) => void
    }
    search: {
      state: PokemonSearchState
      /** 입력값을 정리해 검색한다. 비어 있으면 기본 목록으로 돌아간다. */
      submit: (query: string) => void
      /** 마지막으로 제출한 검색어를 다시 요청한다. */
      retry: () => void
    }
  }
}

/** 상세 실패 카드에 쓸 이미지. 같은 번호의 로컬 이미지가 있을 때만 재사용한다. */
function getLocalImageUrl(id: number | null) {
  return pokemonCatalog.find((pokemon) => pokemon.id === id)?.imageUrl
}

/** 요청 실패 안내. 연결 문제와 서버 응답 문제를 나눠 알린다. */
function getRequestErrorMessage(error: unknown, failedTitle: string) {
  if (error instanceof PokeApiNetworkError) {
    return {
      title: '연결이 원활하지 않아요',
      description: '네트워크를 확인하고 다시 시도해 주세요.',
    }
  }
  return {
    title: failedTitle,
    description:
      error instanceof PokeApiHttpError
        ? `잠시 후 다시 시도해 주세요. (HTTP ${error.status})`
        : '잠시 후 다시 시도해 주세요.',
  }
}

function PokemonList({
  pokemons,
  team,
  onAdd,
  query,
  selectedTypes,
  sortOrder,
  onQueryChange,
  onApplyFilter,
  onResetFilters,
  teamPanel,
  api,
}: PokemonListProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  // 필터 창이 열려 있는지만 기억한다. 창 안의 임시 선택은 FilterDialog가 열릴 때마다 새로 만든다.
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // 아래 값들은 props(현재 state)에서 렌더링할 때마다 계산한다. 별도 state로 두지 않는다.
  // 로컬 검색·필터·정렬은 ?preview 로컬 화면에서만 쓴다. API 화면은 제출한 검색어로만 결과가 바뀐다.
  const visiblePokemons = getVisiblePokemons(pokemons, {
    query,
    types: selectedTypes,
    sortOrder,
  })
  const typeOptions = getTypeOptions(pokemons)
  const keyword = query.trim()
  const hasFilter = keyword !== '' || selectedTypes.length > 0
  const conditionText = [
    keyword && `‘${keyword}’ 검색`,
    selectedTypes.length > 0 && `${selectedTypes.join('·')} 타입`,
  ]
    .filter(Boolean)
    .join(' + ')

  function handleRetry() {
    api?.dex.retry()
    // 다시 시도 버튼이 Loading으로 바뀌어 사라지므로 결과 영역 제목으로 포커스를 옮긴다.
    titleRef.current?.focus()
  }

  function handleSearchRetry() {
    // 입력창의 미제출 값이 아니라 마지막으로 제출한 검색어를 다시 요청한다.
    api?.search.retry()
    titleRef.current?.focus()
  }

  function handleEntryRetry(url: string, event: MouseEvent<HTMLButtonElement>) {
    // 실패 카드가 로딩 카드로 바뀌며 버튼이 사라지므로, 그대로 남는 카드 칸(li)으로 포커스를 옮긴다.
    event.currentTarget.closest('li')?.focus()
    api?.dex.retryEntry(url)
  }

  function renderEntry(entry: DexEntry) {
    if (entry.detail.status === 'success') return renderPokemonCard(entry.detail.pokemon)
    if (entry.detail.status === 'error') {
      return (
        <PokemonCardError
          id={entry.id}
          name={entry.name}
          imageUrl={getLocalImageUrl(entry.id)}
          onRetry={(event) => handleEntryRetry(entry.url, event)}
        />
      )
    }
    return <PokemonCardLoading id={entry.id} name={entry.name} />
  }

  function renderPokemonCard(pokemon: Pokemon) {
    return (
      <PokemonCard
        id={pokemon.id}
        name={pokemon.name}
        types={pokemon.types}
        imageUrl={pokemon.imageUrl}
        addStatus={getAddStatus(team, pokemon.id)}
        onAdd={() => onAdd(pokemon)}
        // W05 시안의 PokéAPI 카드는 대표 타입(첫 번째) 하나만 보인다. 데이터의 types는 그대로다.
        visibleTypeCount={api ? 1 : undefined}
      />
    )
  }

  /** 스크린 리더용 결과 안내. Loading·Error는 StatePanel이 직접 알리므로 null이다. */
  function getStatusText() {
    if (!api) {
      return hasFilter
        ? `${conditionText} 결과 ${visiblePokemons.length}마리`
        : `포켓몬 ${visiblePokemons.length}마리`
    }
    const { state: searchState } = api.search
    if (searchState.status === 'success') return `‘${searchState.keyword}’ 검색 결과 1마리`
    if (searchState.status === 'not-found') return `‘${searchState.keyword}’ 검색 결과 없음`
    if (searchState.status === 'idle' && api.dex.state.status === 'success') {
      return `포켓몬 ${api.dex.state.entries.length}마리`
    }
    return null
  }

  /** PokéAPI 화면. 검색 중이면 검색 상태만, 아니면 기본 목록 상태만 그린다. */
  function renderApiResults(dex: NonNullable<PokemonListProps['api']>['dex'], search: PokemonSearchState) {
    // 검색 화면에서는 기본 목록·카드 요청의 결과(늦게 도착한 것 포함)를 그리지 않는다.
    if (search.status === 'loading') {
      return (
        <StatePanel variant="loading" title="포켓몬을 불러오는 중" description="잠시만 기다려 주세요." />
      )
    }
    if (search.status === 'not-found') {
      return (
        <StatePanel
          variant="empty"
          title={emptyTitle}
          description="다른 영문 이름이나 도감 번호로 검색해 보세요."
        />
      )
    }
    if (search.status === 'error') {
      const { title, description } = getRequestErrorMessage(search.error, '포켓몬을 검색하지 못했어요')
      return (
        <StatePanel variant="error" title={title} description={description} onRetry={handleSearchRetry} />
      )
    }
    if (search.status === 'success') {
      return (
        <ul className="card-grid" aria-label="검색 결과">
          {/* 검색으로 받은 상세를 그대로 그린다. 카드가 상세를 다시 요청하지 않는다. */}
          <li>{renderPokemonCard(search.pokemon)}</li>
        </ul>
      )
    }

    if (dex.state.status === 'loading') {
      return (
        <StatePanel variant="loading" title="포켓몬을 불러오는 중" description="잠시만 기다려 주세요." />
      )
    }
    if (dex.state.status === 'error') {
      const { title, description } = getRequestErrorMessage(dex.state.error, '포켓몬 목록을 불러오지 못했어요')
      return <StatePanel variant="error" title={title} description={description} onRetry={handleRetry} />
    }
    if (dex.state.entries.length === 0) {
      return (
        <StatePanel
          variant="empty"
          title="불러온 포켓몬이 없어요"
          description="도감 목록이 비어 있어요. 잠시 후 다시 확인해 주세요."
        />
      )
    }
    return (
      <ul className="card-grid" aria-label="포켓몬 목록">
        {dex.state.entries.map((entry) => (
          // 상세가 오기 전에도 바뀌지 않는 목록 url을 key로 쓴다.
          // tabIndex: 카드 다시 시도 후 포커스를 받을 수 있게 한다. (Tab 순서에는 넣지 않는다)
          <li key={entry.url} tabIndex={-1}>
            {renderEntry(entry)}
          </li>
        ))}
      </ul>
    )
  }

  /** ?preview 로컬 화면 (W04): 로컬 검색·필터·정렬 결과 */
  function renderLocalResults() {
    if (visiblePokemons.length === 0) {
      return (
        <StatePanel
          variant="empty"
          title={emptyTitle}
          description={
            hasFilter
              ? `${conditionText} 조건에 맞는 포켓몬이 없어요. 검색어를 고치거나 ‘필터’에서 타입을 바꾸거나, 조건을 초기화해 보세요.`
              : emptyDescription
          }
        >
          {hasFilter && (
            <button
              type="button"
              className="button button--secondary button--slot state-panel__action"
              onClick={handleReset}
            >
              조건 초기화
            </button>
          )}
        </StatePanel>
      )
    }

    return (
      <ul className="card-grid" aria-label="포켓몬 목록">
        {visiblePokemons.map((pokemon) => (
          <li key={pokemon.id}>{renderPokemonCard(pokemon)}</li>
        ))}
      </ul>
    )
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // API 화면: 제출할 때만 검색한다. 입력창의 원본 값(query)은 그대로 둔다.
    // 로컬 화면: 목록은 입력할 때 이미 걸러져 있어 새로고침만 막는다.
    api?.search.submit(query)
    titleRef.current?.focus()
  }

  function handleReset() {
    onResetFilters()
    // 초기화 버튼이 사라져도 포커스를 잃지 않도록 검색창으로 보낸다.
    inputRef.current?.focus()
  }

  const statusText = getStatusText()

  return (
    <main className="pokemon-list">
      <form className="search" role="search" onSubmit={handleSubmit}>
        <div className="search__field">
          <img
            className="search__icon"
            src={searchIcon}
            alt=""
            aria-hidden="true"
            width={20}
            height={20}
          />
          <input
            ref={inputRef}
            className="search__input"
            type="search"
            value={query}
            placeholder={api ? apiSearchPlaceholder : localSearchPlaceholder}
            aria-label={api ? apiSearchLabel : localSearchLabel}
            autoComplete="off"
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </div>
        <button type="submit" className="button button--primary">
          검색
        </button>
        {/* W05 시안의 API 도감에는 타입 필터·정렬이 없다. 로컬 preview 화면에서만 연다. */}
        {!api && (
          <button
            type="button"
            className="button button--secondary"
            aria-haspopup="dialog"
            aria-label={
              selectedTypes.length > 0
                ? `필터 열기, 타입 ${selectedTypes.length}개 적용 중`
                : '필터 열기'
            }
            onClick={() => setIsFilterOpen(true)}
          >
            필터
          </button>
        )}
      </form>

      <div className="dex-layout">
        <section className="dex-results" aria-label="도감">
          {/* W05 시안에는 ‘도감’ 소제목이 없다. 검색·다시 시도 후 포커스를 받는 자리로는 남겨 두고 화면에서만 숨긴다. */}
          <h2
            ref={titleRef}
            className={`dex-results__title${api ? ' visually-hidden' : ''}`}
            tabIndex={-1}
          >
            도감
          </h2>
          {/* 시안에는 결과 수 표시가 없어 화면에는 그리지 않고 스크린 리더에만 알린다.
              요청 중·실패 시에는 StatePanel이 직접 알린다. */}
          {statusText !== null && (
            <p className="visually-hidden" role="status">
              {statusText}
            </p>
          )}

          {api ? renderApiResults(api.dex, api.search.state) : renderLocalResults()}
        </section>

        {teamPanel}
      </div>

      {!api && isFilterOpen && (
        <FilterDialog
          appliedTypes={selectedTypes}
          appliedSortOrder={sortOrder}
          typeOptions={typeOptions}
          onApply={(types, nextSortOrder) => {
            onApplyFilter(types, nextSortOrder)
            setIsFilterOpen(false)
          }}
          onCancel={() => setIsFilterOpen(false)}
        />
      )}
    </main>
  )
}

export default PokemonList
