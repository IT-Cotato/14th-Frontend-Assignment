import type { Pokemon } from '../components/PokemonCard.tsx'
import type { Notice } from '../components/Toast.tsx'
import { withParticle } from '../utils/korean.ts'
import { TEAM_LIMIT, addTeamMember, getAddStatus } from './team.ts'
import type { TeamMember } from './team.ts'

/**
 * 작업 중인 팀과 화면 아래 안내를 함께 둔다.
 * 팀 추가는 "추가됐는지"와 "어떤 안내를 보일지"를 같은 최신 상태에서 한 번에 정해야 하므로 묶었다.
 */
export interface TeamState {
  team: TeamMember[]
  notice: Notice | null
}

export type TeamAction =
  /** 추가 여부와 안내를 최신 팀 기준으로 함께 정한다. noticeId는 이벤트 핸들러가 미리 정해 넘긴다. */
  | { type: 'add'; pokemon: Pokemon; noticeId: number }
  /** 삭제·편집·되돌리기. 팀만 바꾸는 순수 함수를 넘긴다. */
  | { type: 'updateTeam'; update: (team: TeamMember[]) => TeamMember[] }
  | { type: 'notify'; notice: Notice }
  /** 안내 표시 시간이 끝났을 때. 그사이 새 안내로 바뀌었으면 그대로 둔다. */
  | { type: 'dismissNotice'; noticeId: number }

/**
 * 순수 함수: 받은 상태를 바꾸지 않고 새 상태를 돌려준다. 안내 표시·타이머·저장은 여기서 하지 않는다.
 * StrictMode에서 두 번 실행돼도 같은 결과가 나온다.
 */
export function teamReducer(state: TeamState, action: TeamAction): TeamState {
  switch (action.type) {
    case 'add': {
      const { pokemon, noticeId } = action
      const status = getAddStatus(state.team, pokemon.id)
      if (status === 'added') {
        return {
          ...state,
          notice: {
            id: noticeId,
            tone: 'warning',
            message: `${withParticle(pokemon.name, '은', '는')} 이미 팀에 있어요. 같은 포켓몬은 한 번만 추가할 수 있어요.`,
          },
        }
      }
      if (status === 'full') {
        return {
          ...state,
          notice: {
            id: noticeId,
            tone: 'warning',
            message: `팀이 가득 찼어요. 최대 ${TEAM_LIMIT}마리까지 추가할 수 있어요.`,
          },
        }
      }
      const team = addTeamMember(state.team, pokemon)
      return {
        team,
        notice: {
          id: noticeId,
          tone: 'success',
          message: `${withParticle(pokemon.name, '을', '를')} 팀 슬롯 #${team.length}에 추가했어요. (${team.length} / ${TEAM_LIMIT})`,
        },
      }
    }
    case 'updateTeam': {
      const team = action.update(state.team)
      return team === state.team ? state : { ...state, team }
    }
    case 'notify':
      return { ...state, notice: action.notice }
    case 'dismissNotice':
      return state.notice?.id === action.noticeId ? { ...state, notice: null } : state
  }
}
