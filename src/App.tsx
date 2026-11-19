import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import PokemonHeader from './components/PokemonHeader'
import PokemonList from './components/PokemonList'
import { usePokemonDetail } from './hooks/usePokemonPage'
import { POKEMON, type Pokemon } from './pokemon'

const navigationItems = [
  { label: '홈', path: '/' },
  { label: '도감', path: '/pokemon' },
  { label: '내 팀', path: '/my-team' },
]
const quickLinks = [
  { title: '도감', description: '모든 포켓몬 만나기', path: '/pokemon' },
  { title: '내 팀', description: '나만의 6마리', path: '/my-team' },
  { title: '오늘의 추천', description: '새로운 파트너', path: '/pokemon/149' },
]
type TeamRole = '공격' | '방어' | '서포트'
interface TeamProfile { nickname: string; role: string; pokemon?: Pokemon }
interface TeamState { ids: number[]; profiles: Record<number, TeamProfile>; recovered: boolean }
const INITIAL_TEAM_IDS = [25, 6, 1]
const INITIAL_TEAM_PROFILES: Record<number, TeamProfile> = {
  25: { nickname: '피카츄', role: '스피드' },
  6: { nickname: '리자몽', role: '공격' },
  1: { nickname: '이상해씨', role: '서포트' },
}
const TEAM_STORAGE_KEY = 'pokemate-team'
const createInitialTeamState = (recovered = false): TeamState => ({
  ids: [...INITIAL_TEAM_IDS], profiles: { ...INITIAL_TEAM_PROFILES }, recovered,
})
const isSavedPokemon = (value: unknown): value is Pokemon => {
  if (!value || typeof value !== 'object') return false
  const pokemon = value as Partial<Pokemon>
  return typeof pokemon.id === 'number' && typeof pokemon.number === 'string' &&
    typeof pokemon.name === 'string' && typeof pokemon.type === 'string' &&
    typeof pokemon.imageUrl === 'string'
}
const loadTeamState = (): TeamState => {
  try {
    const savedValue = window.localStorage.getItem(TEAM_STORAGE_KEY)
    if (!savedValue) return createInitialTeamState()
    const parsedValue: unknown = JSON.parse(savedValue)
    if (!parsedValue || typeof parsedValue !== 'object') throw new Error('Invalid team')
    const savedTeam = parsedValue as Partial<TeamState>
    const ids = savedTeam.ids
    const profiles = savedTeam.profiles
    const validIds = Array.isArray(ids) && ids.length <= 6 && new Set(ids).size === ids.length &&
      ids.every((id) => typeof id === 'number')
    const validProfiles = profiles !== null && typeof profiles === 'object' && ids?.every((id) => {
      const profile = profiles[id]
      return Boolean(profile) && typeof profile.nickname === 'string' &&
        typeof profile.role === 'string' &&
        (POKEMON.some((pokemon) => pokemon.id === id) || isSavedPokemon(profile.pokemon))
    })
    if (!validIds || !validProfiles) throw new Error('Invalid team')
    return { ids, profiles, recovered: false }
  } catch {
    window.localStorage.removeItem(TEAM_STORAGE_KEY)
    return createInitialTeamState(true)
  }
}
const typeLabels: Record<string, string> = {
  ELECTRIC: '전기', FIRE: '불꽃', GRASS: '풀', DRAGON: '드래곤', GHOST: '고스트',
  NORMAL: '노말', WATER: '물', ICE: '얼음', FIGHTING: '격투', POISON: '독',
  GROUND: '땅', FLYING: '비행', PSYCHIC: '에스퍼', BUG: '벌레', ROCK: '바위',
  DARK: '악', STEEL: '강철', FAIRY: '페어리',
}
const statLabels: Record<string, string> = { hp: 'HP', attack: 'Attack', defense: 'Defense', speed: 'Speed' }

interface SharedPageProps {
  teamIds: number[]
  teamMessage: string
  addToTeam: (pokemon: Pokemon) => void
}
function HomePage({ teamIds, addToTeam }: Pick<SharedPageProps, 'teamIds' | 'addToTeam'>) {
  return <>
    <PokemonHeader />
    <section className="quick-links" aria-label="바로가기">
      {quickLinks.map((item) => <Link className="quick-links__item" key={item.title} to={item.path}>
        <strong>{item.title}</strong><span>{item.description}</span>
      </Link>)}
    </section>
    <PokemonList teamFull={teamIds.length >= 6} teamIds={teamIds} onAdd={addToTeam} />
  </>
}
function CatalogPage({ teamIds, teamMessage, addToTeam }: SharedPageProps) {
  return <section className="live-pokedex-page" aria-label="실시간 포켓몬 도감">
    {teamMessage && <p className="team-feedback" role="status">{teamMessage}</p>}
    <PokemonList mode="catalog" teamFull={teamIds.length >= 6} teamIds={teamIds} onAdd={addToTeam} />
  </section>
}
function PokemonDetailPage({ teamIds, teamMessage, addToTeam }: SharedPageProps) {
  const { pokemonId } = useParams()
  const pokemonQuery = usePokemonDetail(pokemonId)
  const pokemon = pokemonQuery.data
  const isNotFound = pokemonQuery.error instanceof Error && pokemonQuery.error.message === 'POKEMON_NOT_FOUND'
  if (pokemonQuery.isPending) return <section className="api-state-panel route-state" role="status">
    <span className="api-state-panel__symbol">…</span><strong>포켓몬 정보를 불러오는 중</strong><p>잠시만 기다려 주세요.</p>
  </section>
  if (isNotFound) return <section className="route-not-found route-not-found--data" aria-labelledby="invalid-pokemon-title">
    <span className="recovery-panel__symbol">!</span><h1 id="invalid-pokemon-title">포켓몬을 찾을 수 없어요</h1>
    <p>입력한 도감 번호 또는 이름에 해당하는 포켓몬이 없어요.</p><Link className="route-action" to="/pokemon">도감으로</Link>
  </section>
  if (pokemonQuery.isError || !pokemon) return <section className="route-not-found route-not-found--data" aria-labelledby="detail-error-title">
    <span className="recovery-panel__symbol">!</span><h1 id="detail-error-title">정보를 불러오지 못했어요</h1>
    <p>네트워크를 확인하고 다시 시도해 주세요.</p><button type="button" onClick={() => void pokemonQuery.refetch()}>다시 시도</button>
  </section>
  const visibleStats = pokemon.stats.filter((stat) => statLabels[stat.name])
  const alreadyAdded = teamIds.includes(pokemon.id)
  const teamFull = teamIds.length >= 6
  return <section className="pokemon-detail" aria-labelledby="detail-title">
    <p className="pokemon-detail__breadcrumb"><Link to="/pokemon">도감</Link><span>/</span>#{pokemon.number}</p>
    <div className="pokemon-detail__content">
      <div className="pokemon-detail__artwork-panel"><div className="pokemon-detail__artwork"><img src={pokemon.imageUrl} alt={pokemon.name} /></div></div>
      <div className="pokemon-detail__copy">
        <span className="pokemon-detail__number">#{pokemon.number}</span><h1 id="detail-title">{pokemon.name}</h1>
        <p className="pokemon-detail__description">{pokemon.description}</p>
        <div className="pokemon-detail__types" aria-label="타입">{pokemon.types.map((type) =>
          <span className={`pokemon-card__type pokemon-card__type--${type.toLowerCase()}`} key={type}>{type}</span>)}</div>
        <dl className="pokemon-detail__facts">
          <div><dt>키</dt><dd>{pokemon.height} m</dd></div><div><dt>몸무게</dt><dd>{pokemon.weight} kg</dd></div>
          <div><dt>특성</dt><dd>{pokemon.abilities[0] ?? '없음'}</dd></div>
        </dl>
        <div className="pokemon-detail__stats" aria-label="기본 능력치">{visibleStats.map((stat) =>
          <div className="pokemon-detail__stat" key={stat.name}><span>{statLabels[stat.name]}</span><i><b style={{ width: `${Math.min(stat.value / 1.2, 100)}%` }} /></i></div>)}</div>
        <button className="primary-button" type="button" disabled={alreadyAdded || teamFull} onClick={() => addToTeam(pokemon)}>
          {alreadyAdded ? '추가됨' : teamFull ? '팀 가득 참' : '내 팀에 추가'}
        </button>
        {teamMessage && <span className="route-message">{teamMessage}</span>}
      </div>
    </div>
  </section>
}

interface TeamPageProps {
  teamIds: number[]; teamProfiles: Record<number, TeamProfile>; teamPokemon: Pokemon[]; teamMessage: string
  resetTeam: () => void; removeFromTeam: (id: number) => void; saveTeam: () => void
}
function MyTeamPage({ teamIds, teamProfiles, teamPokemon, teamMessage, resetTeam, removeFromTeam, saveTeam }: TeamPageProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)
  const pendingDeletePokemon = teamPokemon.find((pokemon) => pokemon.id === pendingDeleteId)
  return <section className="my-team-page" aria-labelledby="team-title">
    <div className="my-team-heading"><div className="my-team-heading__copy"><div className="my-team-heading__title-row">
      <h1 id="team-title">나의 팀</h1><span className="my-team-count">{teamIds.length} / 6</span>
    </div><p>최대 6마리의 포켓몬으로 나만의 팀을 완성하세요.</p></div><div className="my-team-heading__actions">
      <button className="team-action-button team-action-button--primary" type="button" onClick={saveTeam}>팀 저장</button>
      <button className="team-action-button" type="button" onClick={resetTeam}>취소</button>
    </div></div>
    {teamMessage && <p className="team-feedback" role="status">{teamMessage}</p>}
    <div className="team-slot-grid" aria-label={`내 팀 ${teamIds.length}마리`}>
      {teamPokemon.map((pokemon) => { const profile = teamProfiles[pokemon.id] ?? { nickname: pokemon.name, role: '공격' }; return <article className="team-slot" key={pokemon.id}>
        <span className="team-slot__artwork"><img src={pokemon.imageUrl} alt="" /></span><div className="team-slot__copy"><strong>{profile.nickname}</strong><span>{typeLabels[pokemon.type] ?? pokemon.type} · {profile.role}</span></div>
        <div className="team-slot__actions"><Link to={`/my-team/${pokemon.id}/edit`}>편집</Link><button className="is-danger" type="button" onClick={() => setPendingDeleteId(pokemon.id)}>삭제</button></div>
      </article> })}
      {Array.from({ length: 6 - teamPokemon.length }, (_, index) => <div className="team-slot team-slot--empty" key={`empty-${index}`}>
        <span className="team-slot__empty-icon">+</span><div className="team-slot__copy"><strong>빈 슬롯</strong><span>포켓몬을 추가해 보세요</span></div><span className="team-slot__handle" aria-hidden="true"><i /><i /><i /></span>
      </div>)}
    </div>
    {pendingDeletePokemon && <div className="team-dialog-backdrop" role="presentation"><section className="team-dialog team-delete-dialog" role="alertdialog" aria-labelledby="team-delete-title">
      <span className="team-delete-dialog__icon">!</span><h2 id="team-delete-title">{pendingDeletePokemon.name}을 삭제할까요?</h2><p>팀에서만 삭제되며 도감에서는 계속 확인할 수 있어요.</p>
      <div className="team-dialog__actions"><button type="button" onClick={() => setPendingDeleteId(null)}>취소</button><button className="is-danger" type="button" onClick={() => { removeFromTeam(pendingDeletePokemon.id); setPendingDeleteId(null) }}>삭제</button></div>
    </section></div>}
  </section>
}

interface EditTeamPageProps { teamIds: number[]; teamProfiles: Record<number, TeamProfile>; teamPokemon: Pokemon[]; updateProfile: (id: number, nickname: string, role: TeamRole) => void }
function EditTeamPage({ teamIds, teamProfiles, teamPokemon, updateProfile }: EditTeamPageProps) {
  const { teamPokemonId } = useParams(); const navigate = useNavigate(); const id = Number(teamPokemonId)
  const pokemon = teamPokemon.find((item) => item.id === id); const profile = teamProfiles[id]
  const [nickname, setNickname] = useState(profile?.nickname ?? '')
  const [role, setRole] = useState<TeamRole>(profile?.role === '방어' || profile?.role === '서포트' ? profile.role : '공격')
  const [error, setError] = useState('')
  if (!pokemon || !teamIds.includes(id)) return <section className="route-not-found route-not-found--data" aria-labelledby="team-pokemon-not-found">
    <span className="recovery-panel__symbol">!</span><h1 id="team-pokemon-not-found">팀 포켓몬을 찾을 수 없어요</h1><p>현재 팀에 포함된 포켓몬만 편집할 수 있어요.</p><Link className="route-action" to="/my-team">내 팀으로</Link>
  </section>
  const submitEdit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const nextNickname = nickname.trim()
    if (!nextNickname) return setError('별명을 입력해 주세요.'); if (nextNickname.length > 10) return setError('별명은 10자 이하로 입력해 주세요.')
    updateProfile(id, nextNickname, role); navigate('/my-team')
  }
  return <section className="edit-page" aria-labelledby="team-edit-title"><p className="pokemon-detail__breadcrumb"><Link to="/my-team">내 팀</Link><span>/</span>편집</p>
    <div className="edit-page__heading"><img src={pokemon.imageUrl} alt="" /><div><span>팀 슬롯 #{teamIds.indexOf(id) + 1}</span><h1 id="team-edit-title">{pokemon.name} 편집</h1></div></div>
    <form className="edit-form" onSubmit={submitEdit}><label>별명<input value={nickname} maxLength={10} onChange={(event) => { setNickname(event.target.value); setError('') }} /></label>
      <label>역할<select value={role} onChange={(event) => setRole(event.target.value as TeamRole)}><option value="공격">공격</option><option value="방어">방어</option><option value="서포트">서포트</option></select></label>
      {error && <p className="team-dialog__error" role="alert">{error}</p>}<div className="edit-form__actions"><Link className="secondary-button" to="/my-team">취소</Link><button className="primary-button" type="submit">저장</button></div>
    </form>
  </section>
}
function PathNotFoundPage() { return <section className="route-not-found" aria-labelledby="not-found-title">
  <span className="recovery-panel__symbol">!</span><h1 id="not-found-title">페이지를 찾을 수 없어요</h1><p>요청한 주소는 PokéMate에 정의된 경로가 아니에요.</p>
  <div className="not-found-actions"><Link className="route-action" to="/">홈으로</Link><Link className="route-action route-action--secondary" to="/pokemon">도감 보기</Link></div>
</section> }

function App() {
  const [teamState, setTeamState] = useState<TeamState>(loadTeamState)
  const { ids: teamIds, profiles: teamProfiles } = teamState
  const [teamMessage, setTeamMessage] = useState(() => teamState.recovered ? '저장된 팀 데이터를 읽을 수 없어 기본 팀으로 복구했습니다.' : '')
  useEffect(() => { window.localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify({ ids: teamIds, profiles: teamProfiles })) }, [teamIds, teamProfiles])
  const addToTeam = (pokemon: Pokemon) => {
    if (teamIds.includes(pokemon.id)) return setTeamMessage('이미 팀에 포함된 포켓몬입니다.')
    if (teamIds.length >= 6) return setTeamMessage('팀에는 최대 6마리까지 추가할 수 있습니다.')
    setTeamState((state) => ({ ids: [...state.ids, pokemon.id], profiles: { ...state.profiles, [pokemon.id]: { nickname: pokemon.name, role: '공격', pokemon } }, recovered: false }))
    setTeamMessage(`${pokemon.name}을 팀에 추가했습니다.`)
  }
  const removeFromTeam = (id: number) => { const name = teamProfiles[id]?.nickname ?? '포켓몬'; setTeamState((state) => { const profiles = { ...state.profiles }; delete profiles[id]; return { ids: state.ids.filter((teamId) => teamId !== id), profiles, recovered: false } }); setTeamMessage(`${name}을 팀에서 삭제했습니다.`) }
  const updateProfile = (id: number, nickname: string, role: TeamRole) => { setTeamState((state) => ({ ...state, profiles: { ...state.profiles, [id]: { ...state.profiles[id], nickname, role } }, recovered: false })); setTeamMessage('포켓몬 정보를 저장했습니다.') }
  const teamPokemon = useMemo(() => teamIds.flatMap((id) => teamProfiles[id]?.pokemon ? [teamProfiles[id].pokemon] : POKEMON.filter((pokemon) => pokemon.id === id)), [teamIds, teamProfiles])
  return <main className="app-shell" aria-label="PokéMate">
    <header className="pokemon-navigation"><Link className="pokemon-navigation__brand" to="/"><span className="pokemon-navigation__mark">PM</span><span className="pokemon-navigation__wordmark">PokéMate</span></Link>
      <nav className="pokemon-navigation__links" aria-label="주요 메뉴">{navigationItems.map((item) => <NavLink className={({ isActive }) => `pokemon-navigation__item${isActive ? ' is-active' : ''}`} end={item.path === '/'} key={item.path} to={item.path}>{item.label}</NavLink>)}<span className="pokemon-navigation__team-count">{teamIds.length} / 6</span></nav>
    </header>
    <Routes>
      <Route path="/" element={<HomePage teamIds={teamIds} addToTeam={addToTeam} />} />
      <Route path="/pokemon" element={<CatalogPage teamIds={teamIds} teamMessage={teamMessage} addToTeam={addToTeam} />} />
      <Route path="/pokemon/:pokemonId" element={<PokemonDetailPage teamIds={teamIds} teamMessage={teamMessage} addToTeam={addToTeam} />} />
      <Route path="/my-team" element={<MyTeamPage teamIds={teamIds} teamProfiles={teamProfiles} teamPokemon={teamPokemon} teamMessage={teamMessage} saveTeam={() => setTeamMessage('현재 팀 구성을 저장했습니다.')} resetTeam={() => { setTeamState(createInitialTeamState()); setTeamMessage('처음 팀으로 되돌렸습니다.') }} removeFromTeam={removeFromTeam} />} />
      <Route path="/my-team/:teamPokemonId/edit" element={<EditTeamPage teamIds={teamIds} teamProfiles={teamProfiles} teamPokemon={teamPokemon} updateProfile={updateProfile} />} />
      <Route path="*" element={<PathNotFoundPage />} />
    </Routes>
  </main>
}
export default App
