interface PokemonCardProps {
  number: string;
  name: string;
  type: string;
  types?: string[];
  role: string
  image: string;
  onAdd: () => void;
}

function PokemonCard({
  number,
  name,
  type,
  types = [type],
  // role,
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
      <div className="pokemon-types">
        {types.map((pokemonType) => (
          <span
            className={`type ${pokemonType.toLowerCase()}`}
            key={pokemonType}
          >
            {pokemonType}
          </span>
        ))}
      </div>

      <button className="red-shadow-button" onClick={onAdd}>팀에 추가</button>
    </div>
  );
}

export default PokemonCard;