import { useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import searchIcon from '../assets/pokemon/search.svg'
import FilterDialog from './FilterDialog.tsx'
import PokemonCard from './PokemonCard.tsx'
import type { Pokemon, PokemonType } from './PokemonCard.tsx'
import { getTypeOptions, getVisiblePokemons } from '../data/dex.ts'
import type { SortOrder } from '../data/dex.ts'
import { getAddStatus } from '../data/team.ts'
import type { TeamMember } from '../data/team.ts'

const searchPlaceholder = '피카츄 또는 25'
const emptyTitle = '검색 결과가 없어요'
const emptyDescription = '다른 이름이나 번호로 검색해 보세요.'

type PokemonListProps = {
  /** preview 설정으로 고른 전체 도감 목록 (검색·필터 적용 전) */
  pokemons: Pokemon[]
  team: TeamMember[]
  onAdd: (pokemon: Pokemon) => void
  query: string
  /** 필터 창에서 적용한 타입들. 비어 있으면 전체 */
  selectedTypes: PokemonType[]
  /** null이면 번호 정렬 없이 도감 데이터의 원래 순서 */
  sortOrder: SortOrder | null
  onQueryChange: (query: string) => void
  onApplyFilter: (types: PokemonType[], sortOrder: SortOrder | null) => void
  /** 검색어와 타입 조건을 함께 해제한다. 정렬 방향은 유지한다. */
  onResetFilters: () => void
  teamPanel: ReactNode
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
}: PokemonListProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  // 필터 창이 열려 있는지만 기억한다. 창 안의 임시 선택은 FilterDialog가 열릴 때마다 새로 만든다.
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // 아래 값들은 props(현재 state)에서 렌더링할 때마다 계산한다. 별도 state로 두지 않는다.
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // 목록은 입력할 때 이미 걸러져 있다. 제출은 새로고침만 막고 결과 영역 제목으로 포커스를 옮긴다.
    event.preventDefault()
    titleRef.current?.focus()
  }

  function handleReset() {
    onResetFilters()
    // 초기화 버튼이 사라져도 포커스를 잃지 않도록 검색창으로 보낸다.
    inputRef.current?.focus()
  }

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
            placeholder={searchPlaceholder}
            aria-label="포켓몬 이름 또는 번호로 검색"
            autoComplete="off"
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </div>
        <button type="submit" className="button button--primary">
          검색
        </button>
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
      </form>

      <div className="dex-layout">
        <section className="dex-results" aria-label="도감">
          <h2 ref={titleRef} className="dex-results__title" tabIndex={-1}>
            도감
          </h2>
          {/* 시안에는 결과 수 표시가 없어 화면에는 그리지 않고 스크린 리더에만 알린다 */}
          <p className="visually-hidden" role="status">
            {hasFilter
              ? `${conditionText} 결과 ${visiblePokemons.length}마리`
              : `포켓몬 ${visiblePokemons.length}마리`}
          </p>

          {visiblePokemons.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state__count" aria-hidden="true">
                {visiblePokemons.length}
              </span>
              <p className="empty-state__title">{emptyTitle}</p>
              {hasFilter ? (
                <>
                  <p className="empty-state__description">
                    {conditionText} 조건에 맞는 포켓몬이 없어요. 검색어를
                    고치거나 ‘필터’에서 타입을 바꾸거나, 조건을 초기화해 보세요.
                  </p>
                  <button
                    type="button"
                    className="button button--secondary button--slot empty-state__action"
                    onClick={handleReset}
                  >
                    조건 초기화
                  </button>
                </>
              ) : (
                <p className="empty-state__description">{emptyDescription}</p>
              )}
            </div>
          ) : (
            <ul className="card-grid" aria-label="포켓몬 목록">
              {visiblePokemons.map((pokemon) => (
                <li key={pokemon.id}>
                  <PokemonCard
                    id={pokemon.id}
                    name={pokemon.name}
                    types={pokemon.types}
                    imageUrl={pokemon.imageUrl}
                    addStatus={getAddStatus(team, pokemon.id)}
                    onAdd={() => onAdd(pokemon)}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        {teamPanel}
      </div>

      {isFilterOpen && (
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
