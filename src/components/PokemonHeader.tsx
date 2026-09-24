function PokemonHeader() {
  return (
    <header className="header">
      <div className="logo">
        <span className="logo-mark">PM</span>
        <span className="logo-name">PokéMate</span>
      </div>

      <nav className="nav">
        <button className="nav-active">홈</button>
        <button className="nav-button">도감</button>
        <button className="nav-button">내 팀</button>
        <span>0 / 6</span>
      </nav>
    </header>
  );
}

export default PokemonHeader;