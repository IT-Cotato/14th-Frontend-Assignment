import { usePokemonPage } from '../../hooks/usePokemonPage'
import { usePokemonSearch } from '../../hooks/usePokemonSearch'
import PokemonCard from '../PokemonCard/PokemonCard'
import PokemonErrorCard from '../PokemonCard/PokemonErrorCard'
import type { Pokemon } from '../../types/pokemon'
import { filterPokemon } from '../../utils/filterPokemon'
import PokemonSearch from '../PokemonSearch/PokemonSearch'
import PokemonList from '../PokemonList/PokemonList'
import StatePanel from '../StatePanel/StatePanel'
import Pagination from '../Pagination/Pagination'
import Button from '../Button/Button'
import './PokedexPage.css'

type PokedexPageProps = {
  onAdd: (pokemon: Pokemon) => void
}

function PokedexPage({ onAdd }: PokedexPageProps) {
  const listQuery = usePokemonPage()
  const { cards, retryCard, retryingUrls } = listQuery
  const { query, search, changeQuery, submitSearch } = usePokemonSearch()

  const filteredCards = cards.filter((card) => filterPokemon([card.pokemon], query, '').length > 0)

  return (
    <>
      <div className="pokedex-heading">
        <div>
          <h1 className="pokedex-title">포켓몬 도감</h1>
          <p className="pokedex-description">페이지를 이동해도 이전 포켓몬을 빠르게 다시 볼 수 있어요.</p>
        </div>
        <span className="pokedex-count-badge">
          {listQuery.isError ? 'PokéAPI 요청 실패' : listQuery.isFetching ? 'PokéAPI 불러오는 중' : '최신 목록'}
        </span>
      </div>
      <PokemonSearch query={query} onQueryChange={changeQuery} onSearch={submitSearch}
        types={[]} selectedType="" onTypeChange={() => {}} />
      <div className="pokedex-card-area">
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
            <div className={`pokemon-card-list${listQuery.isPlaceholderData ? ' pokedex-card-area__placeholder' : ''}`}
              aria-hidden={listQuery.isPlaceholderData || undefined} inert={listQuery.isPlaceholderData}>
              {filteredCards.map((card) => card.failed ? (
                <PokemonErrorCard key={card.pokemon.number} pokemon={card.pokemon}
                  retrying={retryingUrls.includes(card.url)} onRetry={() => void retryCard(card)} />
              ) : (
                <PokemonCard key={card.pokemon.number} {...card.pokemon} onAdd={() => onAdd(card.pokemon)} />
              ))}
            </div>
          )}
          {filteredCards.length === 0 && listQuery.isSuccess && !listQuery.isPlaceholderData && <StatePanel variant="empty" />}
          {(listQuery.isPending || listQuery.isPlaceholderData) && <StatePanel variant="loading" />}
          {listQuery.isError && cards.length === 0 && <StatePanel variant="error" onRetry={() => void listQuery.refetch()} />}
        </>
      )}
      </div>
          {!search && listQuery.hasData && (
            <Pagination
              currentPage={listQuery.currentPage}
              totalPages={listQuery.totalPages}
              disabled={listQuery.isPlaceholderData}
              hasPrevious={listQuery.hasPrevious}
              hasNext={listQuery.hasNext}
              onPrevious={listQuery.previousPage}
              onNext={listQuery.nextPage}
              onPageChange={listQuery.changePage}
            />
          )}
      {!search && listQuery.isError && cards.length > 0 && (
        <div role="alert">
          <p className="pokedex-description">목록을 갱신하지 못했어요. 이전에 불러온 목록을 표시합니다.</p>
          <Button onClick={() => void listQuery.refetch()} disabled={listQuery.isFetching}>다시 시도</Button>
        </div>
      )}
    </>
  )
}

export default PokedexPage
