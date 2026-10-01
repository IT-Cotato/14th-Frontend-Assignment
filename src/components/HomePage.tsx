import SiteHeader, { type MenuKey } from "./SiteHeader";
import PokemonHeader from "./PokemonHeader";
import SearchBar from "./SearchBar";
import PokemonList from "./PokemonList";
import type { Pokemon } from "../data/pokemons";
import "./HomePage.css";

type HomePageProps = {
    teamCount: number;
    maxTeamSize: number;
    onNavigate: (menu: MenuKey) => void;
    onAddToTeam: (pokemon: Pokemon) => void;
};

function HomePage({
    teamCount,
    maxTeamSize,
    onNavigate,
    onAddToTeam,
}: HomePageProps) {
    return (
        <div className="page">
            <SiteHeader
                activeMenu="home"
                teamCount={teamCount}
                maxTeamSize={maxTeamSize}
                onNavigate={onNavigate}
            />
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
                <PokemonList onAdd={onAddToTeam} />
            </section>
        </div>
    );
}

export default HomePage;
