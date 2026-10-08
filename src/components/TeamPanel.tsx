import { useId, useRef } from 'react'
import { TEAM_LIMIT } from '../data/team.ts'
import type { TeamMember, TeamMemberChanges } from '../data/team.ts'
import TeamSlot from './TeamSlot.tsx'
import { useTeamMemberDialogs } from './useTeamMemberDialogs.tsx'

type TeamPanelProps = {
  team: TeamMember[]
  onEditMember: (pokemonId: number, changes: TeamMemberChanges) => void
  onRemoveMember: (pokemonId: number) => void
}

/**
 * 도감 화면 옆(모바일은 아래)에 두는 팀 패널.
 * 자체 팀 state 없이 App의 team과 콜백을 그대로 쓰므로 내 팀 화면·헤더와 항상 같은 팀을 보여 준다.
 * 시안대로 팀원 목록만 그리고, "팀 저장"은 내 팀 화면에서 한다.
 */
function TeamPanel({ team, onEditMember, onRemoveMember }: TeamPanelProps) {
  const titleId = useId()
  const titleRef = useRef<HTMLHeadingElement>(null)
  const { openEdit, openDelete, dialogs } = useTeamMemberDialogs({
    team,
    onEditMember,
    onRemoveMember,
    returnFocusFallback: titleRef,
  })

  return (
    <aside className="team-panel" aria-labelledby={titleId}>
      <h2
        id={titleId}
        ref={titleRef}
        className="team-panel__title"
        tabIndex={-1}
      >
        나의 팀
      </h2>

      {team.length === 0 ? (
        <p className="team-panel__empty">
          아직 팀에 포켓몬이 없어요. 도감 카드의 ‘팀에 추가’를 눌러 최대{' '}
          {TEAM_LIMIT}마리까지 채워 보세요.
        </p>
      ) : (
        <ol className="team-panel__list" aria-label="팀원 목록">
          {team.map((member) => (
            <li key={member.pokemon.id}>
              <TeamSlot
                member={member}
                onEdit={() => openEdit(member.pokemon.id)}
                onDelete={() => openDelete(member.pokemon.id)}
              />
            </li>
          ))}
        </ol>
      )}

      {dialogs}
    </aside>
  )
}

export default TeamPanel
