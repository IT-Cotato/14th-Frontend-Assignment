import type { Pokemon, PokemonType } from '../components/PokemonCard.tsx'

export const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2'

/* ===== 응답 타입 (이 앱에서 쓰는 필드만) ===== */

export interface NamedApiResource {
  name: string
  url: string
}

/** GET /pokemon?limit&offset */
export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: NamedApiResource[]
}

/** GET /pokemon/{id 또는 name} */
export interface PokemonDetailResponse {
  id: number
  /** 영문 이름 (예: pikachu) */
  name: string
  types: { slot: number; type: NamedApiResource }[]
  sprites: {
    front_default: string | null
    other?: {
      'official-artwork'?: { front_default: string | null }
    }
  }
  species: NamedApiResource
}

/** GET /pokemon-species/{id 또는 name} */
export interface PokemonSpeciesResponse {
  id: number
  name: string
  names: { name: string; language: NamedApiResource }[]
}

/* ===== 오류 =====
 * 호출부는 instanceof로 경우를 나눈다.
 * - PokeApiHttpError: 서버가 응답했지만 response.ok가 아님. status로 404와 다른 오류를 구분한다.
 * - PokeApiNetworkError: 응답을 받지 못함 (오프라인, CORS, DNS 등)
 * - PokeApiResponseError: 200 응답이지만 본문이 기대한 형식이 아님
 * - 요청 취소는 감싸지 않고 그대로 던진다. isAbortError로 확인한다.
 */

export class PokeApiError extends Error {
  readonly url: string

  constructor(message: string, url: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'PokeApiError'
    this.url = url
  }
}

export class PokeApiHttpError extends PokeApiError {
  readonly status: number

  constructor(url: string, status: number) {
    super(`PokéAPI 요청이 HTTP ${status}로 실패했어요.`, url)
    this.name = 'PokeApiHttpError'
    this.status = status
  }
}

export class PokeApiNetworkError extends PokeApiError {
  constructor(url: string, cause: unknown) {
    super('PokéAPI에 연결하지 못했어요.', url, { cause })
    this.name = 'PokeApiNetworkError'
  }
}

export class PokeApiResponseError extends PokeApiError {
  constructor(url: string, message: string, cause?: unknown) {
    super(message, url, { cause })
    this.name = 'PokeApiResponseError'
  }
}

export function isNotFoundError(error: unknown) {
  return error instanceof PokeApiHttpError && error.status === 404
}

/**
 * 요청 취소로 끝났는지 본다. 넘긴 signal이 이미 abort됐다면 어떤 이유로 reject됐든 취소로 본다.
 * (abort(reason)에 직접 넘긴 값으로 reject되는 경우도 포함하기 위해서다)
 */
export function isAbortError(error: unknown, signal?: AbortSignal) {
  if (signal?.aborted) return true
  return error instanceof DOMException && error.name === 'AbortError'
}

/* ===== 공통 요청 ===== */

export type RequestOptions = {
  /** 호출부(요청 훅)가 만든 AbortController의 signal. 생성과 abort는 호출부가 맡는다. */
  signal?: AbortSignal
}

/** fetch는 404·500에서 reject하지 않으므로 response.ok를 직접 확인한다. */
async function requestJson(url: string, { signal }: RequestOptions): Promise<unknown> {
  let response: Response
  try {
    response = await fetch(url, { signal })
  } catch (error) {
    if (isAbortError(error, signal)) throw error
    throw new PokeApiNetworkError(url, error)
  }

  if (!response.ok) throw new PokeApiHttpError(url, response.status)

  try {
    return await response.json()
  } catch (error) {
    if (isAbortError(error, signal)) throw error
    if (error instanceof SyntaxError) {
      throw new PokeApiResponseError(url, '응답 본문을 JSON으로 읽지 못했어요.', error)
    }
    // 본문을 받는 도중 연결이 끊긴 경우
    throw new PokeApiNetworkError(url, error)
  }
}

/* ===== 응답 형식 검사 (json()의 결과는 unknown으로 받아 확인한 뒤에만 타입을 붙인다) ===== */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string'
}

function isNamedApiResource(value: unknown): value is NamedApiResource {
  return (
    isRecord(value) && typeof value.name === 'string' && typeof value.url === 'string'
  )
}

function isPokemonListResponse(value: unknown): value is PokemonListResponse {
  return (
    isRecord(value) &&
    typeof value.count === 'number' &&
    isNullableString(value.next) &&
    isNullableString(value.previous) &&
    Array.isArray(value.results) &&
    value.results.every(isNamedApiResource)
  )
}

function isSprites(value: unknown): value is PokemonDetailResponse['sprites'] {
  if (!isRecord(value) || !isNullableString(value.front_default)) return false
  if (value.other === undefined) return true
  if (!isRecord(value.other)) return false
  const artwork = value.other['official-artwork']
  return (
    artwork === undefined ||
    (isRecord(artwork) && isNullableString(artwork.front_default))
  )
}

function isPokemonDetailResponse(value: unknown): value is PokemonDetailResponse {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.name === 'string' &&
    Array.isArray(value.types) &&
    value.types.every(
      (item) =>
        isRecord(item) &&
        typeof item.slot === 'number' &&
        isNamedApiResource(item.type),
    ) &&
    isSprites(value.sprites) &&
    isNamedApiResource(value.species)
  )
}

function isPokemonSpeciesResponse(value: unknown): value is PokemonSpeciesResponse {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.name === 'string' &&
    Array.isArray(value.names) &&
    value.names.every(
      (item) =>
        isRecord(item) &&
        typeof item.name === 'string' &&
        isNamedApiResource(item.language),
    )
  )
}

async function requestValidated<T>(
  url: string,
  options: RequestOptions,
  isValid: (value: unknown) => value is T,
  label: string,
): Promise<T> {
  const data = await requestJson(url, options)
  if (!isValid(data)) {
    throw new PokeApiResponseError(url, `${label} 응답 형식이 예상과 달라요.`)
  }
  return data
}

/* ===== 조회 함수 ===== */

/** 목록 조회. 결과에는 name과 상세 url만 있으므로 카드 데이터는 상세 조회로 채운다. */
export function fetchPokemonList(
  { limit = 20, offset = 0 }: { limit?: number; offset?: number } = {},
  options: RequestOptions = {},
) {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) })
  const url = `${POKEAPI_BASE_URL}/pokemon?${params}`
  return requestValidated(url, options, isPokemonListResponse, '포켓몬 목록')
}

/**
 * 목록 results의 상세 url(…/pokemon/25/)에서 도감 번호를 꺼낸다.
 * 상세 조회가 끝나기 전이나 실패한 항목에도 번호를 보여 주기 위해 쓴다. 형식이 다르면 null.
 */
export function getPokemonIdFromUrl(url: string) {
  const digits = /\/pokemon\/(\d+)\/?$/.exec(url)?.[1]
  return digits === undefined ? null : Number(digits)
}

/** 목록 results의 url처럼 이미 완성된 상세 주소로 조회한다. */
export function fetchPokemonDetailByUrl(url: string, options: RequestOptions = {}) {
  return requestValidated(url, options, isPokemonDetailResponse, '포켓몬 상세')
}

/**
 * 검색어를 API 경로에 쓸 값으로 정리한다. 앞뒤 공백을 떼고 소문자로 바꾸며,
 * 숫자만 입력한 경우 앞의 0을 떼어 025 → 25로 맞춘다. 정리 후 빈 문자열이면 검색하지 않는다.
 */
export function normalizePokemonQuery(query: string) {
  const keyword = query.trim().toLowerCase()
  return /^\d+$/.test(keyword) ? String(Number(keyword)) : keyword
}

/**
 * 도감 번호 또는 영문 이름으로 상세 조회한다. 없는 포켓몬은 PokeApiHttpError(404)로 끝난다.
 * 빈 검색어로 부르면 /pokemon/ 목록 주소가 되므로, 호출 전에 normalizePokemonQuery 결과를 확인한다.
 */
export function fetchPokemonDetail(idOrName: number | string, options: RequestOptions = {}) {
  const keyword = normalizePokemonQuery(String(idOrName))
  if (keyword === '') {
    throw new RangeError('검색어가 비어 있어 상세 조회를 할 수 없어요.')
  }
  const url = `${POKEAPI_BASE_URL}/pokemon/${encodeURIComponent(keyword)}`
  return fetchPokemonDetailByUrl(url, options)
}

/** 한국어 이름용 species 조회. 상세 응답의 species.url을 그대로 넘긴다. */
export function fetchPokemonSpeciesByUrl(url: string, options: RequestOptions = {}) {
  return requestValidated(url, options, isPokemonSpeciesResponse, '포켓몬 종 정보')
}

/** species의 names에서 한국어 이름을 찾는다. 없으면 null이며, 대체 이름은 호출부가 정한다. */
export function getKoreanName(species: PokemonSpeciesResponse) {
  return species.names.find((entry) => entry.language.name === 'ko')?.name ?? null
}

/* ===== 기존 Pokemon 형식으로 변환 ===== */

/** 18개 타입 전부를 적어 두어, PokemonType에 타입이 추가되면 여기서 컴파일 오류가 나게 한다. */
const KNOWN_TYPES: Record<PokemonType, true> = {
  NORMAL: true,
  FIRE: true,
  WATER: true,
  ELECTRIC: true,
  GRASS: true,
  ICE: true,
  FIGHTING: true,
  POISON: true,
  GROUND: true,
  FLYING: true,
  PSYCHIC: true,
  BUG: true,
  ROCK: true,
  GHOST: true,
  DRAGON: true,
  DARK: true,
  STEEL: true,
  FAIRY: true,
}

/** 화면용 대문자 타입 값(ELECTRIC 등)인지 검사한다. 저장된 팀 데이터 검증에도 쓴다. */
export function isPokemonType(value: string): value is PokemonType {
  return Object.hasOwn(KNOWN_TYPES, value)
}

/** API의 소문자 타입 이름(electric)을 화면용 대문자 값(ELECTRIC)으로 바꾼다. 모르는 타입은 null. */
export function toPokemonType(apiTypeName: string): PokemonType | null {
  const type = apiTypeName.toUpperCase()
  return isPokemonType(type) ? type : null
}

/**
 * 상세 응답을 카드·팀이 쓰는 Pokemon으로 바꾼다.
 * - name: 한국어 이름을 넘기면 그것을, 없으면(null·생략) 영문 이름을 쓴다.
 * - types: slot 순서대로, 18개 타입에 없는 값은 제외한다.
 * - imageUrl: official-artwork → 기본 sprite 순서로 쓰고, 둘 다 없으면 비워서 이름 대체 UI가 나오게 한다.
 */
export function toPokemon(
  detail: PokemonDetailResponse,
  koreanName: string | null = null,
): Pokemon {
  const types = detail.types
    .toSorted((a, b) => a.slot - b.slot)
    .map((item) => toPokemonType(item.type.name))
    .filter((type) => type !== null)
  const imageUrl =
    detail.sprites.other?.['official-artwork']?.front_default ??
    detail.sprites.front_default ??
    undefined

  return {
    id: detail.id,
    name: koreanName ?? detail.name,
    types,
    imageUrl,
  }
}
