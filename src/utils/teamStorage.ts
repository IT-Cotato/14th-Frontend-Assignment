import { isPokemonType } from '../api/pokeapi.ts'
import type { Pokemon, PokemonType } from '../components/PokemonCard.tsx'
import { TEAM_LIMIT, isTeamRole, validateNickname } from '../data/team.ts'
import type { TeamMember } from '../data/team.ts'

/** W04까지 쓰던 저장 키. 읽기만 하고 쓰거나 지우지 않는다. */
export const LEGACY_TEAM_STORAGE_KEY = 'pokemate:duwlsl:team:v1'
/** W05부터 ‘팀 저장’이 쓰는 키 */
export const TEAM_STORAGE_KEY = 'pokemate:duwlsl:team:v2'

const LEGACY_STORAGE_VERSION = 1
const STORAGE_VERSION = 2

/** 포켓몬은 타입을 두 개까지 가진다. */
const MAX_TYPES = 2

/**
 * v2 저장 형식. PokéAPI 응답 전체가 아니라 카드·팀에 쓰는 Pokemon 필드와 사용자 편집 값만 둔다.
 * 포켓몬 정보를 함께 저장하므로 로컬 카탈로그나 API 응답 없이도 복원된다. 배열 순서가 팀 순서다.
 * { version: 2, members: [{ pokemon: { id, name, types, imageUrl? }, nickname, role }] }
 */
interface StoredTeam {
  version: typeof STORAGE_VERSION
  members: TeamMember[]
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

/** 저장된 팀원 공통 값(별명·역할) 검사. 문제가 있으면 null */
function parseMemberEdits(item: Record<string, unknown>) {
  const { nickname, role } = item
  if (typeof nickname !== 'string' || validateNickname(nickname) !== null) return null
  if (typeof role !== 'string' || !isTeamRole(role)) return null
  return { nickname: nickname.trim(), role }
}

/**
 * v1: JSON.parse 결과(unknown)를 검사해 팀으로 바꾼다. 하나라도 어긋나면 null을 돌려준다.
 * 일부만 살리지 않는 이유: 어느 팀원이 빠졌는지 모르는 팀을 "저장된 팀"처럼 보여 주지 않기 위해서다.
 */
function parseLegacyTeam(value: unknown, catalog: Pokemon[]): TeamMember[] | null {
  if (!isRecord(value) || value.version !== LEGACY_STORAGE_VERSION) return null
  if (!Array.isArray(value.members) || value.members.length > TEAM_LIMIT) {
    return null
  }

  const team: TeamMember[] = []
  for (const item of value.members as unknown[]) {
    if (!isRecord(item)) return null
    const { pokemonId } = item
    if (typeof pokemonId !== 'number' || !Number.isInteger(pokemonId)) return null
    const edits = parseMemberEdits(item)
    if (!edits) return null
    if (team.some((member) => member.pokemon.id === pokemonId)) return null

    // v1에는 포켓몬 정보가 없으므로 지금의 로컬 카탈로그에서 원본 포켓몬을 다시 찾는다.
    const pokemon = catalog.find((candidate) => candidate.id === pokemonId)
    if (!pokemon) return null
    team.push({ pokemon, ...edits })
  }
  return team
}

/** v2에 저장된 Pokemon 검사. 이미지 주소는 형식만 보고, 실제로 불러와지는지는 화면에서 다룬다. */
function parseStoredPokemon(value: unknown): Pokemon | null {
  if (!isRecord(value)) return null
  const { id, name, types, imageUrl } = value
  if (typeof id !== 'number' || !Number.isInteger(id) || id <= 0) return null
  if (typeof name !== 'string' || name.trim() === '') return null
  if (!Array.isArray(types) || types.length > MAX_TYPES) return null

  const parsedTypes: PokemonType[] = []
  for (const type of types as unknown[]) {
    if (typeof type !== 'string' || !isPokemonType(type)) return null
    if (parsedTypes.includes(type)) return null
    parsedTypes.push(type)
  }

  if (imageUrl === undefined) return { id, name, types: parsedTypes }
  if (typeof imageUrl !== 'string' || imageUrl === '') return null
  return { id, name, types: parsedTypes, imageUrl }
}

/** v2: 저장된 포켓몬 정보로 바로 복원한다. 카탈로그·API에 그 포켓몬이 있는지는 보지 않는다. */
function parseStoredTeam(value: unknown): TeamMember[] | null {
  if (!isRecord(value) || value.version !== STORAGE_VERSION) return null
  if (!Array.isArray(value.members) || value.members.length > TEAM_LIMIT) {
    return null
  }

  const team: TeamMember[] = []
  for (const item of value.members as unknown[]) {
    if (!isRecord(item)) return null
    const pokemon = parseStoredPokemon(item.pokemon)
    if (!pokemon) return null
    const edits = parseMemberEdits(item)
    if (!edits) return null
    if (team.some((member) => member.pokemon.id === pokemon.id)) return null
    team.push({ pokemon, ...edits })
  }
  return team
}

function parseJson<T>(raw: string, parse: (value: unknown) => T | null): T | null {
  try {
    return parse(JSON.parse(raw))
  } catch {
    return null
  }
}

/**
 * 마지막으로 "팀 저장"한 팀을 읽는다. 읽기만 하고 저장소를 지우거나 고치지 않으므로
 * StrictMode에서 두 번 불려도 결과가 같다.
 * - v2가 있으면 v2만 쓴다. 빈 팀도 정상 저장값이며, 손상돼도 오래된 v1으로 되돌아가지 않는다.
 * - v2가 없으면 v1을 로컬 카탈로그로 복원한다. (v1 원본은 그대로 남는다)
 * - 둘 다 없으면 첫 실행이다.
 */
export function loadTeam(catalog: Pokemon[]): TeamLoadResult {
  let raw: string | null
  let legacyRaw: string | null
  try {
    raw = window.localStorage.getItem(TEAM_STORAGE_KEY)
    legacyRaw = raw === null ? window.localStorage.getItem(LEGACY_TEAM_STORAGE_KEY) : null
  } catch {
    return { team: [], issue: 'unavailable' }
  }

  if (raw !== null) {
    const team = parseJson(raw, parseStoredTeam)
    return team ? { team, issue: null } : { team: [], issue: 'corrupted' }
  }
  if (legacyRaw !== null) {
    const team = parseJson(legacyRaw, (value) => parseLegacyTeam(value, catalog))
    return team ? { team, issue: null } : { team: [], issue: 'corrupted' }
  }
  return { team: [], issue: null }
}

/**
 * v2로 저장한다. 성공하면 true, 용량 초과·접근 차단 등으로 실패하면 false를 돌려준다.
 * v1 키는 건드리지 않는다.
 */
export function saveTeam(team: TeamMember[]) {
  const stored: StoredTeam = {
    version: STORAGE_VERSION,
    members: team.map(({ pokemon, nickname, role }) => ({
      // 화면용 Pokemon 필드만 골라 담는다. imageUrl이 없으면 JSON에서 빠진다.
      pokemon: {
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types,
        imageUrl: pokemon.imageUrl,
      },
      nickname,
      role,
    })),
  }
  try {
    window.localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(stored))
    return true
  } catch {
    return false
  }
}
