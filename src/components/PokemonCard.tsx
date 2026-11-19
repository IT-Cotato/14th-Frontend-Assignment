import { Link } from 'react-router-dom'
import type { Pokemon } from '../pokemon'

interface PokemonCardProps extends Pokemon {
  actionLabel?: string
  actionDisabled?: boolean
  onAction?: (pokemon: Pokemon) => void
  detailPath?: string
}

function PokemonCard({
  id,
  number,
  name,
  type,
  imageUrl,
  actionLabel = '팀에 추가',
  actionDisabled = false,
  onAction,
  detailPath,
}: PokemonCardProps) {
  const typeClassName = `pokemon-card__type pokemon-card__type--${type.toLowerCase()}`
  const cardSummary = (
    <>
      <span className="pokemon-card__artwork">
        <img src={imageUrl} alt={name} />
      </span>
      <span className="pokemon-card__number">#{number}</span>
      <strong className="pokemon-card__name">{name}</strong>
    </>
  )

  return (
    <article className="pokemon-card">
      {detailPath ? (
        <Link className="pokemon-card__view" to={detailPath}>{cardSummary}</Link>
      ) : (
        <div className="pokemon-card__view">{cardSummary}</div>
      )}
      <span className={typeClassName}>{type}</span>
      <button
        className="pokemon-card__team-button"
        type="button"
        disabled={actionDisabled}
        onClick={() => onAction?.({ id, number, name, type, imageUrl })}
      >
        {actionLabel}
      </button>
    </article>
  )
}

export default PokemonCard
