import { useQuery } from "@tanstack/react-query";
import { fetchPokemon, shouldRetryRequest } from "../data/pokeApi";

export function usePokemonDetail(url: string) {
    return useQuery({
        queryKey: ["pokemon", "detail", url],
        queryFn: ({ signal }) => fetchPokemon(url, signal),
        retry: shouldRetryRequest,
    });
}
