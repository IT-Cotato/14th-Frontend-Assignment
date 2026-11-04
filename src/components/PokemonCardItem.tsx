import PokemonCard from "./PokemonCard";
import { usePokemonDetail } from "../hooks/usePokemonDetail";
import { getPokemonIdFromUrl } from "../data/pokeApi";
import type { Pokemon } from "../data/pokemons";

type PokemonCardItemProps = {
    url: string;
    addedPokemonIds: number[];
    isTeamFull: boolean;
    onAdd: (pokemon: Pokemon) => void;
};

function PokemonCardItem({
    url,
    addedPokemonIds,
    isTeamFull,
    onAdd,
}: PokemonCardItemProps) {
    const detail = usePokemonDetail(url);

    if (detail.isPending) {
        return <PokemonCard variant="loading" />;
    }

    if (detail.isLoadingError) {
        return (
            <PokemonCard
                variant="error"
                id={getPokemonIdFromUrl(url)}
                onRetry={() => detail.refetch()}
            />
        );
    }

    const pokemon = detail.data;

    return (
        <PokemonCard
            id={pokemon.id}
            name={pokemon.name}
            types={pokemon.types}
            imageUrl={pokemon.imageUrl}
            isAdded={addedPokemonIds.includes(pokemon.id)}
            isTeamFull={isTeamFull}
            onAdd={() => onAdd(pokemon)}
        />
    );
}

export default PokemonCardItem;
