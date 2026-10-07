const brandName = 'PokéMate'

/** 시안에 표시된 도감 전체 수. 화면에 그리는 로컬 예시 데이터 개수와는 별개 값이다. */
const totalDexCount = 151

const dexTitle = '포켓몬 도감'
const dexDescription = '다양한 포켓몬을 만나고 팀에 추가해 보세요.'
const dexBadge = `전체 ${totalDexCount}마리`

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
                  className={`nav-pill${isActive ? ' nav-pill--active' : ''}`}
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
          <span className="dex-intro__badge">{dexBadge}</span>
        </div>
      )}
    </header>
  )
}

export default PokemonHeader
