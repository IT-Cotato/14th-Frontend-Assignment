import PokemonCard from "./PokemonCard";
import { usePokemonDetail } from "../hooks/usePokemonDetail";
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

    if (detail.status !== "success") {
        return null;
    }

    const { pokemon } = detail;

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
