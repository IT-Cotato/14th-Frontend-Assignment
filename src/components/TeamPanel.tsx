import { useState } from "react";
import TeamSlot from "./TeamSlot";
import ConfirmDialog from "./ConfirmDialog";
import EditDialog from "./EditDialog";
import {
    getDisplayName,
    type TeamMember,
    type TeamMemberChanges,
} from "../data/team";
import "./TeamPanel.css";

type TeamPanelProps = {
    team: TeamMember[];
    onRemoveFromTeam: (pokemonId: number) => void;
    onUpdateTeamMember: (pokemonId: number, changes: TeamMemberChanges) => void;
};

function TeamPanel({
    team,
    onRemoveFromTeam,
    onUpdateTeamMember,
}: TeamPanelProps) {
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
    const [editTargetId, setEditTargetId] = useState<number | null>(null);

    const deleteTarget =
        team.find((member) => member.pokemon.id === deleteTargetId) ?? null;
    const editTargetIndex = team.findIndex(
        (member) => member.pokemon.id === editTargetId,
    );
    const editTarget = editTargetIndex !== -1 ? team[editTargetIndex] : null;

    function handleConfirmDelete() {
        if (deleteTargetId !== null) {
            onRemoveFromTeam(deleteTargetId);
        }
        setDeleteTargetId(null);
    }

    function handleSaveEdit(changes: TeamMemberChanges) {
        if (editTargetId !== null) {
            onUpdateTeamMember(editTargetId, changes);
        }
        setEditTargetId(null);
    }

    return (
        <section className="team-panel" aria-labelledby="team-panel-title">
            <h2 id="team-panel-title" className="team-panel__title">
                나의 팀
            </h2>
            <ul className="team-panel__list">
                {team.length === 0 ? (
                    <li>
                        <TeamSlot member={null} compact />
                    </li>
                ) : (
                    team.map((member) => (
                        <li key={member.pokemon.id}>
                            <TeamSlot
                                member={member}
                                onEdit={() =>
                                    setEditTargetId(member.pokemon.id)
                                }
                                onDelete={() =>
                                    setDeleteTargetId(member.pokemon.id)
                                }
                                compact
                            />
                        </li>
                    ))
                )}
            </ul>
            {editTarget !== null && (
                <EditDialog
                    member={editTarget}
                    slotNumber={editTargetIndex + 1}
                    onSave={handleSaveEdit}
                    onCancel={() => setEditTargetId(null)}
                />
            )}
            {deleteTarget !== null && (
                <ConfirmDialog
                    title="팀에서 삭제할까요?"
                    description={`${getDisplayName(deleteTarget)} 슬롯을 비워요. 취소하면 팀이 그대로 유지돼요.`}
                    confirmLabel="삭제"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setDeleteTargetId(null)}
                />
            )}
        </section>
    );
}

export default TeamPanel;
