import PokemonHeader from "./PokemonHeader";
import PokemonList from "./PokemonList";

function App() {
    return (
        <div className="px-[80px] py-[36px] gap-[24px]">
            <PokemonHeader />
            <section>
                <div>오늘의 추천</div>
                <h1>포켓몬과 함께하는 하루</h1>
            </section>
            <PokemonList />
        </div>
    );
}

export default App;
