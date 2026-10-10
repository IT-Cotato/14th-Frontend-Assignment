import { pokemons } from "@/data/pokemons";
import type { TeamMember } from "@/types/pokemon";
import TeamSlotFilled from "./TeamSlotFilled";

export default function TeamPanel({
  team,
  removeFromTeam,
}: {
  team: TeamMember[];
  removeFromTeam: (id: string) => void;
}) {
  return (
    <div className="flex flex-col p-5 gap-3 rounded-xl border border-neutral-line bg-white w-[366px]">
      <span className="text-neutral-ink text-[18px] font-bold leading-normal">
        나의 팀
      </span>

      {team.map((member) => {
        const pokemon = pokemons.find((p) => p.id === member.id);
        return (
          pokemon && (
            <TeamSlotFilled
              size="sm"
              key={member.id}
              id={pokemon.id}
              image={pokemon.image}
              name={pokemon.name}
              type={pokemon.type}
              role={pokemon.role}
              removeFromTeam={removeFromTeam}
            />
          )
        );
      })}
    </div>
  );
}
