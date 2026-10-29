import { useId } from 'react'
import { TEAM_LIMIT } from '../data/team.ts'
import type { AddStatus } from '../data/team.ts'
import PokemonImage from './PokemonImage.tsx'

export type PokemonType =
  | 'ELECTRIC'
  | 'FIRE'
  | 'GRASS'
  | 'WATER'
  | 'FLYING'
  | 'POISON'

export interface Pokemon {
  id: number
  name: string
  /** 포켓몬은 타입을 두 개까지 가질 수 있어 배열로 받는다. */
  types: PokemonType[]
  /** 이미지 자산이 없는 포켓몬은 비워 두고 이름 대체 UI로 표시한다. */
  imageUrl?: string
}

type PokemonCardProps = Pokemon & {
  addStatus: AddStatus
  onAdd: () => void
}

/** 버튼 상태별 문구. 비활성 이유는 색상과 함께 텍스트로도 안내한다. */
const addButtonLabels: Record<AddStatus, string> = {
  added: '추가됨',
  full: '팀에 추가',
  available: '팀에 추가',
}

const addHints: Record<AddStatus, string | null> = {
  // 시안의 '추가됨' 카드에는 안내 줄이 없다. 버튼 문구가 이유를 알려 준다.
  added: null,
  full: `최대 ${TEAM_LIMIT}마리까지 추가할 수 있어요`,
  available: null,
}

/** 도감 ID를 #0025 형태의 도감 번호 문구로 바꾼다. 원본 데이터는 건드리지 않는다. */
function formatDexNumber(id: number) {
  return `#${String(id).padStart(4, '0')}`
}

function PokemonCard({
  id,
  name,
  types,
  imageUrl,
  addStatus,
  onAdd,
}: PokemonCardProps) {
  const hintId = useId()
  const hint = addHints[addStatus]

  return (
    <article className="pokemon-card">
      <div className="pokemon-card__image-box">
        <PokemonImage
          name={name}
          imageUrl={imageUrl}
          className="pokemon-card__image"
          fallbackClassName="pokemon-card__image-fallback"
        />
      </div>
      <p className="pokemon-card__number">{formatDexNumber(id)}</p>
      <h3 className="pokemon-card__name">{name}</h3>
      <div className="type-chips">
        {types.map((type) => (
          <span
            key={type}
            className={`type-chip type-chip--${type.toLowerCase()}`}
          >
            {type}
          </span>
        ))}
      </div>
      <div className="pokemon-card__footer">
        {hint && (
          <p
            id={hintId}
            className={`pokemon-card__hint pokemon-card__hint--${addStatus}`}
          >
            {hint}
          </p>
        )}
        <button
          type="button"
          className={`button button--primary button--card${addStatus === 'added' ? ' button--added' : ''}`}
          disabled={addStatus !== 'available'}
          aria-describedby={hint ? hintId : undefined}
          onClick={onAdd}
        >
          {addButtonLabels[addStatus]}
        </button>
      </div>
    </article>
  )
}

export default PokemonCard
