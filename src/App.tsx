import PokemonHeader from "./PokemonHeader";
import PokemonList from "./PokemonList";

function App() {
    return (
        <div className="px-[80px] py-[36px] gap-[24px]">
            <PokemonHeader />
            <PokemonList />
        </div>
    );
}

export default App;
