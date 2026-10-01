interface HeaderProps {
  
  teamCount: number
  teamMax: number

  activeView: 'home' | 'team'
  onHomeClick: () => void
  onTeamClick: () => void
}

function Header({ teamCount, teamMax, activeView, onHomeClick, onTeamClick }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-brand">
        <span className="header-logo">PM</span>
        <span className="header-name">PokéMate</span>
      </div>

      <nav className="header-nav">
        <button
          type="button"
          className={`nav-item${activeView === 'home' ? ' nav-item-active' : ''}`}
          onClick={onHomeClick}
        >
          홈
        </button>
        <span className="nav-item">도감</span>
        <button
          type="button"
          className={`nav-item${activeView === 'team' ? ' nav-item-active' : ''}`}
          onClick={onTeamClick}
        >
          내 팀
        </button>
        <span className="header-count">
          {teamCount} / {teamMax}
        </span>
      </nav>
    </header>
  )
}

export default Header
