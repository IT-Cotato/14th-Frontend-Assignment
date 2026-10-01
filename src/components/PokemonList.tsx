import { useMemo, useState } from 'react'
import { POKEMON, type Pokemon, type PokemonType } from '../pokemon'
import PokemonCard from './PokemonCard'

interface PokemonListProps {
  items?: Pokemon[]
  mode?: 'featured' | 'catalog' | 'team'
  onAdd?: (id: number) => void
  onEdit?: (id: number) => void
  onView?: (id: number) => void
}

function PokemonList({
  items = POKEMON,
  mode = 'featured',
  onAdd,
  onEdit,
  onView,
}: PokemonListProps) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<'ALL' | PokemonType>('ALL')
  const [sort, setSort] = useState<'number' | 'name'>('number')
  const [page, setPage] = useState(1)
  const pageSize = 3

  const filteredItems = useMemo(() => {
    const keyword = query.trim().replace(/^#/, '').toLowerCase()
    const nextItems = items.filter(
      (pokemon) =>
        (pokemon.name.toLowerCase().includes(keyword) || pokemon.number.includes(keyword)) &&
        (type === 'ALL' || pokemon.type === type),
    )

    return [...nextItems].sort((a, b) =>
      sort === 'name' ? a.name.localeCompare(b.name, 'ko') : a.id - b.id,
    )
  }, [items, query, sort, type])

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize))
  const visibleItems =
    mode === 'catalog'
      ? filteredItems.slice((Math.min(page, pageCount) - 1) * pageSize, Math.min(page, pageCount) * pageSize)
      : items

  return (
    <section className={`pokemon-list-wrap pokemon-list-wrap--${mode}`} aria-label="포켓몬 목록">
      {mode === 'catalog' && (
        <div className="catalog-controls">
          <label className="catalog-controls__search">
            <span>검색</span>
            <input
              type="search"
              placeholder="이름 또는 도감 번호"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
            />
          </label>
          <label>
            <span>타입</span>
            <select
              value={type}
              onChange={(event) => {
                setType(event.target.value as 'ALL' | PokemonType)
                setPage(1)
              }}
            >
              <option value="ALL">전체</option>
              <option value="DRAGON">DRAGON</option>
              <option value="GHOST">GHOST</option>
              <option value="NORMAL">NORMAL</option>
              <option value="ELECTRIC">ELECTRIC</option>
            </select>
          </label>
          <label>
            <span>정렬</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as 'number' | 'name')}>
              <option value="number">도감 번호</option>
              <option value="name">이름</option>
            </select>
          </label>
        </div>
      )}

      <div className="pokemon-list">
        {visibleItems.length === 0 ? (
          <div className="pokemon-list__empty">
            <strong>조건에 맞는 포켓몬이 없어요.</strong>
            <span>검색어나 타입 필터를 다시 확인해 주세요.</span>
          </div>
        ) : (
          visibleItems.map((pokemon) => (
            <PokemonCard
              {...pokemon}
              actionLabel={mode === 'team' ? '편집' : '팀에 추가'}
              key={pokemon.id}
              onAction={mode === 'team' ? onEdit : onAdd}
              onView={onView}
            />
          ))
        )}
      </div>

      {mode === 'catalog' && filteredItems.length > 0 && (
        <nav className="pagination" aria-label="페이지 이동">
          <button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>
            이전
          </button>
          <span>{Math.min(page, pageCount)} / {pageCount}</span>
          <button type="button" disabled={page >= pageCount} onClick={() => setPage((value) => value + 1)}>
            다음
          </button>
        </nav>
      )}
    </section>
  )
}

export default PokemonList
