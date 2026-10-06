import { useState } from "react";
import SiteHeader, { type MenuKey } from "./SiteHeader";
import SearchBar from "./SearchBar";
import FilterButton from "./FilterButton";
import FilterDialog from "./FilterDialog";
import PokemonList from "./PokemonList";
import StatePanel from "./StatePanel";
import TeamPanel from "./TeamPanel";
import Notice from "./Notice";
import {
    DEFAULT_FILTERS,
    getAvailableTypes,
    getVisiblePokemons,
    pokemons,
    type Pokemon,
    type PokemonFilters,
} from "../data/pokemons";
import type { TeamMember, TeamMemberChanges } from "../data/team";
import "./PokedexPage.css";

type PokedexPageProps = {
    team: TeamMember[];
    maxTeamSize: number;
    addedPokemonIds: number[];
    isTeamFull: boolean;
    isRestoreNoticeOpen: boolean;
    onNavigate: (menu: MenuKey) => void;
    onAddToTeam: (pokemon: Pokemon) => void;
    onRemoveFromTeam: (pokemonId: number) => void;
    onUpdateTeamMember: (pokemonId: number, changes: TeamMemberChanges) => void;
    onDismissRestoreNotice: () => void;
};

function PokedexPage({
    team,
    maxTeamSize,
    addedPokemonIds,
    isTeamFull,
    isRestoreNoticeOpen,
    onNavigate,
    onAddToTeam,
    onRemoveFromTeam,
    onUpdateTeamMember,
    onDismissRestoreNotice,
}: PokedexPageProps) {
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<PokemonFilters>(DEFAULT_FILTERS);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const availableTypes = getAvailableTypes(pokemons);
    const visiblePokemons = getVisiblePokemons(pokemons, searchQuery, filters);

    function handleApplyFilters(nextFilters: PokemonFilters) {
        setFilters(nextFilters);
        setIsFilterOpen(false);
    }

    return (
        <div className="page">
            <SiteHeader
                activeMenu="pokedex"
                teamCount={team.length}
                maxTeamSize={maxTeamSize}
                onNavigate={onNavigate}
            />
            <div className="pokedex__title-row">
                <div className="pokedex__title-copy">
                    <h1 className="pokedex__title">
                        포켓몬을 찾고 팀을 완성하세요
                    </h1>
                    <p className="pokedex__description">
                        도감과 나의 팀을 한 화면에서 관리할 수 있어요.
                    </p>
                </div>
                <div className="pokedex__controls">
                    <span className="pokedex__pill">
                        내 팀 {team.length} / {maxTeamSize}
                    </span>
                </div>
            </div>
            <div className="pokedex__search-row">
                <SearchBar
                    value={searchInput}
                    placeholder="피카츄 또는 25"
                    onChange={setSearchInput}
                    onSubmit={() => setSearchQuery(searchInput)}
                />
                <FilterButton
                    className="pokedex__filter--pc"
                    onClick={() => setIsFilterOpen(true)}
                />
            </div>
            {isTeamFull && (
                <Notice
                    title="팀이 가득 찼어요"
                    description={`최대 ${maxTeamSize}마리까지 추가할 수 있어요. 내 팀에서 포켓몬을 삭제하면 다시 추가할 수 있어요.`}
                />
            )}
            <div className="pokedex__content">
                <section
                    className="pokedex__catalog"
                    aria-labelledby="pokedex-catalog-title"
                >
                    <div className="pokedex__section-header">
                        <h2
                            id="pokedex-catalog-title"
                            className="pokedex__section-title"
                        >
                            도감
                        </h2>
                        <FilterButton
                            className="pokedex__filter--mobile"
                            onClick={() => setIsFilterOpen(true)}
                        />
                    </div>
                    {isRestoreNoticeOpen && (
                        <StatePanel
                            variant="error"
                            title="저장된 팀을 불러오지 못했어요"
                            description="저장 데이터를 초기화했어요."
                            actionLabel="확인"
                            onAction={onDismissRestoreNotice}
                        />
                    )}
                    {visiblePokemons.length === 0 ? (
                        <StatePanel
                            title="검색 결과가 없어요"
                            description="다른 이름이나 번호로 검색해 보세요."
                        />
                    ) : (
                        <PokemonList
                            pokemons={visiblePokemons}
                            addedPokemonIds={addedPokemonIds}
                            isTeamFull={isTeamFull}
                            onAdd={onAddToTeam}
                            compact
                        />
                    )}
                </section>
                <TeamPanel
                    team={team}
                    onRemoveFromTeam={onRemoveFromTeam}
                    onUpdateTeamMember={onUpdateTeamMember}
                />
            </div>
            {isFilterOpen && (
                <FilterDialog
                    availableTypes={availableTypes}
                    initialFilters={filters}
                    onApply={handleApplyFilters}
                    onCancel={() => setIsFilterOpen(false)}
                />
            )}
        </div>
    );
}

export default PokedexPage;
