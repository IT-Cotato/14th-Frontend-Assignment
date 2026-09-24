import PokemonHeader from './components/PokemonHeader.tsx'
import PokemonList from './components/PokemonList.tsx'

function App() {
  return (
    <div className="mainpage">
      <PokemonHeader />
      <PokemonList />
    </div>
  )
}

export default App