import { useEffect, useState } from 'react';
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
import StatePanel from './components/StatePanel';
import { POKEMONS } from './data/pokemons';
import { TEAM_SIZE } from './data/team';
import { withObjectParticle } from './utils/josa';
import { matchesKeyword } from './utils/searchPokemons';
import { loadTeam, saveTeam } from './utils/teamStorage';
import type { Pokemon, PokemonType, SortOrder, TeamMember, TeamRole } from './types/pokemon';
import pikachu from './assets/Pikachu.png';
import TeamPanel from './components/TeamPanel';
import FilterDialog from './components/FilterDialog';


const RECOMMENDED_POKEMONS = POKEMONS.slice(0, 4);
const POKEDEX_TYPES: readonly PokemonType[] = [...new Set(POKEMONS.flatMap((pokemon) => pokemon.types))];
const INITIAL_LOAD = loadTeam();
const TOAST_DURATION = 2000;
const NOTICE_DURATION = 3000;

function App() {
  const [page, setPage] = useState<NavItem>('홈');
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<readonly PokemonType[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder | null>(null);
  const [team, setTeam] = useState<readonly TeamMember[]>(INITIAL_LOAD.team);
  const [savedTeam, setSavedTeam] = useState<readonly TeamMember[]>(INITIAL_LOAD.team);
  const [showRecoverNotice, setShowRecoverNotice] = useState(INITIAL_LOAD.recovered);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const [duplicateNotice, setDuplicateNotice] = useState<{ id: number; name: string } | null>(null);

  const teamIds = team.map((member) => member.pokemon.id);
  const filteredPokemons = POKEMONS.filter(
    (pokemon) =>
      matchesKeyword(pokemon, searchKeyword) &&
      (selectedTypes.length === 0 || pokemon.types.some((type) => selectedTypes.includes(type))),
  );
  const visiblePokemons =
    sortOrder === null
      ? filteredPokemons
      : [...filteredPokemons].sort((a, b) => (sortOrder === 'asc' ? a.id - b.id : b.id - a.id));
  const editingIndex = team.findIndex((member) => member.pokemon.id === editingId);
  const deletingMember = team.find((member) => member.pokemon.id === deletingId);

  useEffect(() => {
    saveTeam(team);
  }, [team]);

  function navigate(nextPage: NavItem) {
    setPage(nextPage);
    setDuplicateNotice(null);
  }

  
  function handleSearch() {
    setSearchKeyword(searchInput);
  }

  function handleHomeSearch() {
    setSelectedTypes([]);
    setSortOrder(null);
    handleSearch();
    navigate('도감');
  }

  // 칩을 누르면 고른 목록에 넣고, 이미 있으면 뺌 (기존 배열을 바꾸지 않고 새 배열로 교체)
  function handleToggleType(type: PokemonType) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type],
    );
  }

  function handleToggleSort(order: SortOrder) {
    setSortOrder((prev) => (prev === order ? null : order));
  }

  
  function handleResetConditions() {
    setSearchInput('');
    setSearchKeyword('');
    setSelectedTypes([]);
    setSortOrder(null);
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

        
        {showRecoverNotice && (
          <StatePanel
            tone="error"
            icon="!"
            title="저장된 팀을 불러오지 못했어요"
            description="저장 데이터가 손상되어 기본 팀으로 복구했어요."
            action={{ label: '확인', onClick: () => setShowRecoverNotice(false) }}
          />
        )}

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
            <SearchBar
              placeholder="이름 또는 번호"
              value={searchInput}
              onChange={setSearchInput}
              onSearch={handleHomeSearch}
            />
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
              title="포켓몬을 찾고 팀을 완성하세요"
              description="도감과 나의 팀을 한 화면에서 관리할 수 있어요."
              teamCount={team.length}
              teamLimit={TEAM_SIZE}
            />
            <SearchBar
              placeholder="피카츄 또는 25"
              value={searchInput}
              onChange={setSearchInput}
              onSearch={handleSearch}
              onFilterClick={() => setIsFilterOpen(true)}
            />
            <div className="pokedex-layout">
              <section className="pokedex-layout__list">
                <h2 className="pokedex-layout__heading">도감</h2>
                <PokemonList
                  pokemons={visiblePokemons}
                  teamIds={teamIds}
                  teamLimit={TEAM_SIZE}
                  duplicateName={duplicateNotice?.name ?? null}
                  onAdd={handleAdd}
                  onReset={handleResetConditions}
                />
              </section>
              <TeamPanel
                team={team}
                editingId={editingId}
                onEdit={setEditingId}
                onDelete={setDeletingId}
              />
            </div>
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
      {isFilterOpen && (
        <FilterDialog
          types={POKEDEX_TYPES}
          selectedTypes={selectedTypes}
          onToggleType={handleToggleType}
          sortOrder={sortOrder}
          onToggleSort={handleToggleSort}
          onClose={() => setIsFilterOpen(false)}
        />
      )}

      {toast && <Toast key={toast.id} message={toast.message} />}
    </>
  );
}

export default App;