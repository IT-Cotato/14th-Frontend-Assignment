import { useEffect, useState } from "react";
import { fetchPokemonList, type PokemonListItem } from "../data/pokeApi";

type PokemonListState =
    | { status: "loading" }
    | { status: "success"; items: PokemonListItem[] }
    | { status: "error" };

export function usePokemonList() {
    const [state, setState] = useState<PokemonListState>({
        status: "loading",
    });
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        fetchPokemonList(controller.signal)
            .then((items) => setState({ status: "success", items }))
            .catch(() => {
                if (!controller.signal.aborted) {
                    setState({ status: "error" });
                }
            });

        return () => controller.abort();
    }, [retryCount]);

    function retry() {
        setState({ status: "loading" });
        setRetryCount((count) => count + 1);
    }

    return { state, retry };
}
