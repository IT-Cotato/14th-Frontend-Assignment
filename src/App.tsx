import { useState } from 'react';
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
import type { TeamSlotStatus } from './components/TeamSlot';
import ConfirmDialog from './components/ConfirmDialog';
import Toast from './components/Toast';
import StatePanel from './components/StatePanel';
import SuccessBanner from './components/SuccessBanner';
import { POKEMONS } from './data/pokemons';
import { TEAM_SIZE } from './data/team';
import { withObjectParticle } from './utils/josa';
import { usePokemonSearch } from './hooks/usePokemonSearch';
import { usePokedexPage } from './hooks/usePokedexPage';
import { useTeam } from './hooks/useTeam';
import { useAddTeamItem, useDeleteTeamItem, useUpdateTeamItem } from './hooks/useTeamMutations';
import PokemonDetailPage from './pages/PokemonDetailPage';
import TeamEditPage from './pages/TeamEditPage';
import NotFoundPage from './pages/NotFoundPage';
import { POKEDEX_PAGE_SIZE } from './api/pokeapi';
import { TeamApiError } from './api/team';
import type { Pokemon, TeamMemberEdit } from './types/pokemon';
import pikachu from './assets/Pikachu.png';


const RECOMMENDED_POKEMONS = POKEMONS.slice(0, 4);
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ id: number; message: string; tone: 'default' | 'error' } | null>(null);
  const [savedNoticeId, setSavedNoticeId] = useState<number | null>(null);
  const [slotStatus, setSlotStatus] = useState<Readonly<Record<string, TeamSlotStatus>>>({});
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

  const teamQuery = useTeam();
  const addMutation = useAddTeamItem();
  const updateMutation = useUpdateTeamItem();
  const deleteMutation = useDeleteTeamItem();
  const team = teamQuery.members;
  const teamIds = teamQuery.pokemonIds;
  const deletingMember = team.find((member) => member.teamPokemonId === deletingId);
  const duplicateName =
    duplicateNotice?.pathname === location.pathname ? duplicateNotice.name : null;

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

  function showToast(message: string, tone: 'default' | 'error' = 'default') {
    const id = Date.now();
    setToast({ id, message, tone });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, TOAST_DURATION);
  }

  function showSavedNotice() {
    const id = Date.now();
    setSavedNoticeId(id);
    setTimeout(() => {
      setSavedNoticeId((current) => (current === id ? null : current));
    }, NOTICE_DURATION);
  }

  function handleAdd(pokemon: Pokemon) {
    if (addMutation.isPending) return;

    if (teamIds.includes(pokemon.id)) {
      showDuplicateNotice(pokemon.name);
      return;
    }

    if (teamIds.length >= TEAM_SIZE) return;

    addMutation.mutate(pokemon, {
      onSuccess: () => {
        setDuplicateNotice(null);
        showToast(`${withObjectParticle(pokemon.name)} 팀에 추가했어요.`);
      },
      onError: (error) => {
        if (error instanceof TeamApiError && error.code === 'DUPLICATE_POKEMON') {
          showDuplicateNotice(pokemon.name);
          return;
        }
        if (error instanceof TeamApiError && error.code === 'TEAM_FULL') return;
        showToast(`${withObjectParticle(pokemon.name)} 팀에 추가하지 못했어요. 다시 시도해 주세요.`, 'error');
      },
    });
  }

  async function handleMemberSave(teamPokemonId: string, values: TeamMemberEdit): Promise<boolean> {
    try {
      await updateMutation.mutateAsync({
        id: teamPokemonId,
        changes: { nickname: values.nickname, role: values.role ?? '', memo: values.memo },
      });
      showSavedNotice();
      return true;
    } catch {
      return false;
    }
  }

  function setSlotStatusOf(teamPokemonId: string, status: TeamSlotStatus | null) {
    setSlotStatus((prev) => {
      const next = { ...prev };
      if (status === null) delete next[teamPokemonId];
      else next[teamPokemonId] = status;
      return next;
    });
  }

  async function deleteMember(teamPokemonId: string) {
    setSlotStatusOf(teamPokemonId, 'pending');
    try {
      await deleteMutation.mutateAsync(teamPokemonId);
      setSlotStatusOf(teamPokemonId, null);
      showSavedNotice();
    } catch (error) {
      if (error instanceof TeamApiError && error.code === 'TEAM_MEMBER_NOT_FOUND') {
        setSlotStatusOf(teamPokemonId, null);
        return;
      }
      setSavedNoticeId(null);
      setSlotStatusOf(teamPokemonId, 'error');
    }
  }

  function handleDeleteConfirm() {
    if (deletingId !== null) void deleteMember(deletingId);
    setDeletingId(null);
  }

  return (
    <>
      <div className="app">
        <Header teamCount={teamIds.length} teamLimit={TEAM_SIZE} />

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
                  isAdding={addMutation.isPending}
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
                    isAdding={addMutation.isPending}
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
                    isAdding={addMutation.isPending}
                    onAdd={handleAdd}
                  />
                )}
              </>
            }
          />
          <Route
            path="/pokemon/:pokemonId"
            element={
              <PokemonDetailPage
                teamIds={teamIds}
                teamLimit={TEAM_SIZE}
                isAdding={addMutation.isPending}
                onAdd={handleAdd}
              />
            }
          />

          <Route
            path="/my-team"
            element={
              <>
                <TeamTitle teamCount={teamIds.length} teamLimit={TEAM_SIZE} />
                {savedNoticeId !== null && <SuccessBanner message="팀이 저장됐어요" />}
                {teamQuery.status === 'loading' && (
                  <StatePanel
                    tone="loading"
                    icon="…"
                    title="포켓몬을 불러오는 중"
                    description="잠시만 기다려 주세요."
                  />
                )}
                {teamQuery.status === 'error' && (
                  <StatePanel
                    tone="error"
                    icon="!"
                    title="연결이 원활하지 않아요"
                    description="네트워크를 확인하고 다시 시도해 주세요."
                    action={{ label: '다시 시도', onClick: teamQuery.retry }}
                  />
                )}
                {teamQuery.status === 'success' && team.length === 0 && (
                  <StatePanel
                    icon="0"
                    title="아직 팀에 포켓몬이 없어요"
                    description="도감에서 포켓몬을 찾아 팀에 추가해 보세요."
                  />
                )}
                {teamQuery.status === 'success' && team.length > 0 && (
                  <TeamSlotList
                    team={team}
                    size={TEAM_SIZE}
                    slotStatus={slotStatus}
                    onDelete={setDeletingId}
                    onRetry={(teamPokemonId) => void deleteMember(teamPokemonId)}
                  />
                )}
              </>
            }
          />

          <Route
            path="/my-team/:teamPokemonId/edit"
            element={
              <TeamEditPage
                team={team}
                status={teamQuery.status}
                onRetry={teamQuery.retry}
                onSave={handleMemberSave}
              />
            }
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

      {toast && <Toast key={toast.id} message={toast.message} tone={toast.tone} />}
    </>
  );
}

export default App;