import { useState } from "react";
import PokemonHeader from "./PokemonHeader";
import TeamSlot from "./TeamSlot";
import EditDialog from "./EditDialog";
import ConfirmDialog from "./ConfirmDialog";
import {
  MAX_TEAM_SIZE,
  type ActivePage,
  type TeamMember,
  type TeamMemberChanges,
} from "./teamTypes";

type MyTeamPageProps = {
  team: TeamMember[];
  onNavigate: (page: ActivePage) => void;
  onRemove: (id: number) => void;
  onUpdate: (id: number, changes: TeamMemberChanges) => void;
  onSave: () => void;
  onCancel: () => void;
  hasUnsavedChanges: boolean;
};

function MyTeamPage({
  team,
  onNavigate,
  onRemove,
  onUpdate,
  onSave,
  onCancel,
  hasUnsavedChanges,
}: MyTeamPageProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const slots = Array.from({ length: MAX_TEAM_SIZE }, (_, i) => team[i] ?? null);

  const editingIndex = team.findIndex((member) => member.id === editingId);
  const editingMember = editingIndex >= 0 ? team[editingIndex] : null;
  const deletingMember = team.find((member) => member.id === deletingId) ?? null;

  const handleEditSave = (changes: TeamMemberChanges) => {
    if (editingId === null) return;

    onUpdate(editingId, changes);
    setEditingId(null);
  };

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
        onNavigate={onNavigate}
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
              key={member ? member.id : `empty-${i}`}
              member={member}
              isEditing={member !== null && member.id === editingId}
              onEdit={setEditingId}
              onDelete={setDeletingId}
            />
          ))}
        </div>
      </section>

      {editingMember && (
        <EditDialog
          key={editingMember.id}
          member={editingMember}
          slotNumber={editingIndex + 1}
          onSave={handleEditSave}
          onClose={() => setEditingId(null)}
        />
      )}

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