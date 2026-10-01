import { useRef, useState } from 'react'
import { TEAM_LIMIT, getMemberDisplayName } from '../data/team.ts'
import type { TeamMember, TeamMemberChanges } from '../data/team.ts'
import { withParticle } from '../utils/korean.ts'
import ConfirmDialog from './ConfirmDialog.tsx'
import TeamEditDialog from './TeamEditDialog.tsx'
import TeamSlot, { EmptyTeamSlot } from './TeamSlot.tsx'

const teamTitle = '나의 팀'
const teamDescription = `최대 ${TEAM_LIMIT}마리의 포켓몬으로 나만의 팀을 완성하세요.`

type PokemonTeamProps = {
  team: TeamMember[]
  onEditMember: (pokemonId: number, changes: TeamMemberChanges) => void
  onRemoveMember: (pokemonId: number) => void
  onSaveTeam: () => void
  onRevertTeam: () => void
  onGoToDex: () => void
}

function PokemonTeam({
  team,
  onEditMember,
  onRemoveMember,
  onSaveTeam,
  onRevertTeam,
  onGoToDex,
}: PokemonTeamProps) {
  // 어떤 팀원의 편집·삭제 창이 열려 있는지만 id로 기억한다. 팀원 정보는 team에서 찾는다.
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const editingIndex = team.findIndex((m) => m.pokemon.id === editingId)
  const editingMember = editingIndex === -1 ? null : team[editingIndex]
  const deletingIndex = team.findIndex((m) => m.pokemon.id === deletingId)
  const deletingMember = deletingIndex === -1 ? null : team[deletingIndex]

  // 항상 6칸: 앞에서부터 추가한 순서대로 채우고 나머지는 빈 슬롯(null)이다.
  const slots = Array.from({ length: TEAM_LIMIT }, (_, index) => team[index] ?? null)

  function handleSaveEdit(changes: TeamMemberChanges) {
    if (editingId === null) return
    onEditMember(editingId, changes)
    setEditingId(null)
  }

  function handleConfirmDelete() {
    if (deletingId === null) return
    onRemoveMember(deletingId)
    setDeletingId(null)
  }

  function handleRevertTeam() {
    // 팀 전체 취소: 마지막 저장 상태로 되돌리고 열린 편집·삭제 창과 임시 입력도 정리한다.
    setEditingId(null)
    setDeletingId(null)
    onRevertTeam()
  }

  return (
    <main className="team">
      <div className="team-intro">
        <div className="team-intro__text">
          <h1 ref={titleRef} className="team-intro__title" tabIndex={-1}>
            {teamTitle}
          </h1>
          <p className="team-intro__description">{teamDescription}</p>
        </div>
        <span
          className="team-intro__badge"
          aria-label={`팀 인원 ${team.length}명, 최대 ${TEAM_LIMIT}명`}
        >
          {team.length} / {TEAM_LIMIT}
        </span>
        <div className="team-intro__actions">
          <button
            type="button"
            className="button button--primary"
            onClick={onSaveTeam}
          >
            팀 저장
          </button>
          <button
            type="button"
            className="button button--secondary team-intro__cancel"
            aria-label="팀 변경 취소 (마지막 저장 상태로 되돌리기)"
            onClick={handleRevertTeam}
          >
            취소
          </button>
        </div>
      </div>

      {team.length === 0 && (
        <div className="team-empty-note">
          <p>
            아직 팀에 포켓몬이 없어요. 도감에서 ‘팀에 추가’를 눌러 최대{' '}
            {TEAM_LIMIT}마리까지 채워 보세요.
          </p>
          <button
            type="button"
            className="button button--secondary button--slot"
            onClick={onGoToDex}
          >
            도감으로 이동
          </button>
        </div>
      )}

      <ol className="team-slots" aria-label={`팀 슬롯 ${TEAM_LIMIT}칸`}>
        {slots.map((member, index) =>
          member ? (
            <li key={member.pokemon.id}>
              <TeamSlot
                member={member}
                onEdit={() => setEditingId(member.pokemon.id)}
                onDelete={() => setDeletingId(member.pokemon.id)}
              />
            </li>
          ) : (
            // 빈 슬롯은 포켓몬 id(숫자)와 겹치지 않도록 문자열 key를 쓴다.
            <li key={`empty-slot-${index}`}>
              <EmptyTeamSlot />
            </li>
          ),
        )}
      </ol>

      {editingMember && (
        <TeamEditDialog
          key={editingMember.pokemon.id}
          member={editingMember}
          slotNumber={editingIndex + 1}
          returnFocusFallback={titleRef}
          onSave={handleSaveEdit}
          onCancel={() => setEditingId(null)}
        />
      )}

      {deletingMember && (
        <ConfirmDialog
          title={`${withParticle(getMemberDisplayName(deletingMember), '을', '를')} 팀에서 삭제할까요?`}
          description={`팀 슬롯 #${deletingIndex + 1}에서 빠지고, 남은 팀원은 순서를 유지한 채 앞으로 당겨져요. 취소하면 팀이 바뀌지 않아요.`}
          confirmLabel="삭제"
          returnFocusFallback={titleRef}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </main>
  )
}

export default PokemonTeam
