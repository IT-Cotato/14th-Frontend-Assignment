import { useState } from "react";
import PokemonHeader from "./PokemonHeader";
import PokemonList from "./PokemonList";

function PokedexPage() {
  const [iconFailed, setIconFailed] = useState(false);

  return (
    <>
      <PokemonHeader activePage="pokedex" />

      <div className="pokedex-title">
        <div className="pokedex-title__text">
          <h2>포켓몬 도감</h2>
          <p>다양한 포켓몬을 만나고 팀에 추가해 보세요.</p>
        </div>

        <span className="pokedex-count">
          <span className="pokedex-count__label">전체 151마리</span>
        </span>
      </div>

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

      <PokemonList />
    </>
  );
}

export default PokedexPage;