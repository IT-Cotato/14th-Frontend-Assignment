import Button from '../Button/Button'
import './PokemonSlot.css'

type PokemonSlotProps = {
  name?: string
  ability?: string
  imageSrc?: string
  onEdit?: () => void
  onDelete?: () => void
}

function PokemonSlot({ name, ability, imageSrc, onEdit, onDelete }: PokemonSlotProps) {
  return (
    <article className="team-slot">
      {name ? (
        <>
          <div className="team-slot__image">
            {imageSrc && <img src={imageSrc} alt={name} />}
          </div>
          <div className="team-slot__details">
            <h2 className="team-slot__name">{name}</h2>
            {ability && <p className="team-slot__description">{ability}</p>}
          </div>
          <div className="team-slot__actions">
            <Button variant="secondary" aria-label={`${name} 편집`} onClick={onEdit}>편집</Button>
            <Button aria-label={`${name} 삭제`} onClick={onDelete}>삭제</Button>
          </div>
        </>
      ) : (
        <>
          <div className="team-slot__details">
            <h2 className="team-slot__name">빈 슬롯</h2>
            <p className="team-slot__description">포켓몬을 추가해 보세요</p>
          </div>
          <span className="team-slot__placeholder" aria-hidden="true">≡</span>
        </>
      )}
    </article>
  )
}

export default PokemonSlot
