import { useState } from "react";
import SiteHeader, { type MenuKey } from "./SiteHeader";
import PokemonHeader from "./PokemonHeader";
import SearchBar from "./SearchBar";
import FilterButton from "./FilterButton";
import FilterDialog from "./FilterDialog";
import PokemonList from "./PokemonList";
import StatePanel from "./StatePanel";
import Notice from "./Notice";
import {
    DEFAULT_FILTERS,
    getAvailableTypes,
    getVisiblePokemons,
    pokemons,
    type Pokemon,
    type PokemonFilters,
} from "../data/pokemons";
import "./HomePage.css";

type HomePageProps = {
    teamCount: number;
    maxTeamSize: number;
    addedPokemonIds: number[];
    isTeamFull: boolean;
    isRestoreNoticeOpen: boolean;
    onNavigate: (menu: MenuKey) => void;
    onAddToTeam: (pokemon: Pokemon) => void;
    onDismissRestoreNotice: () => void;
};

function HomePage({
    teamCount,
    maxTeamSize,
    addedPokemonIds,
    isTeamFull,
    isRestoreNoticeOpen,
    onNavigate,
    onAddToTeam,
    onDismissRestoreNotice,
}: HomePageProps) {
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
            <div className="home__search-row">
                <SearchBar
                    value={searchInput}
                    placeholder="이름 또는 번호"
                    onChange={setSearchInput}
                    onSubmit={() => setSearchQuery(searchInput)}
                />
                <FilterButton onClick={() => setIsFilterOpen(true)} />
            </div>
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
                    />
                )}
            </section>
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

export default HomePage;
