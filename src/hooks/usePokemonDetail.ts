import { useQuery } from "@tanstack/react-query";
import { fetchPokemon, isNotFoundError } from "../data/pokeApi";

const MAX_RETRY_COUNT = 3;

export function usePokemonDetail(url: string) {
    return useQuery({
        queryKey: ["pokemon", "detail", url],
        queryFn: ({ signal }) => fetchPokemon(url, signal),
        retry: (failureCount, error) =>
            !isNotFoundError(error) && failureCount < MAX_RETRY_COUNT,
    });
}
