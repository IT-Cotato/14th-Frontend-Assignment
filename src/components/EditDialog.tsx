import { useState } from 'react';
import Button from './Button';
import Dialog from './Dialog';
import { TEAM_ROLES } from '../data/team';
import type { TeamMember, TeamRole } from '../types/pokemon';
import './EditDialog.css';

interface EditDialogProps {
  member: TeamMember;
  slotNumber: number;
  onCancel: () => void;
  onSave: (nickname: string, role: TeamRole | undefined) => void;
}

function EditDialog({ member, slotNumber, onCancel, onSave }: EditDialogProps) {
  const [nickname, setNickname] = useState(member.nickname);
  const [role, setRole] = useState(member.role);

  // 별명은 비워도 되지만, 공백만 입력한 경우는 막음
  const isBlankOnly = nickname.length > 0 && nickname.trim().length === 0;

  return (
    <Dialog titleId="edit-dialog-title">
      <h2 id="edit-dialog-title" className="dialog__title">
        {member.pokemon.name} 편집
      </h2>
      <p className="edit-dialog__slot">팀 슬롯 #{slotNumber}</p>

      <label className="edit-dialog__label" htmlFor="edit-dialog-nickname">
        별명 (선택)
      </label>
      <input
        id="edit-dialog-nickname"
        className={`edit-dialog__input${isBlankOnly ? ' edit-dialog__input--invalid' : ''}`}
        type="text"
        value={nickname}
        aria-invalid={isBlankOnly}
        aria-describedby={isBlankOnly ? 'edit-dialog-error' : undefined}
        onChange={(event) => setNickname(event.target.value)}
      />
      {isBlankOnly && (
        <p id="edit-dialog-error" className="edit-dialog__error">
          공백만으로는 별명을 만들 수 없어요.
        </p>
      )}

      <p className="edit-dialog__label edit-dialog__label--role">역할</p>
      <div className="edit-dialog__roles">
        {TEAM_ROLES.map((item) => (
          <button
            key={item}
            type="button"
            className={`edit-dialog__role${item === role ? ' edit-dialog__role--active' : ''}`}
            aria-pressed={item === role}
            onClick={() => setRole(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="dialog__actions">
        <Button variant="secondary" onClick={onCancel}>
          취소
        </Button>
        <Button variant="primary" disabled={isBlankOnly} onClick={() => onSave(nickname.trim(), role)}>
          저장
        </Button>
      </div>
    </Dialog>
  );
}

export default EditDialog;