import PokemonCard from "@/components/PokemonCard";
import type { Pokemon, TeamMember } from "@/types/pokemon";

export default function PokemonList({
  filteredPokemons,
  team,
  addToTeam,
}: {
  filteredPokemons: Pokemon[];
  team: TeamMember[];
  addToTeam: (id: string) => void;
}) {
  const isEmpty = filteredPokemons.length === 0;

  return isEmpty ? (
    <div className="w-[760px] flex flex-col gap-2.5 items-center px-6 py-7 bg-white border border-neutral-line rounded-lg">
      <span className="flex w-11 h-11 items-center justify-center rounded-full bg-brand-yellow text-neutral-ink text-[18px] font-extrabold leading-normal">
        0
      </span>
      <p className="text-neutral-ink text-body font-bold leading-normal">
        검색 결과가 없어요
      </p>
      <p className="text-neutral-muted text-caption leading-normal">
        다른 이름이나 번호로 검색해 보세요.
      </p>
    </div>
  ) : (
    <div className="flex gap-5">
      {filteredPokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          id={pokemon.id}
          name={pokemon.name}
          image={pokemon.image}
          type={pokemon.type}
          isAdded={team.some((m) => m.id === pokemon.id)}
          handleOnClick={addToTeam}
        />
      ))}
    </div>
  );
}
