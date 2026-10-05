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
      const original = catalog.find((pokemon) => pokemon.number === item.number)
      if (!original || restored.some((pokemon) => pokemon.number === original.number)) continue
      restored.push({
        ...original,
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
