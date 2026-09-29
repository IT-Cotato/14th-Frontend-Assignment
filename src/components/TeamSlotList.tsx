import TeamSlot from './TeamSlot';
import type { TeamMember } from '../types/pokemon';
import './TeamSlotList.css';

interface TeamSlotListProps {
  title?: string;
  team: readonly TeamMember[];
  size: number;
  editingId?: number | null;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

function TeamSlotList({ title, team, size, editingId = null, onEdit, onDelete }: TeamSlotListProps) {
  const slots = Array.from({ length: size }, (_, index): TeamMember | undefined => team[index]);

  return (
    <section className="team-slot-list">
      {title && <h2 className="team-slot-list__title">{title}</h2>}
      <div className="team-slot-list__grid">
        {slots.map((member, index) =>
          member ? (
            <TeamSlot
              key={member.pokemon.id}
              member={member}
              isEditing={member.pokemon.id === editingId}
              onEdit={() => onEdit(member.pokemon.id)}
              onDelete={() => onDelete(member.pokemon.id)}
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
