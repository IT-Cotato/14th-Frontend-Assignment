import type { PokemonType } from '../types/pokemon';
import './TypeChip.css';

interface TypeChipProps {
  type: PokemonType;
}

// Record<PokemonType, string>이므로 18개 타입 중 하나라도 빠지면 타입 오류가 납니다.
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

function TypeChip({ type }: TypeChipProps) {
  return (
    <span className="type-chip" style={{ backgroundColor: TYPE_COLORS[type] }}>
      {type}
    </span>
  );
}

export default TypeChip;

