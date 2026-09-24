import { useState } from "react";
import PokemonHeader from "./PokemonHeader";
import PokemonList from "./PokemonList";

function HomePage() {
  const [heroFailed, setHeroFailed] = useState(false);
  const [iconFailed, setIconFailed] = useState(false);

  return (
    <>
      <PokemonHeader activePage="home" />

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
          {!heroFailed && (
            <img
              src="/Pikachu.svg"
              alt="피카츄"
              onError={() => setHeroFailed(true)}
            />
          )}
        </div>
      </section>

      <div className="search-field">
        <div className="input">
          <div className="icon">
            {!iconFailed && (
              <img
                src="/search-icon.svg"
                alt="검색"
                onError={() => setIconFailed(true)}
              />
            )}
          </div>
          <span className="query">이름 또는 번호</span>
        </div>

        <button className="action">
          <span className="label">검색</span>
        </button>
      </div>

      <div className="section-head">
        <h2>추천 포켓몬</h2>
        <a href="#pokedex">전체 보기</a>
      </div>

      <PokemonList />
    </>
  );
}

export default HomePage;