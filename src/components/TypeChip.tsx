import type { PokemonType } from '../types/pokemon';
import './TypeChip.css';

interface TypeChipProps {
  type: PokemonType;
}

function TypeChip({ type }: TypeChipProps) {
  return <span className={`type-chip type-chip--${type.toLowerCase()}`}>{type}</span>;
}

export default TypeChip;
