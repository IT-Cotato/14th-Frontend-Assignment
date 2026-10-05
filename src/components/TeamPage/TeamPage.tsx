import PokemonSlot from '../PokemonSlot/PokemonSlot'
import type { Pokemon } from '../../types/pokemon'
import './TeamPage.css'

type TeamPageProps = {
  team: Pokemon[]
  onDelete: (number: number) => void
  onEdit: (number: number) => void
  message?: string
}

const typeLabels: Record<string, string> = {
  ELECTRIC: '전기',
  FIRE: '불꽃',
  GRASS: '풀',
  WATER: '물',
}

function TeamPage({ team, onDelete, onEdit, message }: TeamPageProps) {
  return (
    <section className="team-page" aria-labelledby="team-title">
      <div className="team-page__heading">
        <div>
          <h1 id="team-title" className="team-page__title">나의 팀</h1>
          <p className="team-page__description">최대 6마리의 포켓몬으로 나만의 팀을 완성하세요.</p>
        </div>
        <span className="team-page__count">{team.length} / 6</span>
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
