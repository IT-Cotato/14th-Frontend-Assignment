import { useState } from "react";
import PokemonHeader from "./PokemonHeader";
import TeamSlot from "./TeamSlot";
import ConfirmDialog from "./ConfirmDialog";
import {
  MAX_TEAM_SIZE,
  type TeamMember,
} from "./teamTypes";

type MyTeamPageProps = {
  team: TeamMember[];
  onRemove: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
  hasUnsavedChanges: boolean;
};

function MyTeamPage({
  team,
  onRemove,
  onSave,
  onCancel,
  hasUnsavedChanges,
}: MyTeamPageProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const slots = Array.from({ length: MAX_TEAM_SIZE }, (_, i) => team[i] ?? null);

  const deletingMember = team.find((member) => member.teamPokemonId === deletingId) ?? null;

  const handleDeleteConfirm = () => {
    if (deletingId === null) return;

    onRemove(deletingId);
    setDeletingId(null);
  };

  return (
    <>
      <PokemonHeader
        activePage="team"
        teamCount={team.length}
      />

      <section className="team-page">
        <div className="team-title">
          <div className="team-title__text">
            <h2>나의 팀</h2>
            <p>최대 6마리의 포켓몬으로 나만의 팀을 완성하세요.</p>
          </div>

          <span className="team-pill">
            <span className="team-pill__label">
              {team.length} / {MAX_TEAM_SIZE}
            </span>
          </span>

          <div className="team-title__actions">
            <button
              type="button"
              className="team-btn team-btn--primary"
              onClick={onSave}
              disabled={!hasUnsavedChanges}
            >
              팀 저장
            </button>
            <button
              type="button"
              className="team-btn team-btn--secondary"
              onClick={onCancel}
              disabled={!hasUnsavedChanges}
            >
              취소
            </button>
          </div>
        </div>

        <div className="team-grid">
          {slots.map((member, i) => (
            <TeamSlot
              key={member ? member.teamPokemonId : `empty-${i}`}
              member={member}
              onDelete={setDeletingId}
            />
          ))}
        </div>
      </section>

      {deletingMember && (
        <ConfirmDialog
          title="팀에서 삭제할까요?"
          description={`${deletingMember.nickname || deletingMember.name}을(를) 팀에서 삭제합니다.`}
          confirmLabel="삭제"
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingId(null)}
        />
      )}
    </>
  );
}

export default MyTeamPage;
