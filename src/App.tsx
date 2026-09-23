import PokemonHeader from "./components/PokemonHeader";
import PokemonList from "./components/PokemonList";

function App() {
  return (
    <div className="pokedex-shell">
      <PokemonHeader />
      <PokemonList />
    </div>
  );
}

export default App;