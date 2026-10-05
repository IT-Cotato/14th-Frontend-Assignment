import Button from '../Button/Button'
import './PokemonSearch.css'

type PokemonSearchProps = {
  className?: string
  query: string
  onQueryChange: (query: string) => void
}

function PokemonSearch({ className = '', query, onQueryChange }: PokemonSearchProps) {
  return (
    <form
      className={`pokemon-search-row ${className}`.trim()}
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        onQueryChange(query.trim())
      }}
    >
      <div className="pokemon-search">
        <img className="pokemon-search__icon" src="/search.svg" alt="" />
        <input
          aria-label="포켓몬 검색"
          className="pokemon-search__input"
          placeholder="이름 또는 번호"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>
      <Button type="submit">검색</Button>
    </form>
  )
}

export default PokemonSearch
