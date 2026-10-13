import TeamSlot from './TeamSlot';
import type { TeamMember } from '../types/pokemon';
import './TeamPanel.css';

interface TeamPanelProps {
  team: readonly TeamMember[];
  editingId?: number | null;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

// 도감 화면 오른쪽 나의 팀 패널.
function TeamPanel({ team, editingId = null, onEdit, onDelete }: TeamPanelProps) {
  return (
    <aside className="team-panel" aria-labelledby="team-panel-title">
      <h2 id="team-panel-title" className="team-panel__title">
        나의 팀
      </h2>
      <div className="team-panel__list">
        {team.length === 0 ? (
          <TeamSlot />
        ) : (
          team.map((member) => (
            <TeamSlot
              key={member.pokemon.id}
              member={member}
              isEditing={member.pokemon.id === editingId}
              onEdit={() => onEdit(member.pokemon.id)}
              onDelete={() => onDelete(member.pokemon.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}

export default TeamPanel;