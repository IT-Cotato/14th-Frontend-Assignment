import type { Pokemon } from '../types/pokemon'

export const TEAM_STORAGE_KEY = 'pokemate.team.v1'

export function restoreTeam(raw: string | null, catalog: Pokemon[], fallback: Pokemon[]): Pokemon[] {
  if (raw === null) return fallback
  try {
    const data: unknown = JSON.parse(raw)
    if (!Array.isArray(data)) return fallback
    const restored: Pokemon[] = []
    for (const item of data) {
      if (!item || typeof item !== 'object') continue
      // API에서 추가한 포켓몬도 로컬 예시 목록에 없다는 이유로 제거하지 않습니다.
      const savedPokemon: Pokemon | undefined = Number.isInteger(item.number) && item.number > 0
        && typeof item.name === 'string' && item.name.length > 0
        && Array.isArray(item.types) && item.types.every((type: unknown) => typeof type === 'string')
        && typeof item.imageSrc === 'string'
        ? { number: item.number, name: item.name, types: [...item.types], imageSrc: item.imageSrc }
        : undefined
      const original = savedPokemon ?? catalog.find((pokemon) => pokemon.number === item.number)
      if (!original || restored.some((pokemon) => pokemon.number === original.number)) continue
      restored.push({
        ...original,
        englishName: typeof item.englishName === 'string' ? item.englishName : undefined,
        nickname: typeof item.nickname === 'string' ? item.nickname.trim().slice(0, 30) : '',
        role: typeof item.role === 'string' ? item.role.trim().slice(0, 50) : original.role,
      })
      if (restored.length === 6) break
    }
    return restored
  } catch {
    return fallback
  }
}

export function updateTeamMember(team: Pokemon[], number: number, nickname: string, role: string) {
  return team.map((pokemon) => pokemon.number === number
    ? { ...pokemon, nickname: nickname.trim(), role: role.trim() }
    : pokemon)
}
