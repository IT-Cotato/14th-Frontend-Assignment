export type PokemonType = 'ELECTRIC' | 'FIRE' | 'GRASS' | 'WATER'

export type PokemonCardProps = {
  number: string
  name: string
  type: PokemonType
  image: string
}

function PokemonCard({ number, name, type, image }: PokemonCardProps) {
  return (
    <article className="pokemon-card">
      <div className="pokemon-card__image-box">
        <img
          className="pokemon-card__image"
          src={image}
          alt={`${name} 일러스트`}
          width={120}
          height={120}
        />
      </div>
      <p className="pokemon-card__number">{number}</p>
      <h3 className="pokemon-card__name">{name}</h3>
      <span className={`type-chip type-chip--${type.toLowerCase()}`}>
        {type}
      </span>
      <button type="button" className="button button--primary button--card">
        팀에 추가
      </button>
    </article>
  )
}

export default PokemonCard
