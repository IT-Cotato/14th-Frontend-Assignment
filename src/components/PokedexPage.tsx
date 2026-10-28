import { useState, type ReactNode } from "react";
import SiteHeader, { type MenuKey } from "./SiteHeader";
import SearchBar from "./SearchBar";
import PokemonList from "./PokemonList";
import PokemonCardItem from "./PokemonCardItem";
import PokemonSearchResult from "./PokemonSearchResult";
import StatePanel from "./StatePanel";
import { usePokemonList } from "../hooks/usePokemonList";
import { isValidPokemonQuery } from "../data/pokeApi";
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
    const [searchQuery, setSearchQuery] = useState("");
    const { state: pokemonList, retry: retryPokemonList } = usePokemonList();

    function handleSearch() {
        setSearchQuery(searchInput.trim().toLowerCase());
    }

    let content: ReactNode;
    if (searchQuery !== "" && !isValidPokemonQuery(searchQuery)) {
        content = (
            <StatePanel
                title="검색 결과가 없어요"
                description="다른 이름이나 번호로 검색해 보세요."
            />
        );
    } else if (searchQuery !== "") {
        content = (
            <PokemonSearchResult
                key={searchQuery}
                query={searchQuery}
                addedPokemonIds={addedPokemonIds}
                isTeamFull={isTeamFull}
                onAdd={onAddToTeam}
            />
        );
    } else if (pokemonList.status === "loading") {
        content = (
            <StatePanel
                variant="loading"
                title="포켓몬을 불러오는 중"
                description="잠시만 기다려 주세요."
            />
        );
    } else if (pokemonList.status === "error") {
        content = (
            <StatePanel
                variant="error"
                title="연결이 원활하지 않아요"
                description="네트워크를 확인하고 다시 시도해 주세요."
                actionLabel="다시 시도"
                onAction={retryPokemonList}
            />
        );
    } else {
        content = (
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
        );
    }

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
                <div className="pokedex__controls">
                    <span className="pokedex__pill">PokéAPI 온라인</span>
                </div>
            </div>
            <SearchBar
                value={searchInput}
                placeholder="pikachu"
                onChange={setSearchInput}
                onSubmit={handleSearch}
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
            {content}
        </div>
    );
}

export default PokedexPage;
