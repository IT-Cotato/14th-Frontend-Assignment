import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router'
import type { DexFetchStatus } from '../hooks/usePokemonDex.ts'

const brandName = 'PokéMate'

/** ?preview 로컬 도감 (W04 시안) */
const dexTitle = '포켓몬을 찾고 팀을 완성하세요'
const dexDescription = '도감과 나의 팀을 한 화면에서 관리할 수 있어요.'
/** PokéAPI 도감 (W06 시안) */
const apiDexTitle = '포켓몬 도감'
const apiDexDescription = '페이지를 이동해도 이전 포켓몬을 빠르게 다시 볼 수 있어요.'

/** 도감 소개: api(PokéAPI 도감), local(?preview 로컬 도감), null(도감이 아닌 화면) */
export type DexIntro = 'api' | 'local' | null

/** 시안의 노란 배지. 기본 문구는 ‘최신 목록’이고, 요청 중에는 작은 갱신 표시로 문구만 바뀐다. */
const fetchStatusLabels: Record<DexFetchStatus, string> = {
  fresh: '최신 목록',
  refreshing: '갱신 중',
  loading: '불러오는 중',
  failed: '갱신 실패',
}

type PokemonHeaderProps = {
  dexIntro: DexIntro
  /** 실제 팀 state의 team.length에서 계산한 값 */
  teamCount: number
  teamLimit: number
  /** PokéAPI 도감 화면일 때만 넘긴다. 있으면 W06 제목과 갱신 표시 배지를 그린다. */
  fetchStatus?: DexFetchStatus
  /** 캐시된 목록을 다시 받다 실패했을 때만 넘긴다. 있으면 배지를 ‘다시 시도’ 버튼으로 그린다. */
  onRetryRefresh?: () => void
}

/** 홈은 / 에서만, 도감·내 팀은 하위 경로(상세·편집)에서도 선택된 메뉴로 보인다. */
const navItems: { to: string; label: string; className: string; end: boolean }[] = [
  { to: '/', label: '홈', className: 'nav-pill--home', end: true },
  { to: '/pokemon', label: '도감', className: 'nav-pill--dex', end: false },
  { to: '/my-team', label: '내 팀', className: 'nav-pill--team', end: false },
]

function PokemonHeader({
  dexIntro,
  teamCount,
  teamLimit,
  fetchStatus,
  onRetryRefresh,
}: PokemonHeaderProps) {
  const badgeRef = useRef<HTMLSpanElement>(null)
  // 다시 시도 버튼은 요청이 시작되면 ‘갱신 중’ 배지로 바뀌어 사라진다. 그때 포커스를 바뀐 배지로 옮긴다.
  const focusBadgeRef = useRef(false)

  useEffect(() => {
    if (!focusBadgeRef.current || onRetryRefresh) return
    focusBadgeRef.current = false
    badgeRef.current?.focus()
  }, [onRetryRefresh])

  function handleRetryRefresh() {
    focusBadgeRef.current = true
    onRetryRefresh?.()
  }

  return (
    <header className="pokemon-header">
      <div className="top-bar">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true">
            PM
          </span>
          <span className="brand__name">{brandName}</span>
        </div>

        <div className="top-bar__actions">
          <nav className="top-nav" aria-label="주요 메뉴">
            {navItems.map(({ to, label, className, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `nav-pill ${className}${isActive ? ' nav-pill--active' : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <span
            className="team-count"
            aria-label={`팀 인원 ${teamCount}명, 최대 ${teamLimit}명`}
          >
            {/* 모바일 시안에서만 숫자 앞에 '내 팀'을 붙인다 */}
            <span className="team-count__label">내 팀 </span>
            {teamCount} / {teamLimit}
          </span>
        </div>
      </div>

      {/* 도감 소개는 도감 화면에서만 보인다. 내 팀 화면의 제목은 PokemonTeam이 그린다. */}
      {dexIntro === 'api' && fetchStatus && (
        <div className="dex-intro">
          <div className="dex-intro__text">
            <h1 className="dex-intro__title">{apiDexTitle}</h1>
            <p className="dex-intro__description">{apiDexDescription}</p>
          </div>
          {onRetryRefresh ? (
            // 갱신 실패: 카드는 그대로 두고 같은 배지 자리에서 다시 시도한다.
            <button
              type="button"
              className="dex-intro__badge dex-intro__badge--retry"
              onClick={handleRetryRefresh}
            >
              {fetchStatusLabels.failed} · 다시 시도
            </button>
          ) : (
            // 요청이 시작·완료될 때 문구가 바뀌므로 스크린 리더에도 조용히 알린다
            <span ref={badgeRef} className="dex-intro__badge" role="status" tabIndex={-1}>
              {fetchStatusLabels[fetchStatus]}
            </span>
          )}
        </div>
      )}
      {dexIntro === 'local' && (
        <div className="dex-intro">
          <div className="dex-intro__text">
            <h1 className="dex-intro__title">{dexTitle}</h1>
            <p className="dex-intro__description">{dexDescription}</p>
          </div>
          {/* 배지의 인원은 예시 숫자가 아니라 실제 team.length에서 온 값이다 */}
          <span
            className="dex-intro__badge"
            aria-label={`내 팀 ${teamCount}명, 최대 ${teamLimit}명`}
          >
            내 팀 {teamCount} / {teamLimit}
          </span>
        </div>
      )}
    </header>
  )
}

export default PokemonHeader
