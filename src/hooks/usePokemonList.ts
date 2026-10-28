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
    }, []);

    return state;
}
