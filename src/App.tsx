import PokemonHeader from "./PokemonHeader";
import PokemonList from "./PokemonList";

function App() {
    return (
        <div className="px-[80px] py-[36px] gap-[24px] bg-[var(--color-bg-canvas)]">
            <PokemonHeader />

            <search>
                <input
                    type="text"
                    placeholder="이름 또는 번호"
                    className="border border-[var(--color-border-default)]"
                ></input>
                <button>검색</button>
            </search>
            <PokemonList />
        </div>
    );
}

export default App;
