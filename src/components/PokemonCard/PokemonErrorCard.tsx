import type { Pokemon } from '../../types/pokemon'
import Button from '../Button/Button'
import './PokemonCard.css'
import './PokemonErrorCard.css'

type PokemonErrorCardProps = {
  pokemon: Pokemon
  retrying: boolean
  onRetry: () => void
}

function PokemonErrorCard({ pokemon, retrying, onRetry }: PokemonErrorCardProps) {
  return (
    <article className="pokemon-error-card" aria-busy={retrying}>
      <div className="pokemon-card__image-frame">
        <img src={pokemon.imageSrc} alt={pokemon.name} />
      </div>
      <span className="pokemon-card__number">#{String(pokemon.number).padStart(4, '0')}</span>
      <h3 className="pokemon-error-card__title" role="status">
        {retrying ? '다시 불러오는 중' : '상세 정보 실패'}
      </h3>
      <Button onClick={onRetry} disabled={retrying}>다시 시도</Button>
    </article>
  )
}

export default PokemonErrorCard
