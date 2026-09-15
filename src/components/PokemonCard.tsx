import Button from './Button';
import TypeChip from './TypeChip';
import type { Pokemon } from '../types/pokemon';
import './PokemonCard.css';

type PokemonCardProps = Pokemon;

function PokemonCard({ id, name, type, imageUrl }: PokemonCardProps) {
  const displayNumber = `#${String(id).padStart(4, '0')}`;

  return (
    <article className="pokemon-card">
      <div className="pokemon-card__artwork">
        <img src={imageUrl} alt={`${name} 일러스트`} />
      </div>

      <p className="pokemon-card__number">{displayNumber}</p>
      <h3 className="pokemon-card__name">{name}</h3>
      <TypeChip type={type} />

      <div className="pokemon-card__action">
        <Button variant="primary" size="sm">
          팀에 추가
        </Button>
      </div>
    </article>
  );
}

export default PokemonCard;
