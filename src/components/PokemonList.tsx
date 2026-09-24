import searchIcon from '../assets/pokemon/search.svg'
import PokemonCard from './PokemonCard.tsx'
import type { Pokemon } from './PokemonCard.tsx'

const searchPlaceholder = '이름 또는 번호'
const emptyTitle = '검색 결과가 없어요'
const emptyDescription = '다른 이름이나 번호로 검색해 보세요.'

type PokemonListProps = {
  pokemons: Pokemon[]
}

function PokemonList({ pokemons }: PokemonListProps) {
  return (
    <main className="pokemon-list">
      <div className="search" role="search">
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
            className="search__input"
            type="search"
            placeholder={searchPlaceholder}
            aria-label="포켓몬 이름 또는 번호로 검색"
          />
        </div>
        <button type="button" className="button button--primary">
          검색
        </button>
      </div>

      {pokemons.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__count" aria-hidden="true">
            {pokemons.length}
          </span>
          <p className="empty-state__title">{emptyTitle}</p>
          <p className="empty-state__description">{emptyDescription}</p>
        </div>
      ) : (
        <ul className="card-grid" aria-label="포켓몬 목록">
          {pokemons.map((pokemon) => (
            <li key={pokemon.id}>
              <PokemonCard
                id={pokemon.id}
                name={pokemon.name}
                types={pokemon.types}
                imageUrl={pokemon.imageUrl}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default PokemonList
