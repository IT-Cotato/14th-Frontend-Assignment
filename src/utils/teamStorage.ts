import type { Pokemon } from '../components/PokemonCard.tsx'
import { TEAM_LIMIT, isTeamRole, validateNickname } from '../data/team.ts'
import type { TeamMember } from '../data/team.ts'

export const TEAM_STORAGE_KEY = 'pokemate:duwlsl:team:v1'

const STORAGE_VERSION = 1

/**
 * 저장 형식. 이미지 주소나 포켓몬 원본 전체는 넣지 않고 복원에 필요한 값만 둔다.
 * { version: 1, members: [{ pokemonId, nickname, role }] }
 */
interface StoredTeam {
  version: typeof STORAGE_VERSION
  members: { pokemonId: number; nickname: string; role: string }[]
}

/** 저장 데이터를 읽지 못한 이유. 저장 데이터가 아예 없는 첫 실행은 문제가 아니므로 null이다. */
export type TeamLoadIssue = 'corrupted' | 'unavailable'

export interface TeamLoadResult {
  team: TeamMember[]
  issue: TeamLoadIssue | null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * JSON.parse 결과(unknown)를 검사해 팀으로 바꾼다. 하나라도 어긋나면 null을 돌려준다.
 * 일부만 살리지 않는 이유: 어느 팀원이 빠졌는지 모르는 팀을 "저장된 팀"처럼 보여 주지 않기 위해서다.
 */
function parseStoredTeam(value: unknown, catalog: Pokemon[]): TeamMember[] | null {
  if (!isRecord(value) || value.version !== STORAGE_VERSION) return null
  if (!Array.isArray(value.members) || value.members.length > TEAM_LIMIT) {
    return null
  }

  const team: TeamMember[] = []
  for (const item of value.members as unknown[]) {
    if (!isRecord(item)) return null
    const { pokemonId, nickname, role } = item
    if (typeof pokemonId !== 'number' || !Number.isInteger(pokemonId)) return null
    if (typeof nickname !== 'string' || validateNickname(nickname) !== null) {
      return null
    }
    if (typeof role !== 'string' || !isTeamRole(role)) return null
    if (team.some((member) => member.pokemon.id === pokemonId)) return null

    // 저장된 값이 아니라 지금의 로컬 카탈로그에서 원본 포켓몬을 다시 찾는다.
    const pokemon = catalog.find((candidate) => candidate.id === pokemonId)
    if (!pokemon) return null
    team.push({ pokemon, nickname: nickname.trim(), role })
  }
  return team
}

/**
 * 마지막으로 "팀 저장"한 팀을 읽는다. 읽기만 하고 저장소를 지우거나 고치지 않으므로
 * StrictMode에서 두 번 불려도 결과가 같다.
 */
export function loadTeam(catalog: Pokemon[]): TeamLoadResult {
  let raw: string | null
  try {
    raw = window.localStorage.getItem(TEAM_STORAGE_KEY)
  } catch {
    return { team: [], issue: 'unavailable' }
  }
  if (raw === null) return { team: [], issue: null }

  try {
    const team = parseStoredTeam(JSON.parse(raw), catalog)
    return team ? { team, issue: null } : { team: [], issue: 'corrupted' }
  } catch {
    return { team: [], issue: 'corrupted' }
  }
}

/** 저장에 성공하면 true. 용량 초과·접근 차단 등으로 실패하면 false를 돌려준다. */
export function saveTeam(team: TeamMember[]) {
  const stored: StoredTeam = {
    version: STORAGE_VERSION,
    members: team.map((member) => ({
      pokemonId: member.pokemon.id,
      nickname: member.nickname,
      role: member.role,
    })),
  }
  try {
    window.localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(stored))
    return true
  } catch {
    return false
  }
}
