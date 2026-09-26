import PokemonHeader from "./components/PokemonHeader";
import PokemonList from "./components/PokemonList";

function App() {
  return (
    <>
      <PokemonHeader />

      <main>
        <section className="hero">
          
          <div className="hero-content">
            <h1>포켓몬 도감</h1>

            <p>
              다양한 포켓몬을 만나고 팀에 추가해보세요.
            </p>

            <div className="total">전체 151마리</div>
          </div>
          
        </section>

        <section className="search-section">
          <div className="search">
            <input placeholder="이름 또는 번호" />
            <button>검색</button>
          </div>
        </section>

        <PokemonList />
      </main>
    </>
  );
}

export default App;