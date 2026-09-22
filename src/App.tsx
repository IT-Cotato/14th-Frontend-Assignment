import Header from './components/Header';
import PokedexTitle from './components/PokedexTitle';
import SearchBar from './components/SearchBar';
import PokemonList from './components/PokemonList';
import { POKEMONS } from './data/pokemons';
import { TEAM, TEAM_SIZE } from './data/team';

function App() {
  return (
    <div className="app">
      <Header activeNav="도감" teamCount={TEAM.length} teamLimit={TEAM_SIZE} />

      <PokedexTitle
        title="포켓몬 도감"
        description="다양한 포켓몬을 만나고 팀에 추가해 보세요."
        totalCount={151}
      />

      <SearchBar placeholder="이름 또는 번호" />

      <PokemonList pokemons={POKEMONS} />
    </div>
  );
}

export default App;
