import PokemonCard from "./PokemonCard";
import type { Pokemon } from "../data/pokemons";
import "./PokemonList.css";

type PokemonListProps = {
    pokemons: Pokemon[];
    addedPokemonIds: number[];
    isTeamFull: boolean;
    onAdd: (pokemon: Pokemon) => void;
    compact?: boolean;
};

function PokemonList({
    pokemons,
    addedPokemonIds,
    isTeamFull,
    onAdd,
    compact = false,
}: PokemonListProps) {
    return (
        <ul
            className={`pokemon-list${compact ? " pokemon-list--compact" : ""}`}
        >
            {pokemons.map((pokemon) => (
                <li key={pokemon.id}>
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
            ))}
        </ul>
    );
}

export default PokemonList;
