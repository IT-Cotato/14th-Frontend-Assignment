import Button from './Button';
import TypeChip from './TypeChip';
import type { Pokemon } from '../types/pokemon';
import './PokemonCard.css';

type PokemonCardProps = Pokemon;

function PokemonCard({ id, name, types, imageUrl }: PokemonCardProps) {
  const displayNumber = `#${String(id).padStart(4, '0')}`;

  return (
    <article className="pokemon-card">
      <div className="pokemon-card__artwork">
        <img src={imageUrl} alt={`${name} 일러스트`} />
      </div>

      <p className="pokemon-card__number">{displayNumber}</p>
      <h3 className="pokemon-card__name" title={name}>
        {name}
      </h3>
      <div className="pokemon-card__types">
        {types.map((type) => (
          <TypeChip key={type} type={type} />
        ))}
      </div>

      <div className="pokemon-card__action">
        <Button variant="primary" size="sm">
          팀에 추가
        </Button>
      </div>
    </article>
  );
}

export default PokemonCard;