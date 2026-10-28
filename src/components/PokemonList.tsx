import { useMemo, useState, type FormEvent } from 'react'
import searchIcon from '../assets/search.svg'
import { POKEMON, type Pokemon, type PokemonType } from '../pokemon'
import PokemonCard from './PokemonCard'

interface PokemonListProps {
  items?: Pokemon[]
  mode?: 'featured' | 'catalog' | 'team'
  onAdd?: (id: number) => void
  onEdit?: (id: number) => void
  onView?: (id: number) => void
  teamIds?: number[]
  teamFull?: boolean
}

const filterTypes: Array<'ALL' | PokemonType> = [
  'ALL',
  'ELECTRIC',
  'FIRE',
  'GRASS',
  'DRAGON',
  'GHOST',
  'NORMAL',
]

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
  const [type, setType] = useState<'ALL' | PokemonType>('ALL')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const filteredItems = useMemo(() => {
    const keyword = query.trim().replace(/^#/, '').toLowerCase()
    const nextItems = items.filter(
      (pokemon) =>
        (pokemon.name.toLowerCase().includes(keyword) || pokemon.number.includes(keyword)) &&
        (type === 'ALL' || pokemon.type === type),
    )

    return [...nextItems].sort((a, b) =>
      sortDirection === 'asc' ? a.id - b.id : b.id - a.id,
    )
  }, [items, query, sortDirection, type])

  const typeCounts = items.reduce<Partial<Record<PokemonType, number>>>((counts, pokemon) => {
    counts[pokemon.type] = (counts[pokemon.type] ?? 0) + 1
    return counts
  }, {})

  const resetFilters = () => {
    setQuery('')
    setType('ALL')
    setSortDirection('asc')
  }

  const keepCurrentSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const visibleItems = mode === 'catalog' ? filteredItems : items

  return (
    <section className={`pokemon-list-wrap pokemon-list-wrap--${mode}`} aria-label="포켓몬 목록">
      {mode === 'catalog' && (
        <div className="catalog-toolbar">
          <form className="catalog-search" role="search" onSubmit={keepCurrentSearch}>
            <label>
              <span className="sr-only">포켓몬 이름 또는 번호 검색</span>
              <img src={searchIcon} alt="" />
              <input
                type="search"
                placeholder="피카츄 또는 25"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <button type="submit">검색</button>
          </form>

          <div className="catalog-filter-row">
            <div className="catalog-type-filters" aria-label="타입 필터">
              {filterTypes.map((filterType) => (
                <button
                  className={`catalog-type-filter catalog-type-filter--${filterType.toLowerCase()}${type === filterType ? ' is-selected' : ''}`}
                  key={filterType}
                  type="button"
                  aria-pressed={type === filterType}
                  onClick={() => setType(filterType)}
                >
                  {filterType === 'ALL' ? `전체 ${items.length}` : `${filterType} ${typeCounts[filterType] ?? 0}`}
                </button>
              ))}
            </div>
            <button
              className="catalog-sort"
              type="button"
              onClick={() => setSortDirection((direction) => direction === 'asc' ? 'desc' : 'asc')}
            >
              번호 {sortDirection === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          <p className="catalog-result-count" aria-live="polite">검색 결과 {filteredItems.length}마리</p>
        </div>
      )}

      <div className="pokemon-list">
        {visibleItems.length === 0 ? (
          <div className="pokemon-list__empty">
            <strong>검색 결과가 없어요</strong>
            <span>다른 이름이나 번호, 타입으로 검색해 보세요.</span>
            {mode === 'catalog' && <button type="button" onClick={resetFilters}>조건 초기화</button>}
          </div>
        ) : (
          visibleItems.map((pokemon) => (
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
              onAction={mode === 'team' ? onEdit : onAdd}
              onView={onView}
            />
          ))
        )}
      </div>
    </section>
  )
}

export default PokemonList
