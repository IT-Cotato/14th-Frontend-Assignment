import SiteHeader from "./SiteHeader";
import PokemonHeader from "./PokemonHeader";
import SearchBar from "./SearchBar";
import PokemonList from "./PokemonList";
import "./HomePage.css";

function HomePage() {
    return (
        <div className="page">
            <SiteHeader activeMenu="홈" teamCount={0} maxTeamSize={6} />
            <PokemonHeader
                badge="오늘의 추천"
                title="포켓몬과 함께하는 하루"
                description="좋아하는 포켓몬을 찾고 나만의 팀을 만들어 보세요."
            />
            <SearchBar />
            <section className="home__list">
                <div className="home__list-header">
                    <h2 className="home__list-title">추천 포켓몬</h2>
                    <button type="button" className="home__list-view-all">
                        전체 보기
                    </button>
                </div>
                <PokemonList />
            </section>
        </div>
    );
}

export default HomePage;
