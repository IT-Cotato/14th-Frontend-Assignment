import { useEffect, useMemo, useState, type FormEvent } from 'react'
import PokemonHeader from './components/PokemonHeader'
import PokemonList from './components/PokemonList'
import { POKEMON } from './pokemon'

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

interface TeamProfile {
  nickname: string
  role: string
}

interface TeamState {
  ids: number[]
  profiles: Record<number, TeamProfile>
  recovered: boolean
}

const INITIAL_TEAM_IDS = [25, 6, 1]
const INITIAL_TEAM_PROFILES: Record<number, TeamProfile> = {
  25: { nickname: '피카츄', role: '스피드' },
  6: { nickname: '리자몽', role: '공격' },
  1: { nickname: '이상해씨', role: '서포트' },
}

const TEAM_STORAGE_KEY = 'pokemate-team'

const createInitialTeamState = (recovered = false): TeamState => ({
  ids: [...INITIAL_TEAM_IDS],
  profiles: { ...INITIAL_TEAM_PROFILES },
  recovered,
})

const loadTeamState = (): TeamState => {
  try {
    const savedValue = window.localStorage.getItem(TEAM_STORAGE_KEY)
    if (!savedValue) return createInitialTeamState()

    const parsedValue: unknown = JSON.parse(savedValue)
    if (!parsedValue || typeof parsedValue !== 'object') throw new Error('Invalid saved team')

    const savedTeam = parsedValue as Partial<TeamState>
    const ids = savedTeam.ids
    const profiles = savedTeam.profiles
    const validIds =
      Array.isArray(ids) &&
      ids.length <= 6 &&
      new Set(ids).size === ids.length &&
      ids.every((id) => typeof id === 'number' && POKEMON.some((pokemon) => pokemon.id === id))
    const validProfiles =
      profiles !== null &&
      typeof profiles === 'object' &&
      ids?.every((id) => {
        const profile = profiles[id]
        return Boolean(profile) && typeof profile.nickname === 'string' && typeof profile.role === 'string'
      })

    if (!validIds || !validProfiles) throw new Error('Invalid saved team')
    return { ids, profiles, recovered: false }
  } catch {
    window.localStorage.removeItem(TEAM_STORAGE_KEY)
    return createInitialTeamState(true)
  }
}

const typeLabels = {
  ELECTRIC: '전기',
  FIRE: '불꽃',
  GRASS: '풀',
  DRAGON: '드래곤',
  GHOST: '고스트',
  NORMAL: '노말',
} as const

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [teamState, setTeamState] = useState<TeamState>(loadTeamState)
  const { ids: teamIds, profiles: teamProfiles } = teamState
  const [teamMessage, setTeamMessage] = useState(() =>
    teamState.recovered ? '저장된 팀 데이터를 읽을 수 없어 기본 팀으로 복구했습니다.' : '',
  )
  const [editingId, setEditingId] = useState<number | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)
  const [draftNickname, setDraftNickname] = useState('')
  const [draftRole, setDraftRole] = useState<TeamRole>('공격')
  const [editError, setEditError] = useState('')

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(
      TEAM_STORAGE_KEY,
      JSON.stringify({ ids: teamIds, profiles: teamProfiles }),
    )
  }, [teamIds, teamProfiles])

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
    setTeamMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const addToTeam = (id: number) => {
    if (teamIds.includes(id)) {
      setTeamMessage('이미 팀에 포함된 포켓몬입니다.')
      return
    }
    if (teamIds.length >= 6) {
      setTeamMessage('팀에는 최대 6마리까지 추가할 수 있습니다.')
      return
    }

    const pokemon = POKEMON.find((item) => item.id === id)
    if (!pokemon) return

    setTeamState((previousState) => {
      if (previousState.ids.includes(id) || previousState.ids.length >= 6) return previousState
      return {
        ids: [...previousState.ids, id],
        profiles: {
          ...previousState.profiles,
          [id]: { nickname: pokemon.name, role: '공격' },
        },
        recovered: false,
      }
    })
    setTeamMessage(`${pokemon.name}을 팀에 추가했습니다.`)
  }

  const removeFromTeam = (id: number) => {
    const pokemon = POKEMON.find((item) => item.id === id)
    setTeamState((previousState) => {
      const nextProfiles = { ...previousState.profiles }
      delete nextProfiles[id]
      return {
        ids: previousState.ids.filter((teamId) => teamId !== id),
        profiles: nextProfiles,
        recovered: false,
      }
    })
    setPendingDeleteId(null)
    setTeamMessage(`${pokemon?.name ?? '포켓몬'}을 팀에서 삭제했습니다.`)
  }

  const startEditing = (id: number) => {
    const profile = teamProfiles[id]
    setEditingId(id)
    setDraftNickname(profile?.nickname ?? '')
    setDraftRole(profile?.role === '방어' || profile?.role === '서포트' ? profile.role : '공격')
    setEditError('')
  }

  const cancelEditing = () => {
    setEditingId(null)
    setDraftNickname('')
    setDraftRole('공격')
    setEditError('')
  }

  const saveTeamPokemon = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (editingId === null) return

    const nickname = draftNickname.trim()
    if (!nickname) {
      setEditError('별명을 입력해 주세요.')
      return
    }
    if (nickname.length > 10) {
      setEditError('별명은 10자 이하로 입력해 주세요.')
      return
    }

    setTeamState((previousState) => ({
      ...previousState,
      profiles: {
        ...previousState.profiles,
        [editingId]: { nickname, role: draftRole },
      },
      recovered: false,
    }))
    setTeamMessage('포켓몬 정보를 저장했습니다.')
    cancelEditing()
  }

  const teamPokemon = useMemo(
    () => teamIds.flatMap((id) => POKEMON.filter((pokemon) => pokemon.id === id)),
    [teamIds],
  )

  const detailMatch = currentPath.match(/^\/pokemon\/(\d+)$/)
  const detailPokemon = detailMatch
    ? POKEMON.find((pokemon) => pokemon.id === Number(detailMatch[1]))
    : undefined
  const editingPokemon = editingId === null
    ? undefined
    : teamPokemon.find((pokemon) => pokemon.id === editingId)
  const pendingDeletePokemon = pendingDeleteId === null
    ? undefined
    : teamPokemon.find((pokemon) => pokemon.id === pendingDeleteId)
  const activePath = currentPath.startsWith('/pokemon')
    ? '/pokemon'
    : currentPath.startsWith('/my-team')
      ? '/my-team'
      : '/'
  const isKnownPath =
    currentPath === '/' ||
    currentPath === '/pokemon' ||
    currentPath === '/my-team' ||
    Boolean(detailMatch)

  return (
    <main className="app-shell" aria-label="PokéMate 최종 제품">
      <header className="pokemon-navigation">
        <button className="pokemon-navigation__brand" type="button" onClick={() => navigate('/')}>
          <span className="pokemon-navigation__mark">PM</span>
          <span className="pokemon-navigation__wordmark">PokéMate</span>
        </button>

        <nav className="pokemon-navigation__links" aria-label="주요 메뉴">
          {navigationItems.map((item) => (
            <button
              className={`pokemon-navigation__item${activePath === item.path ? ' is-active' : ''}`}
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
          <span className="pokemon-navigation__team-count">{teamIds.length} / 6</span>
        </nav>
      </header>

      {currentPath === '/' && (
        <>
          <PokemonHeader onNavigate={navigate} />
          <section className="quick-links" aria-label="바로가기">
            {quickLinks.map((link) => (
              <button className="quick-links__item" key={link.title} type="button" onClick={() => navigate(link.path)}>
                <strong>{link.title}</strong>
                <span>{link.description}</span>
              </button>
            ))}
          </section>
          <PokemonList
            teamFull={teamIds.length >= 6}
            teamIds={teamIds}
            onAdd={addToTeam}
            onView={(id) => navigate(`/pokemon/${id}`)}
          />
        </>
      )}

      {currentPath === '/pokemon' && (
        <section className="search-team-page" aria-labelledby="pokedex-title">
          <div className="search-team-heading">
            <div>
              <h1 id="pokedex-title">포켓몬을 찾고 팀을 완성하세요</h1>
              <p>도감과 나의 팀을 한 화면에서 관리할 수 있어요.</p>
            </div>
            <span>내 팀 {teamIds.length} / 6</span>
          </div>
          {teamMessage && <p className="team-feedback" role="status">{teamMessage}</p>}
          <div className="search-team-layout">
            <div className="search-team-pokedex">
              <h2>도감</h2>
              <PokemonList
                mode="catalog"
                teamFull={teamIds.length >= 6}
                teamIds={teamIds}
                onAdd={addToTeam}
                onView={(id) => navigate(`/pokemon/${id}`)}
              />
            </div>
            <aside className="search-team-panel" aria-label={`나의 팀 ${teamIds.length}마리`}>
              <div className="search-team-panel__heading">
                <h2>나의 팀</h2>
                <button type="button" onClick={() => navigate('/my-team')}>전체 보기</button>
              </div>
              {teamPokemon.length === 0 ? (
                <div className="search-team-panel__empty">
                  <strong>아직 팀이 비어 있어요</strong>
                  <span>도감에서 포켓몬을 추가해 보세요.</span>
                </div>
              ) : (
                teamPokemon.map((pokemon) => {
                  const profile = teamProfiles[pokemon.id] ?? { nickname: pokemon.name, role: '공격' }
                  return (
                    <article className="team-slot" key={pokemon.id}>
                      <span className="team-slot__artwork"><img src={pokemon.imageUrl} alt="" /></span>
                      <div className="team-slot__copy">
                        <strong>{profile.nickname}</strong>
                        <span>{typeLabels[pokemon.type]} · {profile.role}</span>
                      </div>
                      <div className="team-slot__actions">
                        <button type="button" onClick={() => startEditing(pokemon.id)}>편집</button>
                        <button className="is-danger" type="button" onClick={() => setPendingDeleteId(pokemon.id)}>삭제</button>
                      </div>
                    </article>
                  )
                })
              )}
            </aside>
          </div>
        </section>
      )}

      {detailMatch && detailPokemon && (
        <section className="pokemon-detail" aria-labelledby="detail-title">
          <button className="text-button" type="button" onClick={() => navigate('/pokemon')}>← 도감으로</button>
          <div className="pokemon-detail__content">
            <div className="pokemon-detail__artwork"><img src={detailPokemon.imageUrl} alt={detailPokemon.name} /></div>
            <div className="pokemon-detail__copy">
              <span>#{detailPokemon.number}</span>
              <h1 id="detail-title">{detailPokemon.name}</h1>
              <strong className={`pokemon-card__type pokemon-card__type--${detailPokemon.type.toLowerCase()}`}>{detailPokemon.type}</strong>
              <p>새로운 모험을 함께할 든든한 파트너입니다.</p>
              <button
                className="primary-button"
                type="button"
                disabled={teamIds.includes(detailPokemon.id) || teamIds.length >= 6}
                onClick={() => addToTeam(detailPokemon.id)}
              >
                {teamIds.includes(detailPokemon.id) ? '추가됨' : teamIds.length >= 6 ? '팀 가득 참' : '팀에 추가'}
              </button>
              {teamMessage && <span className="route-message">{teamMessage}</span>}
            </div>
          </div>
        </section>
      )}

      {detailMatch && !detailPokemon && (
        <section className="route-not-found" aria-labelledby="invalid-pokemon-title">
          <span className="recovery-panel__symbol">!</span>
          <h1 id="invalid-pokemon-title">포켓몬을 찾을 수 없어요</h1>
          <p>도감 번호를 확인하고 목록으로 돌아가세요.</p>
          <button type="button" onClick={() => navigate('/pokemon')}>도감으로</button>
        </section>
      )}

      {currentPath === '/my-team' && (
        <section className="my-team-page" aria-labelledby="team-title">
          <div className="my-team-heading">
            <div className="my-team-heading__copy">
              <div className="my-team-heading__title-row">
                <h1 id="team-title">나의 팀</h1>
                <span className="my-team-count">{teamIds.length} / 6</span>
              </div>
              <p>최대 6마리의 포켓몬으로 나만의 팀을 완성하세요.</p>
            </div>
            <div className="my-team-heading__actions">
              <button
                className="team-action-button team-action-button--primary"
                type="button"
                onClick={() => setTeamMessage('현재 팀 구성을 저장했습니다.')}
              >
                팀 저장
              </button>
              <button
                className="team-action-button"
                type="button"
                onClick={() => {
                  setTeamState(createInitialTeamState())
                  setPendingDeleteId(null)
                  cancelEditing()
                  setTeamMessage('변경사항을 취소하고 처음 상태로 되돌렸습니다.')
                }}
              >
                취소
              </button>
            </div>
          </div>

          {teamMessage && <p className="team-feedback" role="status">{teamMessage}</p>}

          <div className="team-slot-grid" aria-label={`내 팀 ${teamIds.length}마리`}>
            {teamPokemon.map((pokemon) => {
              const profile = teamProfiles[pokemon.id] ?? { nickname: pokemon.name, role: '공격' }
              return (
                <article className="team-slot" key={pokemon.id}>
                  <span className="team-slot__artwork"><img src={pokemon.imageUrl} alt="" /></span>
                  <div className="team-slot__copy">
                    <strong>{profile.nickname}</strong>
                    <span>{typeLabels[pokemon.type]} · {profile.role}</span>
                  </div>
                  <div className="team-slot__actions">
                    <button type="button" onClick={() => startEditing(pokemon.id)}>편집</button>
                    <button className="is-danger" type="button" onClick={() => setPendingDeleteId(pokemon.id)}>삭제</button>
                  </div>
                </article>
              )
            })}
            {Array.from({ length: 6 - teamPokemon.length }, (_, index) => (
              <div className="team-slot team-slot--empty" key={`empty-${index}`}>
                <span className="team-slot__empty-icon">+</span>
                <div className="team-slot__copy">
                  <strong>빈 슬롯</strong>
                  <span>포켓몬을 추가해 보세요</span>
                </div>
                <span className="team-slot__handle" aria-hidden="true"><i /><i /><i /></span>
              </div>
            ))}
          </div>

        </section>
      )}

      {editingPokemon && (
        <div className="team-dialog-backdrop" role="presentation">
          <form className="team-dialog" onSubmit={saveTeamPokemon} aria-labelledby="team-edit-title">
            <div className="team-dialog__heading">
              <div>
                <span>팀 슬롯 #{teamIds.indexOf(editingPokemon.id) + 1}</span>
                <h2 id="team-edit-title">{editingPokemon.name} 편집</h2>
              </div>
              <button type="button" aria-label="편집 닫기" onClick={cancelEditing}>×</button>
            </div>
            <label className="team-dialog__field">
              <span>별명</span>
              <input
                value={draftNickname}
                maxLength={10}
                onChange={(event) => {
                  setDraftNickname(event.target.value)
                  setEditError('')
                }}
              />
              <small>{draftNickname.length} / 10</small>
            </label>
            <fieldset className="team-dialog__roles">
              <legend>역할</legend>
              <div>
                {(['공격', '방어', '서포트'] as TeamRole[]).map((role) => (
                  <button
                    className={draftRole === role ? 'is-selected' : ''}
                    key={role}
                    type="button"
                    onClick={() => setDraftRole(role)}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </fieldset>
            {editError && <p className="team-dialog__error" role="alert">{editError}</p>}
            <div className="team-dialog__actions">
              <button type="button" onClick={cancelEditing}>취소</button>
              <button className="is-primary" type="submit">저장</button>
            </div>
          </form>
        </div>
      )}

      {pendingDeletePokemon && (
        <div className="team-dialog-backdrop" role="presentation">
          <section className="team-dialog team-delete-dialog" role="alertdialog" aria-labelledby="team-delete-title">
            <span className="team-delete-dialog__icon">!</span>
            <h2 id="team-delete-title">{pendingDeletePokemon.name}을 삭제할까요?</h2>
            <p>팀에서만 삭제되며 도감에서는 계속 확인할 수 있어요.</p>
            <div className="team-dialog__actions">
              <button type="button" onClick={() => setPendingDeleteId(null)}>취소</button>
              <button className="is-danger" type="button" onClick={() => removeFromTeam(pendingDeletePokemon.id)}>삭제</button>
            </div>
          </section>
        </div>
      )}

      {!isKnownPath && (
        <section className="route-not-found" aria-labelledby="not-found-title">
          <span className="recovery-panel__symbol">!</span>
          <h1 id="not-found-title">페이지를 찾을 수 없어요</h1>
          <p>주소를 확인하거나 이전 화면 또는 홈으로 돌아가세요.</p>
          <div className="not-found-actions"><button type="button" onClick={() => window.history.back()}>이전 화면</button><button type="button" onClick={() => navigate('/')}>홈으로</button></div>
        </section>
      )}
    </main>
  )
}

export default App
