import { pokemons } from "../data/pokemons";
import PokemonCard from "./PokemonCard";

export default function PokemonList() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <span className="text-[22px] font-bold leading-none text-neutral-ink">
          추천 포켓몬
        </span>
        <button className="text-caption font-bold leading-none text-text-brand">
          전체 보기
        </button>
      </div>
      <div className="flex gap-5">
        {pokemons.map((pokemon) => (
          <PokemonCard
            id={pokemon.id}
            name={pokemon.name}
            image={pokemon.image}
            type={pokemon.type}
          />
        ))}
      </div>
    </div>
  );
}
