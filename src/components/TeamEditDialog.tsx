import { useId, useState } from 'react'
import type { FormEvent, RefObject } from 'react'
import {
  NICKNAME_MAX_LENGTH,
  TEAM_ROLES,
  isTeamRole,
  validateNickname,
} from '../data/team.ts'
import type { TeamMember, TeamMemberChanges, TeamRole } from '../data/team.ts'
import Dialog from './Dialog.tsx'

type TeamEditDialogProps = {
  member: TeamMember
  slotNumber: number
  returnFocusFallback?: RefObject<HTMLElement | null>
  onSave: (changes: TeamMemberChanges) => void
  onCancel: () => void
}

/**
 * 팀원의 별명·역할 편집 창.
 * 입력값(draft)은 이 컴포넌트 안에서만 들고 있다가 저장할 때만 부모에 전달한다.
 * 부모가 열 때마다 새로 그리므로, 취소한 draft는 다음 편집에 남지 않는다.
 */
function TeamEditDialog({
  member,
  slotNumber,
  returnFocusFallback,
  onSave,
  onCancel,
}: TeamEditDialogProps) {
  const [nickname, setNickname] = useState(member.nickname)
  const [role, setRole] = useState<TeamRole>(member.role)

  const titleId = useId()
  const inputId = useId()
  const helpId = useId()
  const errorId = useId()

  const nicknameError = validateNickname(nickname)
  const nicknameLength = Array.from(nickname.trim()).length
  const canSave = nicknameError === null && isTeamRole(role)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // 버튼 비활성화와 별개로 Enter 제출 등에서도 다시 검사한다.
    if (validateNickname(nickname) !== null || !isTeamRole(role)) return
    onSave({ nickname: nickname.trim(), role })
  }

  return (
    <Dialog
      className="dialog--edit"
      titleId={titleId}
      returnFocusFallback={returnFocusFallback}
      onClose={onCancel}
    >
      <form className="dialog__body" noValidate onSubmit={handleSubmit}>
        <div className="dialog__header">
          <h2 id={titleId} className="dialog__title">
            {member.pokemon.name} 편집
          </h2>
          <p className="dialog__meta">팀 슬롯 #{slotNumber}</p>
        </div>

        <div className="field">
          <label className="field__label" htmlFor={inputId}>
            별명 (선택)
          </label>
          <input
            id={inputId}
            className="field__input"
            type="text"
            value={nickname}
            placeholder={member.pokemon.name}
            autoComplete="off"
            aria-invalid={nicknameError !== null}
            aria-describedby={nicknameError ? `${errorId} ${helpId}` : helpId}
            onChange={(event) => setNickname(event.target.value)}
          />
          <div className="field__messages">
            {nicknameError ? (
              <p id={errorId} className="field__error">
                {nicknameError}
              </p>
            ) : (
              <p id={helpId} className="field__help">
                최대 {NICKNAME_MAX_LENGTH}자. 비워 두면 포켓몬 이름으로
                표시돼요.
              </p>
            )}
            <span
              className={`field__counter${nicknameError ? ' field__counter--error' : ''}`}
              aria-hidden="true"
            >
              {nicknameLength} / {NICKNAME_MAX_LENGTH}
            </span>
          </div>
        </div>

        <fieldset className="field">
          <legend className="field__label">역할</legend>
          <div className="role-options">
            {TEAM_ROLES.map((option) => (
              <label key={option.value} className="role-option">
                <input
                  className="role-option__input"
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={role === option.value}
                  onChange={() => setRole(option.value)}
                />
                <span className="role-option__label">{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="dialog__actions">
          <button
            type="button"
            className="button button--secondary button--slot"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            type="submit"
            className="button button--primary button--slot"
            disabled={!canSave}
          >
            저장
          </button>
        </div>
      </form>
    </Dialog>
  )
}

export default TeamEditDialog
