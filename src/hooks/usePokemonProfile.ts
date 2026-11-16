import { useQuery } from "@tanstack/react-query";
import {
    fetchPokemonProfile,
    isValidPokemonQuery,
    shouldRetryRequest,
} from "../data/pokeApi";

export function usePokemonProfile(pokemonId: string) {
    return useQuery({
        queryKey: ["pokemon", "profile", pokemonId],
        queryFn: ({ signal }) => fetchPokemonProfile(pokemonId, signal),
        retry: shouldRetryRequest,
        enabled: isValidPokemonQuery(pokemonId),
    });
}
