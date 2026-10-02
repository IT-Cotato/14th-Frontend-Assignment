import { getMemberDisplayName, getRoleLabel } from '../data/team.ts'
import type { TeamMember } from '../data/team.ts'
import type { PokemonType } from './PokemonCard.tsx'
import PokemonImage from './PokemonImage.tsx'

const typeLabels: Record<PokemonType, string> = {
  ELECTRIC: '전기',
  FIRE: '불꽃',
  GRASS: '풀',
  WATER: '물',
  FLYING: '비행',
  POISON: '독',
}

/** 아직 포켓몬이 없는 칸. 시안의 문구와 자리 표시 막대를 그린다. */
export function EmptyTeamSlot() {
  return (
    <article className="team-slot team-slot--empty">
      <div className="team-slot__info">
        <h3 className="team-slot__name">빈 슬롯</h3>
        <p className="team-slot__meta">포켓몬을 추가해 보세요</p>
      </div>
      <span className="team-slot__placeholder" aria-hidden="true">
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path
            d="M1 1h14M1 6h14M1 11h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </article>
  )
}

type TeamSlotProps = {
  member: TeamMember
  onEdit: () => void
  onDelete: () => void
}

function TeamSlot({ member, onEdit, onDelete }: TeamSlotProps) {
  const { pokemon, nickname, role } = member
  const displayName = getMemberDisplayName(member)
  const meta = [
    nickname ? pokemon.name : null,
    pokemon.types.map((type) => typeLabels[type]).join('/'),
    getRoleLabel(role),
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <article className="team-slot">
      <div className="team-slot__image-box">
        <PokemonImage
          name={pokemon.name}
          imageUrl={pokemon.imageUrl}
          className="team-slot__image"
          fallbackClassName="team-slot__image-fallback"
        />
      </div>
      <div className="team-slot__info">
        <h3 className="team-slot__name">{nickname || pokemon.name}</h3>
        <p className="team-slot__meta">{meta}</p>
      </div>
      <div className="team-slot__actions">
        <button
          type="button"
          className="button button--secondary button--slot"
          aria-label={`${displayName} 편집`}
          onClick={onEdit}
        >
          편집
        </button>
        <button
          type="button"
          className="button button--primary button--slot"
          aria-label={`${displayName} 삭제`}
          onClick={onDelete}
        >
          삭제
        </button>
      </div>
    </article>
  )
}

export default TeamSlot
