interface PokemonCardProps {
  number: string
  name: string
  type: string
  image: string
}

function PokemonCard({
  number,
  name,
  type,
  image,
}: PokemonCardProps) {
  return (
    <div className="pokemon-card">
      <div className="pokemon-image">
        <img src={image} alt={name} />
      </div>

      <span className="pokemon-number">{number}</span>
      <h2>{name}</h2>
      <span className={`type ${type.toLowerCase()}`}>{type}</span>

      <button className="team-button">팀에 추가</button>
    </div>
  )
}
export default PokemonCard