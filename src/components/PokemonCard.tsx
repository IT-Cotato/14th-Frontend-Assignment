interface PokemonCardProps {
  number: string;
  name: string;
  type: string;
  image: string;
  role: string;
}

function PokemonCard({
  number,
  name,
  type,
  image,
  role,
}: PokemonCardProps) {
  return (
    <div className="pokemon-card">
      <div className="pokemon-image">
        <img src={image} alt={name} />
      </div>

      <div className="pokemon-info">
        <h3>{name}</h3>
        <p>{role}</p>
      </div>

      <div className="actions">
        <button className="edit-button">편집</button>
        <button className="del-button">삭제</button>
      </div>
    </div>
  );
}

export default PokemonCard;