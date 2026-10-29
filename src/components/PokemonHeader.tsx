const brandName = 'PokéMate'

/** ?preview 로컬 도감 (W04 시안) */
const dexTitle = '포켓몬을 찾고 팀을 완성하세요'
const dexDescription = '도감과 나의 팀을 한 화면에서 관리할 수 있어요.'
/** PokéAPI 도감 (W05 시안) */
const apiDexTitle = '실시간 포켓몬 도감'
const apiDexDescription = '이름이나 도감 번호로 포켓몬을 바로 찾아보세요.'

export type AppView = 'dex' | 'team'

/** 지금 화면에 보이는 목록·검색 요청에서 계산한 PokéAPI 연결 상태 */
export type ApiStatus = 'checking' | 'online' | 'error'

const apiStatusLabels: Record<ApiStatus, string> = {
  checking: 'PokéAPI 연결 중',
  online: 'PokéAPI 온라인',
  error: 'PokéAPI 연결 확인',
}

type PokemonHeaderProps = {
  currentView: AppView
  onNavigate: (view: AppView) => void
  /** 실제 팀 state의 team.length에서 계산한 값 */
  teamCount: number
  teamLimit: number
  /** PokéAPI 도감 화면일 때만 넘긴다. 있으면 W05 제목과 연결 상태 배지를 그린다. */
  apiStatus?: ApiStatus
}

const navItems: { view: AppView; label: string }[] = [
  { view: 'dex', label: '도감' },
  { view: 'team', label: '내 팀' },
]

function PokemonHeader({
  currentView,
  onNavigate,
  teamCount,
  teamLimit,
  apiStatus,
}: PokemonHeaderProps) {
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
            <button type="button" className="nav-pill nav-pill--home">
              홈
            </button>
            {navItems.map(({ view, label }) => {
              const isActive = view === currentView
              return (
                <button
                  key={view}
                  type="button"
                  className={`nav-pill nav-pill--${view}${isActive ? ' nav-pill--active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => onNavigate(view)}
                >
                  {label}
                </button>
              )
            })}
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
      {currentView === 'dex' && apiStatus && (
        <div className="dex-intro">
          <div className="dex-intro__text">
            <h1 className="dex-intro__title">{apiDexTitle}</h1>
            <p className="dex-intro__description">{apiDexDescription}</p>
          </div>
          <span className={`api-badge api-badge--${apiStatus}`}>
            {apiStatusLabels[apiStatus]}
          </span>
        </div>
      )}
      {currentView === 'dex' && !apiStatus && (
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
