import SiteHeader, { type MenuKey } from "./SiteHeader";
import PokemonHeader from "./PokemonHeader";
import SearchBar from "./SearchBar";
import PokemonList from "./PokemonList";
import Notice from "./Notice";
import type { Pokemon } from "../data/pokemons";
import "./HomePage.css";

type HomePageProps = {
    teamCount: number;
    maxTeamSize: number;
    addedPokemonIds: number[];
    isTeamFull: boolean;
    onNavigate: (menu: MenuKey) => void;
    onAddToTeam: (pokemon: Pokemon) => void;
};

function HomePage({
    teamCount,
    maxTeamSize,
    addedPokemonIds,
    isTeamFull,
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
            {isTeamFull && (
                <Notice
                    title="팀이 가득 찼어요"
                    description={`최대 ${maxTeamSize}마리까지 추가할 수 있어요. 내 팀에서 포켓몬을 삭제하면 다시 추가할 수 있어요.`}
                />
            )}
            <section className="home__list">
                <div className="home__list-header">
                    <h2 className="home__list-title">추천 포켓몬</h2>
                    <button type="button" className="home__list-view-all">
                        전체 보기
                    </button>
                </div>
                <PokemonList
                    addedPokemonIds={addedPokemonIds}
                    isTeamFull={isTeamFull}
                    onAdd={onAddToTeam}
                />
            </section>
        </div>
    );
}

export default HomePage;
