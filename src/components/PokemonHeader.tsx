function PokemonHeader() {
  return (
    <>
      <header className="header">

        <div className="brand">
          <span className="logo-mark">PM</span>
          <strong>PokéMate</strong>
        </div>

        <nav className="navigation">
          <button className="nav-home">홈</button>
          <button className="nav-pokedex">도감</button>
          <button className="nav-my-team">내 팀</button>
          <span className="team-count">0 / 6</span>
        </nav>

      </header>

      <section className="hero">

        <div className="hero-copy">

          <span className="pill">오늘의 추천</span>

          <h1>포켓몬과 함께하는 하루</h1>

          <p>좋아하는 포켓몬을 찾고 나만의 팀을 만들어 보세요.</p>

          <div className="hero-actions">
            <button className="hero-primary">도감 보기</button>
            <button className="hero-secondary">내 팀</button>
          </div>

        </div>

        <div className="hero-artwork">
          <img src="/Pikachu.svg" alt="피카츄" />
        </div>

      </section>

      <div className="search-field">

        <div className="input">

          <div className="icon">
            <img src="/search-icon.svg" alt="검색" />
          </div>

          <span className="query">이름 또는 번호</span>

        </div>

        <button className="action">
          <span className="label">검색</span>
        </button>

      </div>

      <div className="section-header">
        <span className="section-title">추천 포켓몬</span>
        <button className="section-more">전체 보기</button>
      </div>

    </>
  );
}

export default PokemonHeader;