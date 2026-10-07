import { useEffect, useState } from "react";
import {
  TEAM_ROLES,
  type TeamMember,
  type TeamMemberChanges,
  type TeamRole,
} from "./teamTypes";

const NICKNAME_MAX_LENGTH = 10;

type EditDialogProps = {
  member: TeamMember;
  slotNumber: number;
  onSave: (changes: TeamMemberChanges) => void;
  onClose: () => void;
};

function EditDialog({ member, slotNumber, onSave, onClose }: EditDialogProps) {
  const [nickname, setNickname] = useState(member.nickname);
  const [role, setRole] = useState<TeamRole>(member.role);

  // 공백만 입력한 경우 (아무것도 안 쓴 것은 "별명 없음"이라 허용)
  const isBlankOnly = nickname.length > 0 && nickname.trim() === "";

  const handleSave = () => {
    if (isBlankOnly) return;

    onSave({ nickname: nickname.trim(), role });
  };

  // Esc 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="edit-title" className="dialog__title">
          {member.name} 편집
        </h3>
        <p className="dialog__desc">
          팀 슬롯 {String(slotNumber).padStart(2, "#")}
        </p>

        <label className="field">
          <span className="field__label">별명 (선택)</span>
          <input
            className={`field__input${isBlankOnly ? " field__input--error" : ""}`}
            value={nickname}
            maxLength={NICKNAME_MAX_LENGTH}
            placeholder="예: 번개"
            aria-invalid={isBlankOnly}
            aria-describedby={isBlankOnly ? "nickname-error" : undefined}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
            autoFocus
          />
          {isBlankOnly && (
            <span id="nickname-error" className="field__error" role="alert">
              공백만 입력할 수 없어요. 별명을 입력하거나 비워 주세요.
            </span>
          )}
        </label>

        <div className="field">
          <span className="field__label">역할</span>
          <div className="role-group">
            {TEAM_ROLES.map((item) => (
              <button
                key={item}
                type="button"
                className={`role-pill${role === item ? " role-pill--active" : ""}`}
                aria-pressed={role === item}
                onClick={() => setRole(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="dialog__actions">
          <button
            type="button"
            className="team-btn team-btn--secondary"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            className="team-btn team-btn--primary"
            onClick={handleSave}
            disabled={isBlankOnly}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditDialog;