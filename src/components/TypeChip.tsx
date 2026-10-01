interface TypeChipProps {
  type: string; 
}

function TypeChip({ type }: TypeChipProps) {
  return (
    <span className={`type-chip ${type.toLowerCase()}`}>{type}</span>
  );
}

export default TypeChip;