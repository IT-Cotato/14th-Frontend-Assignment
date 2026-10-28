import PokemonList from "./PokemonList";
import PokemonCard from "./PokemonCard";
import StatePanel from "./StatePanel";
import { usePokemonDetail } from "../hooks/usePokemonDetail";
import { getPokemonUrl } from "../data/pokeApi";
import type { Pokemon } from "../data/pokemons";

type PokemonSearchResultProps = {
    query: string;
    addedPokemonIds: number[];
    isTeamFull: boolean;
    onAdd: (pokemon: Pokemon) => void;
};

function PokemonSearchResult({
    query,
    addedPokemonIds,
    isTeamFull,
    onAdd,
}: PokemonSearchResultProps) {
    const { state: result, retry } = usePokemonDetail(getPokemonUrl(query));

    if (result.status === "loading") {
        return (
            <StatePanel
                variant="loading"
                title="포켓몬을 불러오는 중"
                description="잠시만 기다려 주세요."
            />
        );
    }

    if (result.status === "not-found") {
        return (
            <StatePanel
                title="검색 결과가 없어요"
                description="다른 이름이나 번호로 검색해 보세요."
            />
        );
    }

    if (result.status === "error") {
        return (
            <StatePanel
                variant="error"
                title="연결이 원활하지 않아요"
                description="네트워크를 확인하고 다시 시도해 주세요."
                actionLabel="다시 시도"
                onAction={retry}
            />
        );
    }

    const { pokemon } = result;

    return (
        <PokemonList>
            <li>
                <PokemonCard
                    id={pokemon.id}
                    name={pokemon.name}
                    types={pokemon.types}
                    imageUrl={pokemon.imageUrl}
                    isAdded={addedPokemonIds.includes(pokemon.id)}
                    isTeamFull={isTeamFull}
                    onAdd={() => onAdd(pokemon)}
                />
            </li>
        </PokemonList>
    );
}

export default PokemonSearchResult;
