import Header from './components/Header';
import PokemonHeader from './components/PokemonHeader';
import SearchBar from './components/SearchBar';
import PokemonList from './components/PokemonList';
import { POKEMONS } from './data/pokemons';
import pikachu from './assets/Pikachu.png';

function App() {
  return (
    <div className="app">
      <Header teamCount={0} teamLimit={6} />

      <PokemonHeader
        badge="오늘의 추천"
        title="포켓몬과 함께하는 하루"
        description="좋아하는 포켓몬을 찾고 나만의 팀을 만들어 보세요."
        heroImageUrl={pikachu}
        heroImageName="피카츄"
      />

      <SearchBar placeholder="이름 또는 번호" />

      <PokemonList title="추천 포켓몬" moreLabel="전체 보기" pokemons={POKEMONS} />
    </div>
  );
}

export default App;
