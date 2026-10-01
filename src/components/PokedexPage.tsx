import SiteHeader, { type MenuKey } from "./SiteHeader";
import SearchBar from "./SearchBar";
import PokemonList from "./PokemonList";
import type { Pokemon } from "../data/pokemons";
import "./PokedexPage.css";

type PokedexPageProps = {
    teamCount: number;
    maxTeamSize: number;
    onNavigate: (menu: MenuKey) => void;
    onAddToTeam: (pokemon: Pokemon) => void;
};

function PokedexPage({
    teamCount,
    maxTeamSize,
    onNavigate,
    onAddToTeam,
}: PokedexPageProps) {
    return (
        <div className="page">
            <SiteHeader
                activeMenu="pokedex"
                teamCount={teamCount}
                maxTeamSize={maxTeamSize}
                onNavigate={onNavigate}
            />
            <div className="pokedex__title-row">
                <div className="pokedex__title-copy">
                    <h1 className="pokedex__title">포켓몬 도감</h1>
                    <p className="pokedex__description">
                        다양한 포켓몬을 만나고 팀에 추가해 보세요.
                    </p>
                </div>
                <span className="pokedex__pill">전체 151마리</span>
            </div>
            <SearchBar />
            <PokemonList onAdd={onAddToTeam} />
        </div>
    );
}

export default PokedexPage;
