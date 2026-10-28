import type { ReactNode } from "react";
import "./PokemonList.css";

type PokemonListProps = {
    children: ReactNode;
};

function PokemonList({ children }: PokemonListProps) {
    return <ul className="pokemon-list">{children}</ul>;
}

export default PokemonList;
