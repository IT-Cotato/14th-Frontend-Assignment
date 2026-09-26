import type { Pokemon } from '../../types/pokemon'
import PokemonCard from '../PokemonCard/PokemonCard'
import './PokemonList.css'

type PokemonListProps = {
  pokemon: Pokemon[]
}

function PokemonList({ pokemon }: PokemonListProps) {
  if (pokemon.length === 0) {
    return (
      <div className="pokemon-empty" role="status">
        <span className="pokemon-empty__count">0</span>
        <h3 className="pokemon-empty__title">검색 결과가 없어요</h3>
        <p className="pokemon-empty__description">다른 이름이나 번호로 검색해 보세요.</p>
      </div>
    )
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
        />
      ))}
    </div>
  )
}

export default PokemonList
