import { useEffect, useState } from "react";
import { fetchPokemon, isNotFoundError } from "../data/pokeApi";
import type { Pokemon } from "../data/pokemons";

type PokemonDetailState =
    | { status: "loading" }
    | { status: "success"; pokemon: Pokemon }
    | { status: "not-found" }
    | { status: "error" };

export function usePokemonDetail(url: string) {
    const [state, setState] = useState<PokemonDetailState>({
        status: "loading",
    });
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        fetchPokemon(url, controller.signal)
            .then((pokemon) => setState({ status: "success", pokemon }))
            .catch((error: unknown) => {
                if (controller.signal.aborted) {
                    return;
                }
                setState(
                    isNotFoundError(error)
                        ? { status: "not-found" }
                        : { status: "error" },
                );
            });

        return () => controller.abort();
    }, [url, retryCount]);

    function retry() {
        setState({ status: "loading" });
        setRetryCount((count) => count + 1);
    }

    return { state, retry };
}
