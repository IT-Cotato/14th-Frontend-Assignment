import { useQuery } from '@tanstack/react-query'
import { Link, useLocation, useParams } from 'react-router'
import {
  PokeApiHttpError,
  PokeApiNetworkError,
  getFlavorText,
  getKoreanName,
  getLocalizedName,
  isNotFoundError,
  toPokemon,
} from '../api/pokeapi.ts'
import {
  getPokemonDetailUrl,
  pokemonAbilityQuery,
  pokemonDetailQuery,
  pokemonSpeciesQuery,
} from '../api/pokemonQueries.ts'
import { TEAM_LIMIT, getAddStatus } from '../data/team.ts'
import type { TeamMember } from '../data/team.ts'
import type { Pokemon } from './PokemonCard.tsx'
import PokemonImage from './PokemonImage.tsx'
import StatePanel from './StatePanel.tsx'

/** 스탯 막대의 최대치. 120 이상은 꽉 찬 막대로 그린다. */
const STAT_MAX = 120
const statLabels: { name: string; label: string }[] = [
  { name: 'hp', label: 'HP' },
  { name: 'attack', label: 'Attack' },
  { name: 'defense', label: 'Defense' },
  { name: 'speed', label: 'Speed' },
]

/** 상세 화면에서 도감으로 돌아갈 때 쓸 이전 목록 조건(?page=&q=). 카드 링크가 state로 넘긴다. */
export type DetailLocationState = { dexSearch?: string } | null

function formatDexNumber(id: number) {
  return `#${String(id).padStart(4, '0')}`
}

/** 주소의 pokemonId. 1 이상의 정수만 받는다. 그 밖의 값은 요청하지 않고 Not Found로 본다. */
function parsePokemonId(raw: string | undefined) {
  if (raw === undefined || !/^\d+$/.test(raw)) return null
  const id = Number(raw)
  return id >= 1 ? id : null
}

type PokemonDetailPageProps = {
  team: TeamMember[]
  onAdd: (pokemon: Pokemon) => void
}

/** /pokemon/:pokemonId. 정상 상세, 잘못된 번호·API 404(Not Found), 네트워크 오류를 나눠 그린다. */
function PokemonDetailPage({ team, onAdd }: PokemonDetailPageProps) {
  const { pokemonId } = useParams()
  const location = useLocation()
  const id = parsePokemonId(pokemonId)
  const dexSearch = (location.state as DetailLocationState)?.dexSearch ?? ''

  const detailQuery = useQuery({
    ...pokemonDetailQuery(id === null ? '' : getPokemonDetailUrl(id)),
    enabled: id !== null,
  })
  const detail = detailQuery.data
  const speciesQuery = useQuery({
    ...pokemonSpeciesQuery(detail?.species.url ?? ''),
    enabled: detail !== undefined,
  })
  // 숨겨진 특성이 아닌 첫 번째 특성을 보여 준다.
  const abilityEntry =
    detail?.abilities.filter((item) => !item.is_hidden).sort((a, b) => a.slot - b.slot)[0] ??
    detail?.abilities[0]
  const abilityQuery = useQuery({
    ...pokemonAbilityQuery(abilityEntry?.ability.url ?? ''),
    enabled: abilityEntry !== undefined,
  })

  const breadcrumb = (
    <nav className="breadcrumb" aria-label="현재 위치">
      <Link to={`/pokemon${dexSearch}`} className="breadcrumb__link">
        도감
      </Link>
      <span className="breadcrumb__separator" aria-hidden="true">
        /
      </span>
      <span aria-current="page">{id === null ? pokemonId : formatDexNumber(id)}</span>
    </nav>
  )

  const notFound = (
    <StatePanel
      variant="error"
      title="페이지를 찾을 수 없어요"
      description="주소를 확인하거나 도감으로 돌아가세요."
    >
      <Link to={`/pokemon${dexSearch}`} className="button button--primary button--card state-panel__action">
        도감으로
      </Link>
    </StatePanel>
  )

  if (id === null || isNotFoundError(detailQuery.error)) {
    return (
      <main className="pokemon-detail">
        {breadcrumb}
        {notFound}
      </main>
    )
  }

  if (!detail) {
    if (detailQuery.isError && !detailQuery.isFetching) {
      const error = detailQuery.error
      return (
        <main className="pokemon-detail">
          {breadcrumb}
          <StatePanel
            variant="error"
            title={error instanceof PokeApiNetworkError ? '연결이 원활하지 않아요' : '포켓몬 정보를 불러오지 못했어요'}
            description={
              error instanceof PokeApiHttpError
                ? `잠시 후 다시 시도해 주세요. (HTTP ${error.status})`
                : '네트워크를 확인하고 다시 시도해 주세요.'
            }
            onRetry={() => void detailQuery.refetch()}
          />
        </main>
      )
    }
    return (
      <main className="pokemon-detail">
        {breadcrumb}
        <StatePanel variant="loading" title="포켓몬을 불러오는 중" description="잠시만 기다려 주세요." />
      </main>
    )
  }

  // 한국어 이름·설명·특성이 없거나 조회에 실패하면 영문으로 대체한다.
  const species = speciesQuery.data
  const pokemon = toPokemon(detail, species ? getKoreanName(species) : null)
  const description = species ? getFlavorText(species) : null
  const abilityName =
    (abilityQuery.data && getLocalizedName(abilityQuery.data.names)) ?? abilityEntry?.ability.name ?? '-'
  const addStatus = getAddStatus(team, pokemon.id)
  const stats = statLabels.map(({ name, label }) => ({
    label,
    value: detail.stats.find((item) => item.stat.name === name)?.base_stat ?? 0,
  }))

  return (
    <main className="pokemon-detail">
      {breadcrumb}
      <article className="detail-card">
        <div className="detail-card__visual">
          <div className="detail-card__image-box">
            <PokemonImage
              name={pokemon.name}
              imageUrl={pokemon.imageUrl}
              className="detail-card__image"
              fallbackClassName="pokemon-card__image-fallback"
            />
          </div>
        </div>

        <div className="detail-card__info">
          <p className="detail-card__number">{formatDexNumber(pokemon.id)}</p>
          <h1 className="detail-card__name">{pokemon.name}</h1>
          {description && <p className="detail-card__description">{description}</p>}
          <div className="type-chips detail-card__types">
            {pokemon.types.map((type) => (
              <span key={type} className={`type-chip type-chip--${type.toLowerCase()}`}>
                {type}
              </span>
            ))}
          </div>

          <dl className="detail-card__facts">
            <div className="detail-card__fact">
              <dt>키</dt>
              <dd>{detail.height / 10} m</dd>
            </div>
            <div className="detail-card__fact">
              <dt>몸무게</dt>
              <dd>{detail.weight / 10} kg</dd>
            </div>
            <div className="detail-card__fact">
              <dt>특성</dt>
              <dd>{abilityName}</dd>
            </div>
          </dl>

          <dl className="detail-card__stats">
            {stats.map(({ label, value }) => (
              <div key={label} className="detail-card__stat">
                <dt>{label}</dt>
                <dd>
                  <span className="stat-bar" role="img" aria-label={`${label} ${value}`}>
                    <span
                      className="stat-bar__fill"
                      style={{ width: `${Math.min(value / STAT_MAX, 1) * 100}%` }}
                    />
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          {addStatus === 'full' && (
            <p className="pokemon-card__hint">최대 {TEAM_LIMIT}마리까지 추가할 수 있어요</p>
          )}
          <button
            type="button"
            className={`button button--primary detail-card__add${addStatus === 'added' ? ' button--added' : ''}`}
            disabled={addStatus !== 'available'}
            onClick={() => onAdd(pokemon)}
          >
            {addStatus === 'added' ? '추가됨' : '내 팀에 추가'}
          </button>
        </div>
      </article>
    </main>
  )
}

export default PokemonDetailPage
