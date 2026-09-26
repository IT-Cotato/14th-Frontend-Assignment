import type { ReactNode } from 'react'
import type { Pokemon } from '../../types/pokemon'
import Button from '../Button/Button'
import './PokemonCard.css'

type PokemonCardProps = Pokemon & {
  children?: ReactNode
  imageAlt?: string
}

function PokemonCard({
  children,
  imageAlt,
  imageSrc,
  name,
  number,
  types,
}: PokemonCardProps) {
  return (
    <article className="pokemon-card">
      <div className="pokemon-card__image-frame">
        <img src={imageSrc} alt={imageAlt ?? name} />
      </div>
      <span className="pokemon-card__number">#{String(number).padStart(4, '0')}</span>
      <h3 className="pokemon-card__name">{name}</h3>
      {types.length > 0 && (
        <div className="pokemon-card__types">
          {types.map((type) => (
            <span
              className={`pokemon-card__type pokemon-card__type--${type.toLowerCase()}`}
              key={type}
            >
              {type}
            </span>
          ))}
        </div>
      )}
      {children}
      <Button>팀에 추가</Button>
    </article>
  )
}

export default PokemonCard
