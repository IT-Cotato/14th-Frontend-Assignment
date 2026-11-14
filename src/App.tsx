import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useMatch, useNavigate, useSearchParams } from 'react-router';
import Header from './components/Header';
import PokemonHeader from './components/PokemonHeader';
import PokedexTitle from './components/PokedexTitle';
import SearchBar from './components/SearchBar';
import PokemonList from './components/PokemonList';
import PokedexList from './components/PokedexList';
import PokedexSearchResult from './components/PokedexSearchResult';
import TeamTitle from './components/TeamTitle';
import TeamSlotList from './components/TeamSlotList';
import ConfirmDialog from './components/ConfirmDialog';
import Toast from './components/Toast';
import StatePanel from './components/StatePanel';
import { POKEMONS } from './data/pokemons';
import { TEAM_SIZE, createTeamPokemonId } from './data/team';
import { withObjectParticle } from './utils/josa';
import { loadTeam, saveTeam } from './utils/teamStorage';
import { usePokemonSearch } from './hooks/usePokemonSearch';
import { usePokedexPage } from './hooks/usePokedexPage';
import PokemonDetailPage from './pages/PokemonDetailPage';
import TeamEditPage from './pages/TeamEditPage';
import NotFoundPage from './pages/NotFoundPage';
import { POKEDEX_PAGE_SIZE } from './api/pokeapi';
import type { Pokemon, TeamMember, TeamMemberEdit } from './types/pokemon';
import pikachu from './assets/Pikachu.png';


const RECOMMENDED_POKEMONS = POKEMONS.slice(0, 4);
const INITIAL_LOAD = loadTeam();
const TOAST_DURATION = 2000;
function readPage(value: string | null): { page: number; valid: boolean } {
  if (value === null) return { page: 1, valid: true };
  if (!/^\d+$/.test(value) || Number(value) < 1) return { page: 1, valid: false };
  return { page: Number(value), valid: true };
}
const NOTICE_DURATION = 3000;

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [syncedQuery, setSyncedQuery] = useState('');
  const [team, setTeam] = useState<readonly TeamMember[]>(INITIAL_LOAD.team);
  const [savedTeam, setSavedTeam] = useState<readonly TeamMember[]>(INITIAL_LOAD.team);
  const [showRecoverNotice, setShowRecoverNotice] = useState(INITIAL_LOAD.recovered);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const [duplicateNotice, setDuplicateNotice] = useState<{ id: number; name: string; pathname: string } | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const isPokedexRoute = useMatch('/pokemon') !== null;
  const [searchParams, setSearchParams] = useSearchParams();

  const urlQuery = isPokedexRoute ? (searchParams.get('q') ?? '').trim() : '';
  const searchQuery = urlQuery.toLowerCase();
  const { page: pokedexPage, valid: isValidPage } = readPage(searchParams.get('page'));
  const pokedexOffset = (pokedexPage - 1) * POKEDEX_PAGE_SIZE;

  if (isPokedexRoute && urlQuery !== syncedQuery) {
    setSyncedQuery(urlQuery);
    setSearchInput(urlQuery);
  }

  const search = usePokemonSearch(searchQuery);
  const pokedex = usePokedexPage(pokedexOffset, isPokedexRoute && searchQuery === '');
  const lastPage = Math.max(Math.ceil(pokedex.count / POKEDEX_PAGE_SIZE), 1);

  let correctedPage: number | null = null;
  if (!isValidPage) correctedPage = 1;
  else if (pokedex.status === 'success' && pokedexPage > lastPage) correctedPage = lastPage;

  const teamIds = team.map((member) => member.pokemon.id);
  const deletingMember = team.find((member) => member.teamPokemonId === deletingId);
  const duplicateName =
    duplicateNotice?.pathname === location.pathname ? duplicateNotice.name : null;

  useEffect(() => {
    saveTeam(team);
  }, [team]);

    function getSearchWith(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams);
    if (value === null) next.delete(key);
    else next.set(key, value);
    return next;
  }

  function handleSearch() {
    const nextQuery = searchInput.trim();
    if (nextQuery.toLowerCase() === searchQuery) {
      search.retry();
      return;
    }
    setSearchParams(getSearchWith('q', nextQuery === '' ? null : nextQuery));
  }

  function handlePageChange(offset: number) {
    setSearchParams(getSearchWith('page', String(offset / POKEDEX_PAGE_SIZE + 1)));
  }

  function handleHomeSearch() {
    const nextQuery = searchInput.trim();
    navigate(nextQuery === '' ? '/pokemon' : `/pokemon?${new URLSearchParams({ q: nextQuery })}`);
  }

  function showDuplicateNotice(name: string) {
    const id = Date.now();
    setDuplicateNotice({ id, name, pathname: location.pathname });
    setTimeout(() => {
      setDuplicateNotice((current) => (current?.id === id ? null : current));
    }, NOTICE_DURATION);
  }

  function showToast(message: string) {
    const id = Date.now();
    setToast({ id, message });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, TOAST_DURATION);
  }

  function handleAdd(pokemon: Pokemon) {
    if (teamIds.includes(pokemon.id)) {
      showDuplicateNotice(pokemon.name);
      return;
    }

    if (team.length >= TEAM_SIZE) return;

    setTeam((prev) => {
      if (prev.some((member) => member.pokemon.id === pokemon.id)) return prev;
      if (prev.length >= TEAM_SIZE) return prev;
      return [...prev, { teamPokemonId: createTeamPokemonId(prev), pokemon, nickname: '', memo: '' }];
    });
    setDuplicateNotice(null);
    showToast(`${withObjectParticle(pokemon.name)} 팀에 추가했어요.`);
  }

  async function handleMemberSave(teamPokemonId: string, values: TeamMemberEdit): Promise<boolean> {
    const nextTeam = team.map((member) =>
      member.teamPokemonId === teamPokemonId ? { ...member, ...values } : member,
    );
    if (!saveTeam(nextTeam)) return false;
    setTeam(nextTeam);
    return true;
  }

  function handleDeleteConfirm() {
    setTeam((prev) => prev.filter((member) => member.teamPokemonId !== deletingId));
    setDeletingId(null);
  }

  function handleTeamSave() {
    setSavedTeam(team);
  }

  function handleTeamCancel() {
    setTeam(savedTeam);
  }

  return (
    <>
      <div className="app">
        <Header teamCount={team.length} teamLimit={TEAM_SIZE} />

        {showRecoverNotice && (
          <StatePanel
            tone="error"
            icon="!"
            title="저장된 팀을 불러오지 못했어요"
            description="저장 데이터가 손상되어 기본 팀으로 복구했어요."
            action={{ label: '확인', onClick: () => setShowRecoverNotice(false) }}
          />
        )}

        <Routes>
          <Route
            path="/"
            element={
              <>
                <PokemonHeader
                  badge="오늘의 추천"
                  title="포켓몬과 함께하는 하루"
                  description="좋아하는 포켓몬을 찾고 나만의 팀을 만들어 보세요."
                  heroImageUrl={pikachu}
                  heroImageName="피카츄"
                />
                <SearchBar
                  placeholder="이름 또는 번호"
                  value={searchInput}
                  onChange={setSearchInput}
                  onSearch={handleHomeSearch}
                />
                <PokemonList
                  title="추천 포켓몬"
                  moreLabel="전체 보기"
                  moreTo="/pokemon"
                  pokemons={RECOMMENDED_POKEMONS}
                  teamIds={teamIds}
                  teamLimit={TEAM_SIZE}
                  duplicateName={duplicateName}
                  onAdd={handleAdd}
                />
              </>
            }
          />

          <Route
            path="/pokemon"
            element={
              <>
                {correctedPage !== null && (
                  <Navigate replace to={{ search: `?${getSearchWith('page', String(correctedPage))}` }} />
                )}
                <PokedexTitle
                  title="포켓몬 도감"
                  description="페이지를 이동해도 이전 포켓몬을 빠르게 다시 볼 수 있어요."
                  badge={pokedex.isBackgroundFetching ? '갱신 중' : '최신 목록'}
                />
                <SearchBar
                  placeholder="이름 또는 번호"
                  value={searchInput}
                  onChange={setSearchInput}
                  onSearch={handleSearch}
                  status={
                    search.status === 'loading' || search.status === 'error'
                      ? search.status
                      : 'default'
                  }
                />
                {searchQuery === '' ? (
                  <PokedexList
                    pokedex={pokedex}
                    offset={pokedexOffset}
                    onOffsetChange={handlePageChange}
                    teamIds={teamIds}
                    teamLimit={TEAM_SIZE}
                    duplicateName={duplicateName}
                    onAdd={handleAdd}
                  />
                ) : (
                  <PokedexSearchResult
                    status={search.status}
                    pokemon={search.pokemon}
                    onRetry={search.retry}
                    teamIds={teamIds}
                    teamLimit={TEAM_SIZE}
                    duplicateName={duplicateName}
                    onAdd={handleAdd}
                  />
                )}
              </>
            }
          />
          <Route
            path="/pokemon/:pokemonId"
            element={<PokemonDetailPage teamIds={teamIds} teamLimit={TEAM_SIZE} onAdd={handleAdd} />}
          />

          <Route
            path="/my-team"
            element={
              <>
                <TeamTitle
                  teamCount={team.length}
                  teamLimit={TEAM_SIZE}
                  onSave={handleTeamSave}
                  onCancel={handleTeamCancel}
                />
                <TeamSlotList
                  team={team}
                  size={TEAM_SIZE}
                  onDelete={setDeletingId}
                />
              </>
            }
          />
          
          <Route
            path="/my-team/:teamPokemonId/edit"
            element={<TeamEditPage team={team} onSave={handleMemberSave} />}
          />

        
        <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {deletingMember && (
        <ConfirmDialog
          title="포켓몬 삭제"
          message={`${withObjectParticle(deletingMember.nickname || deletingMember.pokemon.name)} 팀에서 삭제할까요?`}
          confirmLabel="삭제"
          onCancel={() => setDeletingId(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {toast && <Toast key={toast.id} message={toast.message} />}
    </>
  );
}

export default App;