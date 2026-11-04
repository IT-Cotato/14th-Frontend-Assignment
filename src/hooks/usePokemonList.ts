import { useQuery } from "@tanstack/react-query";
import { fetchPokemonList } from "../data/pokeApi";

type PokemonListParams = {
    limit: number;
    offset: number;
};

export function usePokemonList({ limit, offset }: PokemonListParams) {
    return useQuery({
        queryKey: ["pokemon", "list", { limit, offset }],
        queryFn: ({ signal }) => fetchPokemonList(limit, offset, signal),
    });
}
