import './TypeChip.css'

type TypeChipProps = {
  type: string
  selected?: boolean
  onClick?: () => void
}

function TypeChip({ type, selected = false, onClick }: TypeChipProps) {
  const className = 'type-chip'
  const style = { backgroundColor: `var(--color-type-${type.toLowerCase()}, var(--color-type-normal))` }

  if (onClick) {
    return (
      <button type="button" className={className} style={style}
        aria-pressed={selected} onClick={onClick}>
        {type}
      </button>
    )
  }

  return <span className={className} style={style}>{type}</span>
}

export default TypeChip
