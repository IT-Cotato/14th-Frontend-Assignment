interface PokemonCardProps {
  number: string;
  name: string;
  type: string;
  image: string;
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

      <p className="pokemon-number">{number}</p>

      <h3 className="pokemon-name">{name}</h3>

      <span className={`pokemon-type ${type.toLowerCase()}`}>
        {type}
      </span>

      <button className="team-button">
        팀에 추가
      </button>
    </div>
  );
}

export default PokemonCard;