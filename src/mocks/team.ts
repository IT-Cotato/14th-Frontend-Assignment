import { delay, http, HttpResponse } from 'msw'

export const TEAM_STORAGE_KEY = 'pokemate-week08-team-v1'

const TEAM_LIMIT = 6
const editLimits = { nickname: 10, role: 20, memo: 200 } as const
type EditField = keyof typeof editLimits
type TeamEdit = Record<EditField, string>

export type TeamMember = TeamEdit & { id: string; pokemonId: number }

type TeamHandlerOptions = {
  storage: Pick<Storage, 'getItem' | 'setItem'>
  endpoint?: string
  latencyMs?: number
}

function errorResponse(status: number, code: string, message: string) {
  return HttpResponse.json({ code, message }, { status })
}

function invalidBody(message: string) {
  return errorResponse(400, 'INVALID_BODY', message)
}

function missingMember() {
  return errorResponse(404, 'TEAM_MEMBER_NOT_FOUND', '팀 항목을 찾을 수 없어요.')
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isPokemonId(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0
}

function isTeamMember(value: unknown): value is TeamMember {
  return isRecord(value) && typeof value.id === 'string' && value.id !== '' &&
    isPokemonId(value.pokemonId) && typeof value.nickname === 'string' &&
    typeof value.role === 'string' && typeof value.memo === 'string'
}

async function readBody(request: Request) {
  try {
    const value: unknown = await request.json()
    return isRecord(value) ? value : null
  } catch {
    return null
  }
}

function parseEdit(body: Record<string, unknown>): Partial<TeamEdit> | null {
  const entries = Object.entries(body)
  if (!entries.length) return null

  const changes: Partial<TeamEdit> = {}
  for (const [field, value] of entries) {
    if (!Object.hasOwn(editLimits, field) || typeof value !== 'string') return null
    const key = field as EditField
    const normalized = value.trim()
    if (Array.from(normalized).length > editLimits[key]) return null
    changes[key] = normalized
  }
  return changes
}

export function createTeamHandlers({
  storage,
  endpoint = '/api/team',
  latencyMs = 350,
}: TeamHandlerOptions) {
  function loadTeam(): TeamMember[] {
    const raw = storage.getItem(TEAM_STORAGE_KEY)
    if (raw === null) return []
    const team: unknown = JSON.parse(raw)
    if (!Array.isArray(team) || !team.every(isTeamMember)) {
      throw new Error('Invalid stored team')
    }
    return team
  }

  function saveTeam(team: TeamMember[]) {
    storage.setItem(TEAM_STORAGE_KEY, JSON.stringify(team))
  }

  async function respond(action: () => Response | Promise<Response>) {
    if (latencyMs > 0) await delay(latencyMs)
    try {
      return await action()
    } catch {
      return errorResponse(500, 'STORAGE_ERROR', '팀 데이터를 읽거나 저장하지 못했어요.')
    }
  }

  const itemEndpoint = endpoint + '/:id'
  return [
    http.get(endpoint, () => respond(() => HttpResponse.json(loadTeam()))),

    http.post(endpoint, ({ request }) => respond(async () => {
      const body = await readBody(request)
      if (!body || Object.keys(body).length !== 1 || !isPokemonId(body.pokemonId)) {
        return invalidBody('양의 정수인 pokemonId를 보내 주세요.')
      }

      const team = loadTeam()
      if (team.some(({ pokemonId }) => pokemonId === body.pokemonId)) {
        return errorResponse(409, 'DUPLICATE_POKEMON', '이미 팀에 있는 포켓몬이에요.')
      }
      if (team.length >= TEAM_LIMIT) {
        return errorResponse(409, 'TEAM_FULL', '팀에는 최대 6마리까지 추가할 수 있어요.')
      }

      const member = {
        id: globalThis.crypto.randomUUID(),
        pokemonId: body.pokemonId,
        nickname: '',
        role: '',
        memo: '',
      }
      saveTeam([...team, member])
      return HttpResponse.json(member, { status: 201 })
    })),

    http.patch(itemEndpoint, ({ params, request }) => respond(async () => {
      const body = await readBody(request)
      const changes = body && parseEdit(body)
      if (!changes) {
        return invalidBody('별명(10자), 역할(20자), 메모(200자) 중 수정할 값을 보내 주세요.')
      }

      const team = loadTeam()
      const member = team.find(({ id }) => id === params.id)
      if (!member) return missingMember()

      const updated = { ...member, ...changes }
      saveTeam(team.map((item) => item.id === member.id ? updated : item))
      return HttpResponse.json(updated)
    })),

    http.delete(itemEndpoint, ({ params }) => respond(() => {
      const team = loadTeam()
      const remaining = team.filter(({ id }) => id !== params.id)
      if (remaining.length === team.length) return missingMember()

      saveTeam(remaining)
      return new HttpResponse(null, { status: 204 })
    })),
  ]
}
