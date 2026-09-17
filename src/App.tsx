import PokemonHeader from './PokemonHeader' 
import PokemonList from './PokemonList'
import PokemonCard from './PokemonCard'
//현재 App.tsx와 같은 src 폴더에 있는 PokemonHeader.tsx에서 가져온다.

function App() {
  return (
    <div className="page-container">
      <PokemonHeader />
      <PokemonList />
      <PokemonCard />
    </div>
  )
}

export default App