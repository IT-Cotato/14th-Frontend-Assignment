interface PokemonCardProps {
  number: string;
  name: string;
  type: string;
  role: string
  image: string;
  onAdd: () => void;
}

function PokemonCard({
  number,
  name,
  type,
  role,
  image,
  onAdd,
}: PokemonCardProps) {
  return (
    <div className="pokemon-card">
      <div className="pokemon-image">
        <img src={image} alt={name} />
      </div>

      <span className="pokemon-number">{number}</span>
      <h2>{name}</h2>
      <span className={`type ${type.toLowerCase()}`}>{type}</span>

      <button className="red-shadow-button" onClick={onAdd}>팀에 추가</button>
    </div>
  );
}

export default PokemonCard;