type PokemonCardProps = {
  id: number;
  name: string;
  image: string;
  types: string[];
};

function PokemonCard({
  id,
  name,
  image,
  types,
}: PokemonCardProps) {
  return (
    <div className="card-box">

      <div className="img-box">
        <img
          className="pokemon-image"
          src={image}
          alt={name}
        />
      </div>

      <div className="pokemonNum">
        #{String(id).padStart(4, '0')}
        {/* 문자열의 길이가 4가 될 때까지 앞에 0을 붙여달라는 뜻 */}
      </div>

      <div className="pokemonName">
        {name}
      </div>

      <div className="attr-box">
        <div className="type-box">
            {types.map((type) => (
                <div
                    key={type}
                    className={`type-chip ${type.toLowerCase()}`}
                >
                    {type}
                </div>
            ))}
        </div>
      </div>

      <button className="button-box">
        <div className="button-chip">
          팀에 추가
        </div>
      </button>

    </div>
  );
}

export default PokemonCard;