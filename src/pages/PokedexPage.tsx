import PokedexIntro from "@/components/PokedexIntro";
import PokemonList from "@/components/PokemonList";
import SearchBar from "@/components/SearchBar";
import TeamPanel from "@/components/TeamPanel";
import { pokemons } from "@/data/pokemons";
import type { TeamMember } from "@/types/pokemon";
import { useState } from "react";

export default function PokedexPage({
  team,
  addToTeam,
  removeFromTeam,
}: {
  team: TeamMember[];
  addToTeam: (id: string) => void;
  removeFromTeam: (id: string) => void;
}) {
  const [keyword, setKeyword] = useState("");

  const filteredPokemons = pokemons.filter(
    (p) => p.name.includes(keyword) || p.id.includes(keyword),
  );

  return (
    <div className="flex flex-col gap-6">
      <PokedexIntro teamCount={team.length} />
      <SearchBar keyword={keyword} onChange={setKeyword} />
      <div className="flex gap-6 items-start">
        <PokemonList
          filteredPokemons={filteredPokemons}
          team={team}
          addToTeam={addToTeam}
        />
        <TeamPanel team={team} removeFromTeam={removeFromTeam} />
      </div>
    </div>
  );
}
