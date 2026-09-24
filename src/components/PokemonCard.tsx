import type { Pokemon } from '../pokemon'

interface PokemonCardProps extends Pokemon {
  actionLabel?: string
  onAction?: (id: number) => void
  onView?: (id: number) => void
}

function PokemonCard({
  id,
  number,
  name,
  type,
  imageUrl,
  actionLabel = '팀에 추가',
  onAction,
  onView,
}: PokemonCardProps) {
  const typeClassName = `pokemon-card__type pokemon-card__type--${type.toLowerCase()}`

  return (
    <article className="pokemon-card">
      <button className="pokemon-card__view" type="button" onClick={() => onView?.(id)}>
        <span className="pokemon-card__artwork">
          <img src={imageUrl} alt={name} />
        </span>
        <span className="pokemon-card__number">#{number}</span>
        <strong className="pokemon-card__name">{name}</strong>
      </button>
      <span className={typeClassName}>{type}</span>
      <button className="pokemon-card__team-button" type="button" onClick={() => onAction?.(id)}>
        {actionLabel}
      </button>
    </article>
  )
}

export default PokemonCard
