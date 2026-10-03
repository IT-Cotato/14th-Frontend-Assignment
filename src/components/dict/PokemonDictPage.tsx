import PokemonHeader from "./PokemonHeader";
import PokemonList from "./PokemonList";
import PokemonCard from "./PokemonCard";
import "./dict.css";

function PokemonDictPage() {
  return (
    <>
      <PokemonHeader />
        <main>
          <section className="dict-hero">
            
            <div className="dict-hero-content">
              <h1>포켓몬 도감</h1>

              <p>
                다양한 포켓몬을 만나고 팀에 추가해보세요.
              </p>

              <div className="dict-total">전체 151마리</div>
            </div>
            
          </section>

          <section className="dict-search-section">
            <div className="dict-search">
              <input placeholder="이름 또는 번호" />
              <button>검색</button>
            </div>
          </section>
      <PokemonList />
      <PokemonCard number={""} name={""} type={""} image={""} />
      </main>
    </>
  );
}

export default PokemonDictPage;