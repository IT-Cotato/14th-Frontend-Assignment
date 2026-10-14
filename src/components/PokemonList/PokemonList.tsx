import type { Pokemon } from '../../types/pokemon'
import PokemonCard from '../PokemonCard/PokemonCard'
import StatePanel from '../StatePanel/StatePanel'
import './PokemonList.css'

type PokemonListProps = {
  pokemon: Pokemon[]
  onAdd?: (pokemon: Pokemon) => void
}

function PokemonList({ pokemon, onAdd }: PokemonListProps) {
  if (pokemon.length === 0) {
    return <StatePanel variant="empty" />
  }

  return (
    <div className="pokemon-card-list">
      {pokemon.map((item) => (
        <PokemonCard
          key={item.number}
          number={item.number}
          name={item.name}
          types={item.types}
          imageSrc={item.imageSrc}
          onAdd={() => onAdd?.(item)}
        />
      ))}
    </div>
  )
}

export default PokemonList
