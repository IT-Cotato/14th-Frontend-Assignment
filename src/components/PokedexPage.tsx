import SiteHeader, { type MenuKey } from "./SiteHeader";
import SearchBar from "./SearchBar";
import PokemonList from "./PokemonList";
import Notice from "./Notice";
import type { Pokemon } from "../data/pokemons";
import "./PokedexPage.css";

type PokedexPageProps = {
    teamCount: number;
    maxTeamSize: number;
    addedPokemonIds: number[];
    isTeamFull: boolean;
    onNavigate: (menu: MenuKey) => void;
    onAddToTeam: (pokemon: Pokemon) => void;
};

function PokedexPage({
    teamCount,
    maxTeamSize,
    addedPokemonIds,
    isTeamFull,
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
            {isTeamFull && (
                <Notice
                    title="팀이 가득 찼어요"
                    description={`최대 ${maxTeamSize}마리까지 추가할 수 있어요. 내 팀에서 포켓몬을 삭제하면 다시 추가할 수 있어요.`}
                />
            )}
            <PokemonList
                addedPokemonIds={addedPokemonIds}
                isTeamFull={isTeamFull}
                onAdd={onAddToTeam}
            />
        </div>
    );
}

export default PokedexPage;
