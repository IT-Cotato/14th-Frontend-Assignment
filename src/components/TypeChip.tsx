import type { PokemonType } from '../types/pokemon';
import './TypeChip.css';

interface TypeChipProps {
  type: PokemonType;
  selected?: boolean;
  onClick?: () => void;
}

const TYPE_COLORS: Record<PokemonType, string> = {
  NORMAL: '#9da0aa',
  FIRE: '#fd7d24',
  WATER: '#4a90da',
  ELECTRIC: '#eed535',
  GRASS: '#62b957',
  ICE: '#61cec0',
  FIGHTING: '#d04164',
  POISON: '#a552cc',
  GROUND: '#dd7748',
  FLYING: '#748fc9',
  PSYCHIC: '#ea5d60',
  BUG: '#8cb230',
  ROCK: '#baab82',
  GHOST: '#556aae',
  DRAGON: '#0f6ac0',
  DARK: '#58575f',
  STEEL: '#417d9a',
  FAIRY: '#ed6ec7',
};

function TypeChip({ type, selected = false, onClick }: TypeChipProps) {
  if (onClick) {
    return (
      <button
        type="button"
        className={`type-chip type-chip--button${selected ? ' type-chip--selected' : ''}`}
        style={{ backgroundColor: TYPE_COLORS[type] }}
        aria-pressed={selected}
        onClick={onClick}
      >
        {type}
      </button>
    );
  }

  return (
    <span className="type-chip" style={{ backgroundColor: TYPE_COLORS[type] }}>
      {type}
    </span>
  );
}

export default TypeChip;
