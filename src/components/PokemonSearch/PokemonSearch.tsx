import Button from '../Button/Button'
import TypeChip from '../TypeChip/TypeChip'
import './PokemonSearch.css'

type PokemonSearchProps = {
  className?: string
  query: string
  onQueryChange: (query: string) => void
  onSearch?: (query: string) => void
  types: string[]
  selectedType: string
  onTypeChange: (type: string) => void
  showTypeFilters?: boolean
}

function PokemonSearch({ className = '', query, onQueryChange, onSearch, types, selectedType, onTypeChange, showTypeFilters = false }: PokemonSearchProps) {
  return (
    <form
      className={`pokemon-search-row ${className}`.trim()}
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        if (onSearch) onSearch(query.trim())
        else onQueryChange(query.trim())
      }}
    >
      <div className="pokemon-search">
        <img className="pokemon-search__icon" src="/search.svg" alt="" />
        <input
          aria-label="포켓몬 검색"
          className="pokemon-search__input"
          placeholder="pikachu"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>
      {showTypeFilters && (
        <div className="pokemon-search__types" role="group" aria-label="타입 필터">
        {types.map((type) => (
          <TypeChip key={type} type={type} selected={selectedType === type}
            onClick={() => onTypeChange(selectedType === type ? '' : type)} />
        ))}
        </div>
      )}
      <Button type="submit">검색</Button>
    </form>
  )
}

export default PokemonSearch
