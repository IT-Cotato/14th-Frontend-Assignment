import PokemonHeader from "./components/PokemonHeader";
import PokemonList from "./components/PokemonList";

function App() {
  return (
    <>
      <PokemonHeader />

      <main>
        <section className="hero">
          <div className="hero-content">

            <div className="title">
              <h1>나의 팀</h1>
              <p>최대 6마리의 포켓몬으로 나만의 팀을 완성하세요.</p>
            </div>

            <div className="pill">
              <span>3 / 6</span>
            </div>

            <div className="actions">
              <button className="primary-button">팀 저장</button>
              <button className="secondary-button">취소</button>
            </div>

          </div>
        </section>

        <PokemonList />
      </main>
    </>
  );
}

export default App;