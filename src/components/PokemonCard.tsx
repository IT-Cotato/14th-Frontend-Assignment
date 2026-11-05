import { useId } from 'react'
import type { MouseEvent } from 'react'
import { TEAM_LIMIT } from '../data/team.ts'
import type { AddStatus } from '../data/team.ts'
import PokemonImage from './PokemonImage.tsx'

/**
 * PokéAPI의 일반 타입 18종. 화면 표기와 CSS 클래스에 쓰는 대문자 값이며,
 * API의 소문자 타입 이름은 api/pokeapi.ts에서 이 값으로 바꾼다.
 */
export type PokemonType =
  | 'NORMAL'
  | 'FIRE'
  | 'WATER'
  | 'ELECTRIC'
  | 'GRASS'
  | 'ICE'
  | 'FIGHTING'
  | 'POISON'
  | 'GROUND'
  | 'FLYING'
  | 'PSYCHIC'
  | 'BUG'
  | 'ROCK'
  | 'GHOST'
  | 'DRAGON'
  | 'DARK'
  | 'STEEL'
  | 'FAIRY'

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
  /** 화면에 보일 타입 개수. 없으면 전부 보인다. (W05 PokéAPI 도감은 대표 타입 1개) */
  visibleTypeCount?: number
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
  visibleTypeCount,
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
        {types.slice(0, visibleTypeCount).map((type) => (
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

type PokemonCardPlaceholderProps = {
  /** 목록 url에서 꺼낸 번호. 형식이 달라 못 꺼냈으면 null */
  id: number | null
  /** 목록 응답의 영문 이름 */
  name: string
}

/** 목록은 받았지만 상세를 아직 받는 중인 카드 자리 */
export function PokemonCardLoading({ id, name }: PokemonCardPlaceholderProps) {
  return (
    <article className="pokemon-card pokemon-card--loading" aria-busy="true">
      <div className="pokemon-card__image-box">
        <span className="pokemon-card__placeholder-icon" aria-hidden="true">
          …
        </span>
      </div>
      {id !== null && <p className="pokemon-card__number">{formatDexNumber(id)}</p>}
      <h3 className="pokemon-card__name">{name}</h3>
      <p className="pokemon-card__status">상세 정보를 불러오는 중</p>
    </article>
  )
}

type PokemonCardErrorProps = PokemonCardPlaceholderProps & {
  /** 같은 번호의 포켓몬 이미지가 이미 있으면 재사용한다. 없으면 이름 대체 UI를 그린다. */
  imageUrl?: string
  onRetry: (event: MouseEvent<HTMLButtonElement>) => void
}

/**
 * 상세 요청이 실패한 카드 자리 (W05 상태 시안: 분홍 배경·테두리, 번호, ‘상세 정보 실패’, 다시 시도).
 * 시안에는 이름 줄이 없으므로 목록의 영문 이름은 카드 제목(스크린 리더)과 버튼 이름으로 알린다.
 */
export function PokemonCardError({ id, name, imageUrl, onRetry }: PokemonCardErrorProps) {
  const titleId = useId()

  return (
    <article className="pokemon-card pokemon-card--error" aria-labelledby={titleId}>
      <h3 id={titleId} className="visually-hidden">
        {name} 상세 정보 실패
      </h3>
      <div className="pokemon-card__image-box">
        <PokemonImage
          name={name}
          imageUrl={imageUrl}
          className="pokemon-card__image"
          fallbackClassName="pokemon-card__image-fallback"
        />
      </div>
      {id !== null && <p className="pokemon-card__number">{formatDexNumber(id)}</p>}
      <p className="pokemon-card__status pokemon-card__status--error" aria-hidden="true">
        상세 정보 실패
      </p>
      <div className="pokemon-card__footer">
        <button
          type="button"
          className="button button--primary button--card"
          aria-label={`${name} 상세 정보 다시 시도`}
          onClick={onRetry}
        >
          다시 시도
        </button>
      </div>
    </article>
  )
}

export default PokemonCard
