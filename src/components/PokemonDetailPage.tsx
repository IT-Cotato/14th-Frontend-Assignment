import type { ReactNode } from "react";
import { Link, useLocation, useParams } from "react-router";
import PokemonDetailCard from "./PokemonDetailCard";
import StatePanel from "./StatePanel";
import { usePokemonProfile } from "../hooks/usePokemonProfile";
import { isNotFoundError, isValidPokemonQuery } from "../data/pokeApi";
import { formatPokemonNumber, type Pokemon } from "../data/pokemons";
import "./PokemonDetailPage.css";

const POKEDEX_PATH = "/pokemon";

type PokemonDetailPageProps = {
    addedPokemonIds: number[];
    isTeamFull: boolean;
    onAddToTeam: (pokemon: Pokemon) => void;
};

function getRouteLabel(pokemonId: string) {
    return /^\d+$/.test(pokemonId)
        ? formatPokemonNumber(Number(pokemonId))
        : pokemonId;
}

function getListPath(state: unknown) {
    if (
        typeof state === "object" &&
        state !== null &&
        "listPath" in state &&
        typeof state.listPath === "string" &&
        (state.listPath === POKEDEX_PATH ||
            state.listPath.startsWith(`${POKEDEX_PATH}?`))
    ) {
        return state.listPath;
    }
    return POKEDEX_PATH;
}

function PokemonDetailPage({
    addedPokemonIds,
    isTeamFull,
    onAddToTeam,
}: PokemonDetailPageProps) {
    const { pokemonId = "" } = useParams();
    const location = useLocation();
    const profileQuery = usePokemonProfile(pokemonId);

    const listPath = getListPath(location.state);
    const isDataNotFound =
        !isValidPokemonQuery(pokemonId) ||
        (profileQuery.isLoadingError && isNotFoundError(profileQuery.error));
    const currentLabel =
        profileQuery.data !== undefined
            ? formatPokemonNumber(profileQuery.data.pokemon.id)
            : getRouteLabel(pokemonId);

    let content: ReactNode;
    if (isDataNotFound) {
        content = (
            <StatePanel
                variant="notFound"
                title="포켓몬 정보가 없어요"
                description="도감 번호나 이름을 확인해 주세요."
                links={[
                    { label: "도감으로", to: listPath, variant: "primary" },
                ]}
            />
        );
    } else if (profileQuery.isPending) {
        content = (
            <StatePanel
                variant="loading"
                title="포켓몬을 불러오는 중"
                description="잠시만 기다려 주세요."
            />
        );
    } else if (profileQuery.isLoadingError) {
        content = (
            <StatePanel
                variant="error"
                title="연결이 원활하지 않아요"
                description="네트워크를 확인하고 다시 시도해 주세요."
                actionLabel="다시 시도"
                onAction={() => profileQuery.refetch()}
            />
        );
    } else {
        const profile = profileQuery.data;
        content = (
            <PokemonDetailCard
                profile={profile}
                isAdded={addedPokemonIds.includes(profile.pokemon.id)}
                isTeamFull={isTeamFull}
                onAdd={() => onAddToTeam(profile.pokemon)}
            />
        );
    }

    return (
        <>
            <nav className="pokemon-detail__breadcrumb" aria-label="현재 위치">
                <Link className="pokemon-detail__breadcrumb-link" to={listPath}>
                    도감
                </Link>
                <span aria-hidden="true"> / </span>
                <span aria-current="page">{currentLabel}</span>
            </nav>
            {content}
        </>
    );
}

export default PokemonDetailPage;
