import SiteHeader from "./components/SiteHeader";
import PokemonHeader from "./components/PokemonHeader";
import SearchBar from "./components/SearchBar";
import PokemonList from "./components/PokemonList";

function App() {
    return (
        <div className="page">
            <SiteHeader activeMenu="홈" teamCount={0} maxTeamSize={6} />
            <PokemonHeader
                badge="오늘의 추천"
                title="포켓몬과 함께하는 하루"
                description="좋아하는 포켓몬을 찾고 나만의 팀을 만들어 보세요."
            />
            <SearchBar />
            <PokemonList />
        </div>
    );
}

export default App;
