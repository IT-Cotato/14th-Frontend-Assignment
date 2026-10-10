import { pokemons } from "@/data/pokemons";
import { MAX_TEAM_SIZE, type TeamMember } from "@/types/pokemon";
import TeamSlotEmpty from "./TeamSlotEmpty";
import TeamSlotFilled from "./TeamSlotFilled";

export default function TeamList({
  team,
  removeFromTeam,
}: {
  team: TeamMember[];
  removeFromTeam: (id: string) => void;
}) {
  const emptyCount = MAX_TEAM_SIZE - team.length;

  return (
    <div className="grid grid-cols-2 gap-5">
      {team.map((member) => {
        const pokemon = pokemons.find((p) => p.id === member.id);
        return (
          pokemon && (
            <TeamSlotFilled
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
      {[...Array(emptyCount)].map((_, i) => (
        <TeamSlotEmpty key={`empty-${i}`} />
      ))}
    </div>
  );
}
