import { pokemons } from "@/data/pokemons";
import PokemonCard from "@/components/PokemonCard";

export default function PokemonList() {
  return (
    <div className="flex gap-5">
      {pokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          id={pokemon.id}
          name={pokemon.name}
          image={pokemon.image}
          type={pokemon.type}
        />
      ))}
    </div>
  );
}
