import Button from '../Button/Button'
import './PokemonSearch.css'

type PokemonSearchProps = {
  className?: string
}

function PokemonSearch({ className = '' }: PokemonSearchProps) {
  return (
    <div className={`pokemon-search-row ${className}`.trim()}>
      <div className="pokemon-search">
        <img className="pokemon-search__icon" src="/search.svg" alt="" />
        <input
          aria-label="포켓몬 검색"
          className="pokemon-search__input"
          placeholder="이름 또는 번호"
          type="search"
        />
      </div>
      <Button>검색</Button>
    </div>
  )
}

export default PokemonSearch
