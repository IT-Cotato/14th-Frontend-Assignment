import TeamSlot from './TeamSlot';
import type { TeamMember } from '../types/pokemon';
import './TeamPanel.css';

interface TeamPanelProps {
  team: readonly TeamMember[];
  onDelete: (teamPokemonId: string) => void;
}

function TeamPanel({ team, onDelete }: TeamPanelProps) {
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
              key={member.teamPokemonId}
              member={member}
              editTo={`/my-team/${member.teamPokemonId}/edit`}
              onDelete={() => onDelete(member.teamPokemonId)}
            />
          ))
        )}
      </div>
    </aside>
  );
}

export default TeamPanel;