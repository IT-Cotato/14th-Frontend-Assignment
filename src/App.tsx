import { useState } from 'react';
import Header, { type NavItem } from './components/Header';
import PokemonHeader from './components/PokemonHeader';
import PokedexTitle from './components/PokedexTitle';
import SearchBar from './components/SearchBar';
import PokemonList from './components/PokemonList';
import TeamTitle from './components/TeamTitle';
import TeamSlotList from './components/TeamSlotList';
import EditDialog from './components/EditDialog';
import ConfirmDialog from './components/ConfirmDialog';
import Toast from './components/Toast';
import { POKEMONS } from './data/pokemons';
import { INITIAL_TEAM, TEAM_SIZE } from './data/team';
import { withObjectParticle } from './utils/josa';
import type { Pokemon, TeamMember, TeamRole } from './types/pokemon';
import pikachu from './assets/Pikachu.png';

const RECOMMENDED_POKEMONS = POKEMONS.slice(0, 4);
const TOAST_DURATION = 2000;
const NOTICE_DURATION = 3000;

function App() {
  const [page, setPage] = useState<NavItem>('홈');
  // team: 화면에서 편집 중인 팀 / savedTeam: 마지막으로 "팀 저장"한 팀
  const [team, setTeam] = useState<readonly TeamMember[]>(INITIAL_TEAM);
  const [savedTeam, setSavedTeam] = useState<readonly TeamMember[]>(INITIAL_TEAM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  // 중복 추가를 거절했을 때 안내할 포켓몬 이름 (3초 뒤 사라짐)
  const [duplicateNotice, setDuplicateNotice] = useState<{ id: number; name: string } | null>(null);

  const teamIds = team.map((member) => member.pokemon.id);
  const editingIndex = team.findIndex((member) => member.pokemon.id === editingId);
  const deletingMember = team.find((member) => member.pokemon.id === deletingId);

  function navigate(nextPage: NavItem) {
    setPage(nextPage);
    setDuplicateNotice(null);
  }

  function showDuplicateNotice(name: string) {
    const id = Date.now();
    setDuplicateNotice({ id, name });
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
      return [...prev, { pokemon, nickname: '' }];
    });
    setDuplicateNotice(null);
    showToast(`${withObjectParticle(pokemon.name)} 팀에 추가했어요.`);
  }

  function handleEditSave(nickname: string, role: TeamRole | undefined) {
    setTeam((prev) =>
      prev.map((member) =>
        member.pokemon.id === editingId ? { ...member, nickname, role } : member,
      ),
    );
    setEditingId(null);
  }

  function handleDeleteConfirm() {
    setTeam((prev) => prev.filter((member) => member.pokemon.id !== deletingId));
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
        <Header
          activeNav={page}
          teamCount={team.length}
          teamLimit={TEAM_SIZE}
          onNavigate={navigate}
        />

        {page === '홈' && (
          <>
            <PokemonHeader
              badge="오늘의 추천"
              title="포켓몬과 함께하는 하루"
              description="좋아하는 포켓몬을 찾고 나만의 팀을 만들어 보세요."
              heroImageUrl={pikachu}
              heroImageName="피카츄"
              onPokedexClick={() => navigate('도감')}
              onTeamClick={() => navigate('내 팀')}
            />
            <SearchBar placeholder="이름 또는 번호" />
            <PokemonList
              title="추천 포켓몬"
              moreLabel="전체 보기"
              pokemons={RECOMMENDED_POKEMONS}
              teamIds={teamIds}
              teamLimit={TEAM_SIZE}
              duplicateName={duplicateNotice?.name ?? null}
              onAdd={handleAdd}
              onMoreClick={() => navigate('도감')}
            />
          </>
        )}

        {page === '도감' && (
          <>
            <PokedexTitle
              title="포켓몬 도감"
              description="다양한 포켓몬을 만나고 팀에 추가해 보세요."
              totalCount={151}
            />
            <SearchBar placeholder="이름 또는 번호" />
            <PokemonList
              pokemons={POKEMONS}
              teamIds={teamIds}
              teamLimit={TEAM_SIZE}
              duplicateName={duplicateNotice?.name ?? null}
              onAdd={handleAdd}
            />
          </>
        )}

        {page === '내 팀' && (
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
              editingId={editingId}
              onEdit={setEditingId}
              onDelete={setDeletingId}
            />
          </>
        )}
      </div>

      {editingIndex !== -1 && (
        <EditDialog
          key={editingId}
          member={team[editingIndex]}
          slotNumber={editingIndex + 1}
          onCancel={() => setEditingId(null)}
          onSave={handleEditSave}
        />
      )}

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