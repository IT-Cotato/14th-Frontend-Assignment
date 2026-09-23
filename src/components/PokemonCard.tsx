interface PokemonCardProps {
  id: number
  name: string
  type: string
  image: string
}

function PokemonCard({ id, name, type, image }: PokemonCardProps) {
  const number = '#' + String(id).padStart(4, '0')

  return (
    <div className="pokemon-card">
      <div className="pokemon-image-box">
        <img src={image} alt={name} />
      </div>
      <p className="pokemon-number">{number}</p>
      <h3 className="pokemon-name">{name}</h3>
      <span className={`type-badge type-${type}`}>{type.toUpperCase()}</span>
      <button type="button" className="btn btn-primary btn-small">
        팀에 추가
      </button>
    </div>
  )
}

export default PokemonCard