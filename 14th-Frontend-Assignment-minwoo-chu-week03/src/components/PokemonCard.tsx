import type { PokemonType } from '../data/pokemons'

interface PokemonCardProps {
  id: number
  name: string
  type: PokemonType
  image: string
  isAdded: boolean
  isTeamFull: boolean
  onAdd: () => void
}

function PokemonCard({
  id,
  name,
  type,
  image,
  isAdded,
  isTeamFull,
  onAdd,
}: PokemonCardProps) {
  const number = '#' + String(id).padStart(4, '0')

  let buttonLabel = '팀에 추가'
  if (isAdded) {
    buttonLabel = '추가됨'
  } else if (isTeamFull) {
    buttonLabel = '팀 가득 참'
  }

  return (
    <div className={`pokemon-card${isAdded ? ' pokemon-card-added' : ''}`}>
      <div className="pokemon-image-box">
        <img src={image} alt={name} />
      </div>
      <p className="pokemon-number">{number}</p>
      <h3 className="pokemon-name">{name}</h3>
      <span className={`type-badge type-${type}`}>{type.toUpperCase()}</span>
      {}
      <button 
        type="button"
        className="btn btn-primary btn-small"
        disabled={!isAdded && isTeamFull}
        onClick={onAdd}
      >
        {buttonLabel}
      </button>
    </div>
  )
}

export default PokemonCard
