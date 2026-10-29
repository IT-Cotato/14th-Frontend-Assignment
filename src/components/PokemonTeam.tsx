import { useRef } from 'react'
import { TEAM_LIMIT } from '../data/team.ts'
import type { TeamMember, TeamMemberChanges } from '../data/team.ts'
import TeamSlot, { EmptyTeamSlot } from './TeamSlot.tsx'
import { useTeamMemberDialogs } from './useTeamMemberDialogs.tsx'

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
  const titleRef = useRef<HTMLHeadingElement>(null)
  // 편집·삭제 창은 도감의 팀 패널과 같은 로직을 쓴다.
  const { openEdit, openDelete, closeDialogs, dialogs } = useTeamMemberDialogs({
    team,
    onEditMember,
    onRemoveMember,
    returnFocusFallback: titleRef,
  })

  // 항상 6칸: 앞에서부터 추가한 순서대로 채우고 나머지는 빈 슬롯(null)이다.
  const slots = Array.from({ length: TEAM_LIMIT }, (_, index) => team[index] ?? null)

  function handleRevertTeam() {
    // 팀 전체 취소: 마지막 저장 상태로 되돌리고 열린 편집·삭제 창과 임시 입력도 정리한다.
    closeDialogs()
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
                onEdit={() => openEdit(member.pokemon.id)}
                onDelete={() => openDelete(member.pokemon.id)}
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

      {dialogs}
    </main>
  )
}

export default PokemonTeam
