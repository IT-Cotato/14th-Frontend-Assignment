import { useState } from 'react'
import type { RefObject } from 'react'
import { getMemberDisplayName } from '../data/team.ts'
import type { TeamMember, TeamMemberChanges } from '../data/team.ts'
import { withParticle } from '../utils/korean.ts'
import ConfirmDialog from './ConfirmDialog.tsx'
import TeamEditDialog from './TeamEditDialog.tsx'

type TeamMemberDialogsOptions = {
  team: TeamMember[]
  onEditMember: (pokemonId: number, changes: TeamMemberChanges) => void
  onRemoveMember: (pokemonId: number) => void
  returnFocusFallback?: RefObject<HTMLElement | null>
}

/**
 * 팀원 편집·삭제 확인 창을 여닫는 공통 로직. 내 팀 화면과 도감의 팀 패널이 함께 쓴다.
 * 여기서는 어떤 팀원의 창이 열려 있는지만 id로 기억하고, 팀원 정보는 부모가 준 team에서 찾는다.
 * 팀 자체는 바꾸지 않고 부모(App)의 콜백만 부른다.
 */
export function useTeamMemberDialogs({
  team,
  onEditMember,
  onRemoveMember,
  returnFocusFallback,
}: TeamMemberDialogsOptions) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const editingIndex = team.findIndex((m) => m.pokemon.id === editingId)
  const editingMember = editingIndex === -1 ? null : team[editingIndex]
  const deletingIndex = team.findIndex((m) => m.pokemon.id === deletingId)
  const deletingMember = deletingIndex === -1 ? null : team[deletingIndex]

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

  function closeDialogs() {
    setEditingId(null)
    setDeletingId(null)
  }

  const dialogs = (
    <>
      {editingMember && (
        <TeamEditDialog
          key={editingMember.pokemon.id}
          member={editingMember}
          slotNumber={editingIndex + 1}
          returnFocusFallback={returnFocusFallback}
          onSave={handleSaveEdit}
          onCancel={() => setEditingId(null)}
        />
      )}

      {deletingMember && (
        <ConfirmDialog
          title={`${withParticle(getMemberDisplayName(deletingMember), '을', '를')} 팀에서 삭제할까요?`}
          description={`팀 슬롯 #${deletingIndex + 1}에서 빠지고, 남은 팀원은 순서를 유지한 채 앞으로 당겨져요. 취소하면 팀이 바뀌지 않아요.`}
          confirmLabel="삭제"
          returnFocusFallback={returnFocusFallback}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </>
  )

  return {
    openEdit: setEditingId,
    openDelete: setDeletingId,
    closeDialogs,
    dialogs,
  }
}
