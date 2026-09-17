function Header() {
  const teamCount = 0
  const teamMax = 6

  return (
    <header className="header">
      <div className="header-brand">
        <span className="header-logo">PM</span>
        <span className="header-name">PokéMate</span>
      </div>

      <nav className="header-nav">
        <span className="nav-item nav-item-active">홈</span>
        <span className="nav-item">도감</span>
        <span className="nav-item">내 팀</span>
        <span className="header-count">
          {teamCount} / {teamMax}
        </span>
      </nav>
    </header>
  )
}

export default Header