import EmptyState from "./components/EmptyState";
import { pokemons } from "./data/pokemons";
import PokemonCard from "./PokemonCard";

export default function PokemonList() {
    return (
        <>
            {pokemons.length === 0 ? (
                <EmptyState />
            ) : (
                <ul className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-5">
                    {pokemons.map((value) => (
                        <li key={value.id}>
                            <PokemonCard
                                imageSrc={value.imageSrc}
                                number={value.id}
                                name={value.name}
                                type={value.type}
                            ></PokemonCard>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}
