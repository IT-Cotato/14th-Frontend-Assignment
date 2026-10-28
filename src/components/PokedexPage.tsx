import { useState } from "react";
import SiteHeader, { type MenuKey } from "./SiteHeader";
import SearchBar from "./SearchBar";
import PokemonList from "./PokemonList";
import PokemonCardItem from "./PokemonCardItem";
import StatePanel from "./StatePanel";
import { usePokemonList } from "../hooks/usePokemonList";
import type { Pokemon } from "../data/pokemons";
import "./PokedexPage.css";

type PokedexPageProps = {
    teamCount: number;
    maxTeamSize: number;
    addedPokemonIds: number[];
    isTeamFull: boolean;
    isRestoreNoticeOpen: boolean;
    onNavigate: (menu: MenuKey) => void;
    onAddToTeam: (pokemon: Pokemon) => void;
    onDismissRestoreNotice: () => void;
};

function PokedexPage({
    teamCount,
    maxTeamSize,
    addedPokemonIds,
    isTeamFull,
    isRestoreNoticeOpen,
    onNavigate,
    onAddToTeam,
    onDismissRestoreNotice,
}: PokedexPageProps) {
    const [searchInput, setSearchInput] = useState("");
    const pokemonList = usePokemonList();

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
                    <h1 className="pokedex__title">실시간 포켓몬 도감</h1>
                    <p className="pokedex__description">
                        이름이나 도감 번호로 포켓몬을 바로 찾아보세요.
                    </p>
                </div>
            </div>
            <SearchBar
                value={searchInput}
                placeholder="pikachu"
                onChange={setSearchInput}
                onSubmit={() => {}}
            />
            {isRestoreNoticeOpen && (
                <StatePanel
                    variant="error"
                    title="저장된 팀을 불러오지 못했어요"
                    description="저장 데이터를 초기화했어요."
                    actionLabel="확인"
                    onAction={onDismissRestoreNotice}
                />
            )}
            {pokemonList.status === "success" && (
                <PokemonList>
                    {pokemonList.items.map((item) => (
                        <li key={item.name}>
                            <PokemonCardItem
                                url={item.url}
                                addedPokemonIds={addedPokemonIds}
                                isTeamFull={isTeamFull}
                                onAdd={onAddToTeam}
                            />
                        </li>
                    ))}
                </PokemonList>
            )}
        </div>
    );
}

export default PokedexPage;
