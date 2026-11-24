import TeamSlot, { type TeamSlotStatus } from './TeamSlot';
import type { TeamMember } from '../types/pokemon';
import './TeamSlotList.css';

interface TeamSlotListProps {
  title?: string;
  team: readonly TeamMember[];
  size: number;
  slotStatus?: Readonly<Record<string, TeamSlotStatus>>;
  onDelete: (teamPokemonId: string) => void;
  onRetry?: (teamPokemonId: string) => void;
}

function TeamSlotList({ title, team, size, slotStatus = {}, onDelete, onRetry }: TeamSlotListProps) {
  const slots = Array.from({ length: size }, (_, index): TeamMember | undefined => team[index]);

  return (
    <section className="team-slot-list">
      {title && <h2 className="team-slot-list__title">{title}</h2>}
      <div className="team-slot-list__grid">
        {slots.map((member, index) =>
          member ? (
            <TeamSlot
              key={member.teamPokemonId}
              member={member}
              editTo={`/my-team/${member.teamPokemonId}/edit`}
              status={slotStatus[member.teamPokemonId]}
              onDelete={() => onDelete(member.teamPokemonId)}
              onRetry={() => onRetry?.(member.teamPokemonId)}
            />
          ) : (
            <TeamSlot key={`empty-${index}`} />
          ),
        )}
      </div>
    </section>
  );
}

export default TeamSlotList;