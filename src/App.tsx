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

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [teamIds, setTeamIds] = useState<number[]>([149, 94, 133])
  const [teamMessage, setTeamMessage] = useState('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
    setTeamMessage('')
    setSaveStatus('idle')
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
    setTeamIds((ids) => [...ids, id])
    setTeamMessage('팀에 추가했습니다.')
  }

  const teamPokemon = useMemo(
    () => teamIds.flatMap((id) => POKEMON.filter((pokemon) => pokemon.id === id)),
    [teamIds],
  )

  const detailMatch = currentPath.match(/^\/pokemon\/(\d+)$/)
  const editMatch = currentPath.match(/^\/my-team\/(\d+)\/edit$/)
  const detailPokemon = detailMatch
    ? POKEMON.find((pokemon) => pokemon.id === Number(detailMatch[1]))
    : undefined
  const editPokemon = editMatch
    ? teamPokemon.find((pokemon) => pokemon.id === Number(editMatch[1]))
    : undefined
  const activePath = currentPath.startsWith('/pokemon')
    ? '/pokemon'
    : currentPath.startsWith('/my-team')
      ? '/my-team'
      : '/'
  const isKnownPath =
    currentPath === '/' ||
    currentPath === '/pokemon' ||
    currentPath === '/my-team' ||
    Boolean(detailMatch) ||
    Boolean(editMatch)

  const saveTeamPokemon = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaveStatus('saving')
    window.setTimeout(() => setSaveStatus('saved'), 600)
  }

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
          <PokemonList onAdd={addToTeam} onView={(id) => navigate(`/pokemon/${id}`)} />
        </>
      )}

      {currentPath === '/pokemon' && (
        <section className="route-page" aria-labelledby="pokedex-title">
          <span className="route-page__label">POKÉDEX</span>
          <h1 id="pokedex-title">포켓몬 도감</h1>
          <p>이름과 번호로 검색하고 타입별로 포켓몬을 살펴보세요.</p>
          {teamMessage && <p className="route-message">{teamMessage}</p>}
          <PokemonList mode="catalog" onAdd={addToTeam} onView={(id) => navigate(`/pokemon/${id}`)} />
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
              <button className="primary-button" type="button" onClick={() => addToTeam(detailPokemon.id)}>팀에 추가</button>
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
        <section className="route-page" aria-labelledby="team-title">
          <span className="route-page__label">MY TEAM · {teamIds.length} / 6</span>
          <h1 id="team-title">내 팀</h1>
          <p>최대 6마리의 포켓몬과 함께 모험할 수 있습니다.</p>
          {teamMessage && <p className="route-message">{teamMessage}</p>}
          <PokemonList items={teamPokemon} mode="team" onEdit={(id) => navigate(`/my-team/${id}/edit`)} onView={(id) => navigate(`/pokemon/${id}`)} />
          <div className="team-empty-slots" aria-label="빈 팀 슬롯">
            {Array.from({ length: 6 - teamPokemon.length }, (_, index) => (
              <div key={index}><span>+</span><p>빈 슬롯</p></div>
            ))}
          </div>
        </section>
      )}

      {editMatch && editPokemon && (
        <section className="edit-page" aria-labelledby="edit-title">
          <button className="text-button" type="button" onClick={() => navigate('/my-team')}>← 내 팀으로</button>
          <div className="edit-page__heading">
            <img src={editPokemon.imageUrl} alt={editPokemon.name} />
            <div><span>#{editPokemon.number}</span><h1 id="edit-title">{editPokemon.name} 편집</h1></div>
          </div>
          <form className="edit-form" onSubmit={saveTeamPokemon}>
            <label>별명<input name="nickname" defaultValue={editPokemon.name} /></label>
            <label>역할<select name="role" defaultValue="공격"><option>공격</option><option>방어</option><option>지원</option></select></label>
            <label>메모<textarea name="memo" placeholder="함께할 모험을 기록해 보세요." /></label>
            <div className="edit-form__actions">
              <button className="secondary-button" type="button" onClick={() => navigate('/my-team')}>취소</button>
              <button
                className="danger-button"
                type="button"
                onClick={() => {
                  setTeamIds((ids) => ids.filter((id) => id !== editPokemon.id))
                  navigate('/my-team')
                }}
              >
                팀에서 삭제
              </button>
              <button className="primary-button" type="submit" disabled={saveStatus === 'saving'}>{saveStatus === 'saving' ? '저장 중…' : '저장하기'}</button>
            </div>
            {saveStatus === 'saved' && <p className="save-success">변경사항을 저장했습니다.</p>}
          </form>
        </section>
      )}

      {editMatch && !editPokemon && (
        <section className="route-not-found"><span className="recovery-panel__symbol">!</span><h1>팀 포켓몬을 찾을 수 없어요</h1><p>삭제되었거나 존재하지 않는 팀 슬롯입니다.</p><button type="button" onClick={() => navigate('/my-team')}>내 팀으로</button></section>
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
