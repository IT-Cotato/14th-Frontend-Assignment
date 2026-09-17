type PokemonCardProps = {
  artwork: string
  number: string
  name: string
  type: string
  typeColor: string
}

function PokemonCard({
  artwork,
  number,
  name,
  type,
  typeColor,
}: PokemonCardProps) {
  return (
    <article className="pokemon-card">
      <div className="pokemon-card__artwork">
        <img src={artwork} alt={`${name} 일러스트`} />
      </div>
      <span className="pokemon-card__number">#{number}</span>
      <h3 className="pokemon-card__name">{name}</h3>
      <span className="pokemon-card__type" style={{ backgroundColor: typeColor }}>
        {type}
      </span>
      <button className="pokemon-card__team-button" type="button">
        팀에 추가
      </button>
    </article>
  )
}

export default PokemonCard
