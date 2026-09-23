import SiteHeader from "./SiteHeader";
import SearchBar from "./SearchBar";
import PokemonList from "./PokemonList";
import "./PokedexPage.css";

function PokedexPage() {
    return (
        <div className="page">
            <SiteHeader activeMenu="도감" teamCount={3} maxTeamSize={6} />
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
            <PokemonList />
        </div>
    );
}

export default PokedexPage;
