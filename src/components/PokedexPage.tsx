import { useState, type ReactNode } from "react";
import { useSearchParams } from "react-router";
import SearchBar from "./SearchBar";
import PokemonList from "./PokemonList";
import PokemonCardItem from "./PokemonCardItem";
import PokemonSearchResult from "./PokemonSearchResult";
import StatePanel from "./StatePanel";
import Pagination from "./Pagination";
import { usePokemonList } from "../hooks/usePokemonList";
import { isValidPokemonQuery, POKEMON_LIST_LIMIT } from "../data/pokeApi";
import type { Pokemon } from "../data/pokemons";
import "./PokedexPage.css";

type PokedexPageProps = {
    addedPokemonIds: number[];
    isTeamFull: boolean;
    isRestoreNoticeOpen: boolean;
    onAddToTeam: (pokemon: Pokemon) => void;
    onDismissRestoreNotice: () => void;
};

function parsePage(value: string | null) {
    if (value === null || !/^\d+$/.test(value)) {
        return 1;
    }
    const page = Number(value);
    return page >= 1 ? page : 1;
}

function getPagePath(page: number) {
    const params = new URLSearchParams();
    if (page > 1) {
        params.set("page", String(page));
    }
    const search = params.toString();
    return search === "" ? "/pokemon" : `/pokemon?${search}`;
}

function getPageFromOffset(offset: number | null) {
    return offset === null ? null : offset / POKEMON_LIST_LIMIT + 1;
}

function PokedexPage({
    addedPokemonIds,
    isTeamFull,
    isRestoreNoticeOpen,
    onAddToTeam,
    onDismissRestoreNotice,
}: PokedexPageProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = (searchParams.get("q") ?? "").trim().toLowerCase();
    const currentPage = parsePage(searchParams.get("page"));

    const [searchInput, setSearchInput] = useState(searchQuery);
    const [previousSearchQuery, setPreviousSearchQuery] = useState(searchQuery);
    if (searchQuery !== previousSearchQuery) {
        setPreviousSearchQuery(searchQuery);
        setSearchInput(searchQuery);
    }

    const pokemonList = usePokemonList({
        limit: POKEMON_LIST_LIMIT,
        offset: (currentPage - 1) * POKEMON_LIST_LIMIT,
    });
    const isBackgroundFetching =
        pokemonList.isFetching && !pokemonList.isPending;
    const isRefreshFailed =
        pokemonList.isRefetchError && !pokemonList.isFetching;

    let pillLabel = "최신 목록";
    if (isBackgroundFetching) {
        pillLabel = "갱신 중";
    } else if (isRefreshFailed) {
        pillLabel = "갱신 실패";
    }

    function handleSearch() {
        const nextQuery = searchInput.trim().toLowerCase();
        if (nextQuery === searchQuery) {
            return;
        }
        setSearchParams(nextQuery === "" ? {} : { q: nextQuery });
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
    } else if (pokemonList.isPending) {
        content = (
            <StatePanel
                variant="loading"
                title="포켓몬을 불러오는 중"
                description="잠시만 기다려 주세요."
            />
        );
    } else if (pokemonList.isLoadingError) {
        content = (
            <StatePanel
                variant="error"
                title="연결이 원활하지 않아요"
                description="네트워크를 확인하고 다시 시도해 주세요."
                actionLabel="다시 시도"
                onAction={() => pokemonList.refetch()}
            />
        );
    } else if (pokemonList.data.items.length === 0) {
        content = (
            <StatePanel
                title="이 페이지에는 포켓몬이 없어요"
                description="첫 페이지에서 다시 찾아보세요."
                links={[
                    {
                        label: "첫 페이지로",
                        to: "/pokemon",
                        variant: "primary",
                    },
                ]}
            />
        );
    } else {
        const listPage = pokemonList.data;
        content = (
            <>
                {isRefreshFailed && (
                    <StatePanel
                        variant="error"
                        title="목록을 새로 불러오지 못했어요"
                        description="이전에 불러온 목록을 보여주고 있어요."
                        actionLabel="다시 시도"
                        onAction={() => pokemonList.refetch()}
                    />
                )}
                <PokemonList>
                    {listPage.items.map((item) => (
                        <li key={item.name}>
                            <PokemonCardItem
                                item={item}
                                addedPokemonIds={addedPokemonIds}
                                isTeamFull={isTeamFull}
                                onAdd={onAddToTeam}
                            />
                        </li>
                    ))}
                </PokemonList>
                <Pagination
                    currentPage={listPage.currentPage}
                    totalPages={listPage.totalPages}
                    previousPage={getPageFromOffset(listPage.previousOffset)}
                    nextPage={getPageFromOffset(listPage.nextOffset)}
                    getPagePath={getPagePath}
                />
            </>
        );
    }

    return (
        <>
            <div className="pokedex__title-row">
                <div className="pokedex__title-copy">
                    <h1 className="pokedex__title">포켓몬 도감</h1>
                    <p className="pokedex__description">
                        페이지를 이동해도 이전 포켓몬을 빠르게 다시 볼 수
                        있어요.
                    </p>
                </div>
                <div className="pokedex__controls">
                    <span
                        className={`pokedex__pill${
                            isRefreshFailed ? " pokedex__pill--error" : ""
                        }`}
                        role="status"
                    >
                        {pillLabel}
                    </span>
                </div>
            </div>
            <SearchBar
                value={searchInput}
                placeholder="이름 또는 번호 검색"
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
        </>
    );
}

export default PokedexPage;
