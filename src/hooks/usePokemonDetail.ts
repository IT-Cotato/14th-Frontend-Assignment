import { useEffect, useState } from "react";
import { fetchPokemon } from "../data/pokeApi";
import type { Pokemon } from "../data/pokemons";

type PokemonDetailState =
    | { status: "loading" }
    | { status: "success"; pokemon: Pokemon }
    | { status: "error" };

export function usePokemonDetail(url: string) {
    const [state, setState] = useState<PokemonDetailState>({
        status: "loading",
    });

    useEffect(() => {
        const controller = new AbortController();

        fetchPokemon(url, controller.signal)
            .then((pokemon) => setState({ status: "success", pokemon }))
            .catch(() => {
                if (!controller.signal.aborted) {
                    setState({ status: "error" });
                }
            });

        return () => controller.abort();
    }, [url]);

    return state;
}
