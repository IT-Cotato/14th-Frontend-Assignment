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
    <div className="dict-pokemon-card">
      <div className="dict-pokemon-image">
        <img src={image} alt={name} />
      </div>

      <p className="dict-pokemon-number">{number}</p>

      <h3 className="dict-pokemon-name">{name}</h3>

      <span className={`dict-pokemon-type ${type.toLowerCase()}`}>
        {type}
      </span>

      <button className="dict-team-button">
        팀에 추가
      </button>
    </div>
  );
}

export default PokemonCard;
