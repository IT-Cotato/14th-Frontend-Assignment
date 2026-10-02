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
  imageUrl: string
}

type PokemonCardProps = Pokemon

/** 도감 ID를 #0025 형태의 도감 번호 문구로 바꾼다. 원본 데이터는 건드리지 않는다. */
function formatDexNumber(id: number) {
  return `#${String(id).padStart(4, '0')}`
}

function PokemonCard({ id, name, types, imageUrl }: PokemonCardProps) {
  return (
    <article className="pokemon-card">
      <div className="pokemon-card__image-box">
        <img
          className="pokemon-card__image"
          src={imageUrl}
          alt={`${name} 일러스트`}
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
      <button type="button" className="button button--primary button--card">
        팀에 추가
      </button>
    </article>
  )
}

export default PokemonCard
