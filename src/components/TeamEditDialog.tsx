import { useState } from 'react';


interface TeamEditDialogProps {
  name: string;
  role: string;
  onClose: () => void;
}

function TeamEditDialog({
  name,
  role,
  onClose,
}: TeamEditDialogProps) {
  return (
    <>
    <div className="dialog-overlay">
      <div className="team-edit-dialog">
        <h2>팀 포켓몬 편집</h2>

        <p className="dialog-subtitle">
          팀에서 사용할 포켓몬 정보를 수정하세요.
        </p>

        <div className="dialog-field">
          <label>별명 (선택)</label>
          <input
            type="text"
            defaultValue={name}
          />
        </div>

        <div className="dialog-field">
          <label>역할</label>

          <div className="role-options">
            <button className={role === "공격" ? "selected" : ""}>
              공격
            </button>

            <button className={role === "방어" ? "selected" : ""}>
              방어
            </button>

            <button className={role === "서포트" ? "selected" : ""}>
              서포트
            </button>
          </div>
        </div>

        <div className="dialog-actions">
          <button className="cancel-button"
           onClick={onClose}>
            취소
          </button>

          <button className="save-button">
            저장
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

export default TeamEditDialog;