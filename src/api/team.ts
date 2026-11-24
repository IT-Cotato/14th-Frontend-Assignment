const TEAM_URL = '/api/team';

export interface TeamItem {
  id: string;
  pokemonId: number;
  nickname: string;
  role: string;
  memo: string;
}

export type TeamItemEdit = Partial<Pick<TeamItem, 'nickname' | 'role' | 'memo'>>;

export type TeamErrorCode =
  | 'INVALID_BODY'
  | 'TEAM_MEMBER_NOT_FOUND'
  | 'DUPLICATE_POKEMON'
  | 'TEAM_FULL'
  | 'STORAGE_ERROR'
  | 'UNKNOWN';

const TEAM_ERROR_CODES: readonly TeamErrorCode[] = [
  'INVALID_BODY',
  'TEAM_MEMBER_NOT_FOUND',
  'DUPLICATE_POKEMON',
  'TEAM_FULL',
  'STORAGE_ERROR',
];

export class TeamApiError extends Error {
  status: number;
  code: TeamErrorCode;

  constructor(status: number, code: TeamErrorCode, message: string) {
    super(message);
    this.name = 'TeamApiError';
    this.status = status;
    this.code = code;
  }
}

async function toTeamApiError(response: Response): Promise<TeamApiError> {
  let code: TeamErrorCode = 'UNKNOWN';
  let message = `HTTP ${response.status}`;

  try {
    const body: unknown = await response.json();
    if (typeof body === 'object' && body !== null) {
      const { code: bodyCode, message: bodyMessage } = body as Record<string, unknown>;
      if (typeof bodyCode === 'string' && (TEAM_ERROR_CODES as readonly string[]).includes(bodyCode)) {
        code = bodyCode as TeamErrorCode;
      }
      if (typeof bodyMessage === 'string') message = bodyMessage;
    }
  } catch {
    // 본문이 JSON이 아니면 상태 코드만으로 에러를 만듦.
  }

  return new TeamApiError(response.status, code, message);
}

async function request(url: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw await toTeamApiError(response);
  }
  return response;
}

function jsonInit(method: 'POST' | 'PATCH', body: unknown): RequestInit {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

function itemUrl(id: string): string {
  return `${TEAM_URL}/${encodeURIComponent(id)}`;
}

export async function fetchTeam(signal?: AbortSignal): Promise<TeamItem[]> {
  const response = await request(TEAM_URL, { signal });
  return (await response.json()) as TeamItem[];
}

export async function addTeamItem(pokemonId: number): Promise<TeamItem> {
  const response = await request(TEAM_URL, jsonInit('POST', { pokemonId }));
  return (await response.json()) as TeamItem;
}

export async function updateTeamItem(id: string, changes: TeamItemEdit): Promise<TeamItem> {
  const response = await request(itemUrl(id), jsonInit('PATCH', changes));
  return (await response.json()) as TeamItem;
}

export async function deleteTeamItem(id: string): Promise<void> {
  await request(itemUrl(id), { method: 'DELETE' });
}