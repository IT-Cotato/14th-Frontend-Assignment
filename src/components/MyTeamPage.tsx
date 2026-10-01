import { useState } from "react";
import SiteHeader, { type MenuKey } from "./SiteHeader";
import TeamSlot from "./TeamSlot";
import ConfirmDialog from "./ConfirmDialog";
import { getDisplayName, type TeamMember } from "../data/team";
import "./MyTeamPage.css";

type MyTeamPageProps = {
    team: TeamMember[];
    maxTeamSize: number;
    onNavigate: (menu: MenuKey) => void;
    onRemoveFromTeam: (pokemonId: number) => void;
};

function MyTeamPage({
    team,
    maxTeamSize,
    onNavigate,
    onRemoveFromTeam,
}: MyTeamPageProps) {
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

    const emptySlotCount = maxTeamSize - team.length;
    const deleteTarget =
        team.find((member) => member.pokemon.id === deleteTargetId) ?? null;

    function handleConfirmDelete() {
        if (deleteTargetId !== null) {
            onRemoveFromTeam(deleteTargetId);
        }
        setDeleteTargetId(null);
    }

    function handleCancelDelete() {
        setDeleteTargetId(null);
    }

    return (
        <div className="page">
            <SiteHeader
                activeMenu="team"
                teamCount={team.length}
                maxTeamSize={maxTeamSize}
                onNavigate={onNavigate}
            />
            <div className="my-team__title-row">
                <div className="my-team__title-copy">
                    <h1 className="my-team__title">나의 팀</h1>
                    <p className="my-team__description">
                        최대 6마리의 포켓몬으로 나만의 팀을 완성하세요.
                    </p>
                </div>
                <div className="my-team__controls">
                    <span className="my-team__pill">
                        {team.length} / {maxTeamSize}
                    </span>
                    <div className="my-team__actions">
                        <button
                            type="button"
                            className="my-team__button my-team__button--primary"
                        >
                            팀 저장
                        </button>
                        <button
                            type="button"
                            className="my-team__button my-team__button--secondary my-team__button--cancel"
                        >
                            취소
                        </button>
                    </div>
                </div>
            </div>
            <ul className="my-team__grid">
                {team.map((member) => (
                    <li key={member.pokemon.id}>
                        <TeamSlot
                            member={member}
                            onDelete={() =>
                                setDeleteTargetId(member.pokemon.id)
                            }
                        />
                    </li>
                ))}
                {Array.from({ length: emptySlotCount }, (_, index) => (
                    <li key={`empty-${index}`}>
                        <TeamSlot member={null} />
                    </li>
                ))}
            </ul>
            {deleteTarget !== null && (
                <ConfirmDialog
                    title="팀에서 삭제할까요?"
                    description={`${getDisplayName(deleteTarget)} 슬롯을 비워요. 취소하면 팀이 그대로 유지돼요.`}
                    confirmLabel="삭제"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </div>
    );
}

export default MyTeamPage;
