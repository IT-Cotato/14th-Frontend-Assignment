import TypeChip from "./TypeChip";

interface PokemonCardProps {
  image: string;
  number: string;
  name: string;
  type: string;
}

function PokemonCard({ image, number, name, type }: PokemonCardProps) {
  return (
    <article className="pokemon-card">
      <div className="artwork">
        <img src={image} alt={name} />
      </div>

      <span className="number">{number}</span>
      <h3 className="name">{name}</h3>
      <TypeChip type={type} />

      <button className="action-btn">팀에 추가</button>
    </article>
  );
}

export default PokemonCard;