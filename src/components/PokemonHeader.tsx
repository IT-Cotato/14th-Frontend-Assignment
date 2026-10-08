const brandName = 'PokéMate'

const dexTitle = '포켓몬을 찾고 팀을 완성하세요'
const dexDescription = '도감과 나의 팀을 한 화면에서 관리할 수 있어요.'

export type AppView = 'dex' | 'team'

type PokemonHeaderProps = {
  currentView: AppView
  onNavigate: (view: AppView) => void
  /** 실제 팀 state의 team.length에서 계산한 값 */
  teamCount: number
  teamLimit: number
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
      {currentView === 'dex' && (
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
