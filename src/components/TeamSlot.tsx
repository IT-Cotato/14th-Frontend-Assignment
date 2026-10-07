import { useState } from "react";
import type { TeamMember } from "./teamTypes";

type TeamSlotProps = {
  member: TeamMember | null;
  isEditing: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

function TeamSlot({ member, isEditing, onEdit, onDelete }: TeamSlotProps) {
  const [imageFailed, setImageFailed] = useState(false);

  // 빈 슬롯
  if (!member) {
    return (
      <div className="team-slot team-slot--empty">
        <div className="team-slot__info">
          <strong className="team-slot__name">빈 슬롯</strong>
          <span className="team-slot__role">포켓몬을 추가해 보세요</span>
        </div>

        <div className="team-slot__handle" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  // 채운 슬롯
  return (
    <div className={`team-slot${isEditing ? " team-slot--editing" : ""}`}>
      <div className="team-slot__artwork">
        {!imageFailed && (
          <img
            src={member.image}
            alt={member.name}
            onError={() => setImageFailed(true)}
          />
        )}
      </div>

      <div className="team-slot__info">
        <strong className="team-slot__name">
          {member.nickname || member.name}
        </strong>
        <span className="team-slot__role">
          {member.type} · {member.role}
        </span>
      </div>

      <div className="team-slot__actions">
        <button
          type="button"
          className="team-btn team-btn--secondary"
          onClick={() => onEdit(member.id)}
        >
          편집
        </button>
        <button
          type="button"
          className="team-btn team-btn--danger"
          onClick={() => onDelete(member.id)}
        >
          삭제
        </button>
      </div>
    </div>
  );
}

export default TeamSlot;