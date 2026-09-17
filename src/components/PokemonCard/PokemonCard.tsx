import type { ReactNode } from 'react'
import Button from '../Button/Button'
import './PokemonCard.css'

type PokemonCardProps = {
  children?: ReactNode
  imageAlt?: string
  imageSrc?: string
  name?: string
  number?: string
  type?: string
}

function PokemonCard({
  children,
  imageAlt = '',
  imageSrc,
  name,
  number,
  type,
}: PokemonCardProps) {
  return (
    <article className="pokemon-card">
      {imageSrc && (
        <div className="pokemon-card__image-frame">
          <img src={imageSrc} alt={imageAlt} />
        </div>
      )}
      {number && <span className="pokemon-card__number">{number}</span>}
      {name && <h3 className="pokemon-card__name">{name}</h3>}
      {type && (
        <span className={`pokemon-card__type pokemon-card__type--${type.toLowerCase()}`}>
          {type}
        </span>
      )}
      {children}
      <Button>팀에 추가</Button>
    </article>
  )
}

export default PokemonCard
