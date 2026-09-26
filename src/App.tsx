import PokemonHeader from "./components/PokemonHeader";
import PokemonList from "./components/PokemonList";
import Pikachu from "./assets/Pikachu.png";

function App() {
  return (
    <>
      <PokemonHeader />

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="recommend">오늘의 추천</span>

            <h1>포켓몬과 함께하는 하루</h1>

            <p>
              좋아하는 포켓몬을 찾고 나만의 팀을 만들어 보세요.
            </p>

            <div className="hero-buttons">
              <button className="primary-button">
                도감 보기
              </button>

              <button className="secondary-button">
                내 팀
              </button>
            </div>
          </div>

          <div className="hero-image">
            <img src={Pikachu} alt="피카츄" />
          </div>
        </section>
        <section className="sectionTitle-section">
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