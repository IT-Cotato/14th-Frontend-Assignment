import PokemonCard from "./PokemonCard";
import { usePokemonDetail } from "../hooks/usePokemonDetail";
import type { PokemonListItem } from "../data/pokeApi";
import type { Pokemon } from "../data/pokemons";

type PokemonCardItemProps = {
    item: PokemonListItem;
    addedPokemonIds: number[];
    isTeamFull: boolean;
    onAdd: (pokemon: Pokemon) => void;
};

function PokemonCardItem({
    item,
    addedPokemonIds,
    isTeamFull,
    onAdd,
}: PokemonCardItemProps) {
    const detail = usePokemonDetail(item.url);

    if (detail.isPending) {
        return <PokemonCard variant="loading" />;
    }

    if (detail.isLoadingError) {
        return (
            <PokemonCard
                variant="error"
                id={item.id}
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
