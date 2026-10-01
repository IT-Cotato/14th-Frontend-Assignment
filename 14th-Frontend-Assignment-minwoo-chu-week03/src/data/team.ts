//everything related to the "my team" feature lives here, separate from the plain pokemon catalog data in pokemons.ts.

export const MAX_TEAM_SIZE = 6

export const TEAM_ROLES = ['공격', '방어', '서포트'] as const
export type TeamRole = (typeof TEAM_ROLES)[number]

export interface TeamMember {
  pokemonId: number
  nickname: string
  role: TeamRole
}
