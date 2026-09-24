import PokemonHeader from "./components/PokemonHeader";
import PokemonList from "./components/PokemonList";

function App() {
  return (
    <div className="flex flex-col gap-6 px-20 py-9 bg-neutral-canvas">
      <PokemonHeader />
      <PokemonList />
    </div>
  );
}

export default App;
