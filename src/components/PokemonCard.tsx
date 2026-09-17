type PokemonCardProps = {
  image: string;
  number: string;
  name: string;
  type: string;
  typeClass: string;
};

function PokemonCard({
  image,
  number,
  name,
  type,
  typeClass,
}: PokemonCardProps) {
  return (
    <article className="pokemon-card">
      <div className="artwork">
        <img
          src={image}
          alt={name}
        />
      </div>

      <span className="number">{number}</span>

      <h2 className="name">{name}</h2>

      <span className={`type ${typeClass}`}>{type}</span>

      <button className="action-btn">팀에 추가</button>
    </article>
  );
}

export default PokemonCard;
