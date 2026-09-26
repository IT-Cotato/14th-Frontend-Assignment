import PokemonHeader from './components/PokemonHeader.tsx'
import PokemonList from './components/PokemonList.tsx'
import { emptyPokemons, pokemons } from './data/pokemons.ts'

/**
 * 주소의 preview 쿼리값으로 화면에 쓸 데이터만 고른다.
 * ?preview=empty 이면 빈 목록, 그 외에는 기본 목록을 쓴다.
 */
function selectPokemons(search: string) {
  const preview = new URLSearchParams(search).get('preview')
  return preview === 'empty' ? emptyPokemons : pokemons
}

function App() {
  return (
    <div className="page">
      <PokemonHeader />
      <PokemonList pokemons={selectPokemons(window.location.search)} />
    </div>
  )
}

export default App
