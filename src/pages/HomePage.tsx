import type { NavKey } from "@/components/Navbar";
import PokemonIntro from "@/components/PokemonIntro";
import PokemonList from "@/components/PokemonList";
import SearchBar from "@/components/SearchBar";
import { pokemons } from "@/data/pokemons";
import type { TeamMember } from "@/types/pokemon";
import { useState } from "react";

export default function HomePage({
  team,
  addToTeam,
  onNavigate,
}: {
  team: TeamMember[];
  addToTeam: (id: string) => void;
  onNavigate: (tab: NavKey) => void;
}) {
  const [keyword, setKeyword] = useState("");

  const filteredPokemons = pokemons.filter(
    (p) => p.name.includes(keyword) || p.id.includes(keyword),
  );

  return (
    <div className="flex flex-col gap-6">
      <PokemonIntro onNavigate={onNavigate} />
      <SearchBar keyword={keyword} onChange={setKeyword} />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="text-[22px] font-bold leading-none text-neutral-ink">
            추천 포켓몬
          </span>
          <button
            className="text-caption font-bold leading-none text-text-brand"
            onClick={() => onNavigate("dex")}
          >
            전체 보기
          </button>
        </div>
        <PokemonList
          filteredPokemons={filteredPokemons}
          team={team}
          addToTeam={addToTeam}
        />
      </div>
    </div>
  );
}
