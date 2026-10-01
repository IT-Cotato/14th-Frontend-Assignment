import { useState } from 'react'
import { TEAM_ROLES } from '../data/team'
import type { TeamRole } from '../data/team'

const NICKNAME_MAX_LENGTH = 10

interface EditModalProps {
  pokemonName: string
  slotNumber: number
  nickname: string
  role: TeamRole
  onSave: (nickname: string, role: TeamRole) => void
  onCancel: () => void
}

function EditModal({
  pokemonName,
  slotNumber,
  nickname,
  role,
  onSave,
  onCancel,
}: EditModalProps) {

  const [draftNickname, setDraftNickname] = useState(nickname)
  const [draftRole, setDraftRole] = useState<TeamRole>(role)


  const isBlankOnly = draftNickname.length > 0 && draftNickname.trim() === ''

  function handleSave() {
    if (isBlankOnly) return
    onSave(draftNickname.trim(), draftRole)
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="modal-title">{pokemonName} 편집</h3>
        <p className="modal-desc">팀 슬롯 #{slotNumber}</p>

        <label className="field">
          <span className="field-label">별명 (선택)</span>
          <input
            className={`field-input${isBlankOnly ? ' field-input-error' : ''}`}
            value={draftNickname}
            maxLength={NICKNAME_MAX_LENGTH}
            placeholder="예: 번개"
            onChange={(event) => setDraftNickname(event.target.value)}
          />
          {isBlankOnly && (
            <span className="field-error">
              공백만 입력할 수는 없어요. 별명을 쓰거나 비워 두세요.
            </span>
          )}
        </label>

        <div className="field">
          <span className="field-label">역할</span>
          <div className="role-group">
            {TEAM_ROLES.map((item) => (
              <button
                key={item}
                type="button"
                className={`role-pill${draftRole === item ? ' role-pill-active' : ''}`}
                onClick={() => setDraftRole(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary btn-small" onClick={onCancel}>
            취소
          </button>
          <button
            type="button"
            className="btn btn-primary btn-small"
            disabled={isBlankOnly}
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditModal
