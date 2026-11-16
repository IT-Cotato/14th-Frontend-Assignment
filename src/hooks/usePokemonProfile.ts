import { useQuery } from "@tanstack/react-query";
import { fetchPokemonProfile, shouldRetryRequest } from "../data/pokeApi";

export function usePokemonProfile(pokemonId: string) {
    return useQuery({
        queryKey: ["pokemon", "profile", pokemonId],
        queryFn: ({ signal }) => fetchPokemonProfile(pokemonId, signal),
        retry: shouldRetryRequest,
    });
}
