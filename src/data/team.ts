import type { Pokemon } from '../components/PokemonCard.tsx'

/** 팀에 담을 수 있는 최대 포켓몬 수 */
export const TEAM_LIMIT = 6

/** 별명 길이 제한. 시안에 명시되지 않아 이번 실습의 구현 기준으로 정한 값이다. */
export const NICKNAME_MAX_LENGTH = 20

export type TeamRole = 'attack' | 'defense' | 'support'

export const TEAM_ROLES: { value: TeamRole; label: string }[] = [
  { value: 'attack', label: '공격' },
  { value: 'defense', label: '방어' },
  { value: 'support', label: '서포트' },
]

const DEFAULT_ROLE: TeamRole = 'attack'

/** 팀원은 원본 도감 데이터(pokemon)를 그대로 두고 별명·역할만 따로 가진다. */
export interface TeamMember {
  pokemon: Pokemon
  nickname: string
  role: TeamRole
}

export type TeamMemberChanges = Pick<TeamMember, 'nickname' | 'role'>

/** 도감 카드의 추가 버튼 상태. 이미 추가됨을 정원 초과보다 먼저 판단한다. */
export type AddStatus = 'added' | 'full' | 'available'

export function getAddStatus(team: TeamMember[], pokemonId: number): AddStatus {
  if (team.some((member) => member.pokemon.id === pokemonId)) return 'added'
  if (team.length >= TEAM_LIMIT) return 'full'
  return 'available'
}

export function isTeamRole(value: string): value is TeamRole {
  return TEAM_ROLES.some((role) => role.value === value)
}

export function getRoleLabel(role: TeamRole) {
  return TEAM_ROLES.find((option) => option.value === role)?.label ?? role
}

/** 별명이 있으면 "별명(이름)", 없으면 포켓몬 이름을 쓴다. */
export function getMemberDisplayName(member: TeamMember) {
  return member.nickname
    ? `${member.nickname}(${member.pokemon.name})`
    : member.pokemon.name
}

/** 저장 전 별명 검사. 문제가 없으면 null, 있으면 수정 방법을 담은 문구를 돌려준다. */
export function validateNickname(nickname: string) {
  const length = Array.from(nickname.trim()).length
  if (length > NICKNAME_MAX_LENGTH) {
    return `별명은 ${NICKNAME_MAX_LENGTH}자 이하로 입력해 주세요. 지금 ${length}자라서 ${length - NICKNAME_MAX_LENGTH}자를 지워야 해요.`
  }
  return null
}

export function isSameTeam(a: TeamMember[], b: TeamMember[]) {
  return (
    a.length === b.length &&
    a.every(
      (member, index) =>
        member.pokemon.id === b[index].pokemon.id &&
        member.nickname === b[index].nickname &&
        member.role === b[index].role,
    )
  )
}

/*
 * 아래 함수들은 setTeam(prev => ...) 안에서 쓰는 순수 함수다.
 * 이전 배열을 바꾸지 않고, 바뀔 것이 없으면 이전 배열을 그대로 돌려준다.
 */

export function addTeamMember(prevTeam: TeamMember[], pokemon: Pokemon) {
  if (getAddStatus(prevTeam, pokemon.id) !== 'available') return prevTeam
  return [...prevTeam, { pokemon, nickname: '', role: DEFAULT_ROLE }]
}

export function removeTeamMember(prevTeam: TeamMember[], pokemonId: number) {
  return prevTeam.filter((member) => member.pokemon.id !== pokemonId)
}

export function updateTeamMember(
  prevTeam: TeamMember[],
  pokemonId: number,
  changes: TeamMemberChanges,
) {
  return prevTeam.map((member) =>
    member.pokemon.id === pokemonId
      ? { ...member, nickname: changes.nickname, role: changes.role }
      : member,
  )
}
