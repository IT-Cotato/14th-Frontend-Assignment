function PokemonHeader() {
  return (
    <header className="header">
      <div className="logo">
        <span className="logo-mark">PM</span>
        <span className="logo-name">PokeMate</span>
      </div>

      <nav className="nav">
        <button className="dict-nav-button">홈</button>
        <button className="dict-nav-active">도감</button>
        <button className="dict-nav-button">내 팀</button>
        <span>0 / 6</span>
      </nav>
    </header>
  );
}

export default PokemonHeader;
