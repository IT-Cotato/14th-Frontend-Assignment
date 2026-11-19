import { startTransition, useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router'
import {
  MEMO_MAX_LENGTH,
  NICKNAME_MAX_LENGTH,
  TEAM_ROLES,
  isTeamRole,
  updateTeamMember,
  validateNickname,
} from '../data/team.ts'
import type { TeamMember, TeamMemberChanges, TeamRole } from '../data/team.ts'
import { saveTeam } from '../utils/teamStorage.ts'
import StatePanel from './StatePanel.tsx'
import TeamSlot from './TeamSlot.tsx'
import { useTeamMemberDialogs } from './useTeamMemberDialogs.tsx'

type TeamEditPageProps = {
  team: TeamMember[]
  /** 저장에 성공한 팀. App이 작업 중인 팀과 마지막 저장 팀을 이 값으로 맞춘다. */
  onSaved: (team: TeamMember[], member: TeamMember) => void
  onRemoveMember: (pokemonId: number) => void
}

/** /my-team/:teamPokemonId/edit. 주소의 팀 항목 ID로 팀원을 찾고, 없으면 팀으로 돌아가는 안내를 보여 준다. */
function TeamEditPage({ team, onSaved, onRemoveMember }: TeamEditPageProps) {
  const { teamPokemonId } = useParams()
  const index = team.findIndex((member) => member.id === teamPokemonId)

  if (index === -1) {
    return (
      <main className="team-edit">
        <StatePanel
          variant="error"
          title="팀 항목을 찾을 수 없어요"
          description="삭제됐거나 저장되지 않은 팀 항목이에요. 내 팀에서 다시 골라 주세요."
        >
          <Link to="/my-team" className="button button--primary button--card state-panel__action">
            내 팀으로
          </Link>
        </StatePanel>
      </main>
    )
  }

  // 다른 팀원으로 바뀌면 입력값을 새로 시작한다.
  return (
    <TeamEditForm
      key={team[index].id}
      team={team}
      member={team[index]}
      onSaved={onSaved}
      onRemoveMember={onRemoveMember}
    />
  )
}

type TeamEditFormProps = Omit<TeamEditPageProps, 'team'> & {
  team: TeamMember[]
  member: TeamMember
}

/**
 * 별명·역할·메모 편집. 입력값은 저장할 때까지 이 화면에만 있다.
 * 저장은 팀 전체를 localStorage에 쓰는 작업이라 useMutation으로 진행 중·실패 상태를 다룬다.
 */
function TeamEditForm({ team, member, onSaved, onRemoveMember }: TeamEditFormProps) {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState(member.nickname)
  const [role, setRole] = useState<TeamRole>(member.role)
  const [memo, setMemo] = useState(member.memo)
  // 저장 버튼을 빠르게 두 번 눌러도 저장은 한 번만 시작한다. (상태가 다시 그려지기 전 중복 제출 방지)
  const savingRef = useRef(false)
  // 삭제 확인 창은 내 팀 화면과 같은 로직을 쓴다. 확인하면 이 팀 항목만 삭제하고 내 팀으로 돌아간다.
  const { openDelete, dialogs } = useTeamMemberDialogs({
    team,
    onRemoveMember: (pokemonId) => {
      // 삭제와 이동을 함께 반영해, 지운 항목의 ‘찾을 수 없음’ 안내가 잠깐이라도 보이지 않게 한다.
      startTransition(() => {
        onRemoveMember(pokemonId)
        navigate('/my-team')
      })
    },
  })

  const titleId = useId()
  const nicknameId = useId()
  const nicknameHelpId = useId()
  const nicknameErrorId = useId()
  const memoId = useId()
  const memoErrorId = useId()

  const mutation = useMutation({
    mutationFn: async (changes: TeamMemberChanges) => {
      const nextTeam = updateTeamMember(team, member.pokemon.id, changes)
      if (!saveTeam(nextTeam)) throw new Error('팀을 저장하지 못했어요.')
      return nextTeam
    },
    onSuccess: (nextTeam) => {
      onSaved(nextTeam, member)
      navigate('/my-team')
    },
    onSettled: () => {
      savingRef.current = false
    },
  })

  const nicknameError = validateNickname(nickname)
  const nicknameLength = Array.from(nickname.trim()).length
  const memoLength = Array.from(memo.trim()).length
  const memoError =
    memoLength > MEMO_MAX_LENGTH ? `메모는 ${MEMO_MAX_LENGTH}자 이하로 입력해 주세요.` : null
  const changes: TeamMemberChanges = { nickname: nickname.trim(), role, memo: memo.trim() }
  const isUnchanged =
    changes.nickname === member.nickname && changes.role === member.role && changes.memo === member.memo
  const canSave =
    nicknameError === null && memoError === null && isTeamRole(role) && !isUnchanged && !mutation.isPending

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSave || savingRef.current) return
    savingRef.current = true
    mutation.mutate(changes)
  }

  const editPath = `/my-team/${member.id}/edit`
  let saveLabel = '저장'
  if (mutation.isPending) saveLabel = '저장 중'
  else if (mutation.isError) saveLabel = '다시 시도'

  return (
    <main className="team-edit">
      <div className="team-edit__slot">
        <TeamSlot
          member={member}
          editTo={editPath}
          onDelete={() => openDelete(member.pokemon.id)}
        />
      </div>

      <form className="team-edit__card" noValidate aria-labelledby={titleId} onSubmit={handleSubmit}>
        <div className="dialog__header">
          <h1 id={titleId} className="dialog__title">
            {member.pokemon.name} 편집
          </h1>
          <p className="dialog__meta">{editPath} · 고유 팀 항목</p>
        </div>

        <div className="field">
          <label className="field__label" htmlFor={nicknameId}>
            별명 (선택)
          </label>
          <input
            id={nicknameId}
            className="field__input"
            type="text"
            value={nickname}
            placeholder={member.pokemon.name}
            autoComplete="off"
            aria-invalid={nicknameError !== null}
            aria-describedby={nicknameError ? `${nicknameErrorId} ${nicknameHelpId}` : nicknameHelpId}
            onChange={(event) => setNickname(event.target.value)}
          />
          <div className="field__messages">
            {nicknameError ? (
              <p id={nicknameErrorId} className="field__error">
                {nicknameError}
              </p>
            ) : (
              <p id={nicknameHelpId} className="field__help">
                최대 {NICKNAME_MAX_LENGTH}자. 비워 두면 포켓몬 이름으로 표시돼요.
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

        <div className="field">
          <label className="field__label" htmlFor={memoId}>
            메모
          </label>
          <input
            id={memoId}
            className="field__input"
            type="text"
            value={memo}
            autoComplete="off"
            aria-invalid={memoError !== null}
            aria-describedby={memoError ? memoErrorId : undefined}
            onChange={(event) => setMemo(event.target.value)}
          />
          {memoError && (
            <div className="field__messages">
              <p id={memoErrorId} className="field__error">
                {memoError}
              </p>
            </div>
          )}
        </div>

        {mutation.isError && (
          <p className="field__error team-edit__error" role="alert">
            팀을 저장하지 못했어요. 입력한 내용은 그대로 있으니 다시 시도해 주세요.
          </p>
        )}

        <div className="dialog__actions">
          <Link to="/my-team" className="button button--secondary button--slot">
            취소
          </Link>
          <button
            type="submit"
            className="button button--primary button--slot"
            disabled={!canSave}
            aria-busy={mutation.isPending}
          >
            {saveLabel}
          </button>
        </div>
      </form>

      {dialogs}
    </main>
  )
}

export default TeamEditPage
