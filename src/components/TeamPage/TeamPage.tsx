import PokemonSlot from '../PokemonSlot/PokemonSlot'
import Button from '../Button/Button'
import type { Pokemon } from '../../types/pokemon'
import './TeamPage.css'

type TeamPageProps = {
  team: Pokemon[]
  onDelete: (number: number) => void
  onEdit: (number: number) => void
  onSave: () => void
  onCancel: () => void
  message?: string
}

const typeLabels: Record<string, string> = {
  ELECTRIC: '전기',
  FIRE: '불꽃',
  GRASS: '풀',
  WATER: '물',
}

function TeamPage({ team, onDelete, onEdit, onSave, onCancel, message }: TeamPageProps) {
  return (
    <section className="team-page" aria-labelledby="team-title">
      <div className="team-page__heading">
        <div>
          <h1 id="team-title" className="team-page__title">나의 팀</h1>
          <p className="team-page__description">최대 6마리의 포켓몬으로 나만의 팀을 완성하세요.</p>
        </div>
        <span className="team-page__count">{team.length} / 6</span>
        <div className="team-page__actions">
          <Button onClick={onSave}>팀 저장</Button>
          <Button variant="secondary" onClick={onCancel}>취소</Button>
        </div>
      </div>
      <div className="team-page__slots">
        {team.map((pokemon) => (
          <PokemonSlot
            key={pokemon.number}
            name={pokemon.nickname || pokemon.name}
            onEdit={() => onEdit(pokemon.number)}
            imageSrc={pokemon.imageSrc}
            onDelete={() => onDelete(pokemon.number)}
            ability={[
              ...pokemon.types.map((type) => typeLabels[type] ?? type),
              pokemon.role,
            ].filter(Boolean).join(' · ')}
          />
        ))}
        {Array.from({ length: Math.max(0, 6 - team.length) }, (_, index) => (
          <PokemonSlot key={`empty-${index}`} />
        ))}
      </div>
      {message && <p role="status" className="team-page__description">{message}</p>}
    </section>
  )
}

export default TeamPage
