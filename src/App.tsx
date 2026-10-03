import PokemonHeader, { HeaderBox, PokemonSearch, PokemonTitle, PokemonReco, PokemonTeam } from './PokemonHeader'
import { useState } from 'react';
import PokemonList from './PokemonList'
import type { Pokemon } from './PokemonCard';
import TeamSlotList from './TeamSlotList'
// 현재 App.tsx와 같은 src 폴더에 있는 파일들에서 가져온다.

// 팀 최대 인원. 여기 한 군데만 바꾸면 앱 전체에 적용됨
const TEAM_MAX = 6;

function App() {
  // 지금 보고 있는 화면 (홈 / 도감 / 내 팀)
  const [menu, setMenu] = useState<'home' | 'dict' | 'myTeam'>('home');
  // 현재 팀 배열 (앱 전체에서 팀 데이터의 진짜 주인)
  const [team, setTeam] = useState<Pokemon[]>([]);
  // 검색창에 지금 타이핑 중인 글자
  const [searchInput, setSearchInput] = useState('');
  // 검색 버튼을 눌러서 확정된 검색어 (목록 필터에 실제로 쓰임)
  const [searchKeyword, setSearchKeyword] = useState('');
  // 중복 추가를 시도한 포켓몬 이름. 안내가 필요 없으면 null
  const [duplicateName, setDuplicateName] = useState<string | null>(null);

  // 팀이 꽉 찼는지. 여러 곳에서 쓰니까 한 번만 계산
  const isTeamFull = team.length >= TEAM_MAX;

  // 포켓몬 한 마리를 팀에 추가하는 이벤트 핸들러
  function handleAddToTeam(pokemon: Pokemon) {
    // 이미 팀에 있으면 → 이름을 기억해서 안내 박스 띄우고 끝
    if (team.some((p) => p.id === pokemon.id)) {
      setDuplicateName(pokemon.name);
      return;
    }
    if (isTeamFull) return;                // 꽉 찼으면 아무것도 안 함 (안전장치)
    setTeam([...team, pokemon]);           // 기존 팀을 펼치고 끝에 새 포켓몬을 붙인 "새 배열"로 교체
    setDuplicateName(null);                // 정상 추가했으면 중복 안내 지우기
  }

  // 팀에서 포켓몬 한 마리 삭제
  function handleRemoveFromTeam(id: number) {
    setTeam(team.filter((p) => p.id !== id));   // 그 id만 빼고 나머지로 새 배열
    setDuplicateName(null);                     // 팀 구성이 바뀌었으니 중복 안내 지우기
  }

  // 팀 안의 포켓몬 한 마리의 별명·역할 수정
  function handleUpdateTeamMember(id: number, nickname: string, role: string) {
    setTeam(
      team.map((p) =>
        p.id === id ? { ...p, nickname, role } : p   // 그 id만 별명·역할 바꾼 복사본, 나머지는 그대로
      )
    );
  }

  return (
    <div className="page-container">
      {menu === 'home' ? (
        // ===== 홈 화면 =====
        <>
          <HeaderBox
            menu="home"
            teamCount={team.length}
            teamMax={TEAM_MAX}
            onMenuChange={setMenu}
          />

          <PokemonHeader />
          <PokemonSearch
            search={searchInput}
            onSearchChange={setSearchInput}
            onSearch={() => setSearchKeyword(searchInput)}
          />
          <PokemonReco />
          <PokemonList
            search={searchKeyword}
            team={team}                        // 팀 배열 전달 (카드마다 추가됐는지 판단용)
            onAddToTeam={handleAddToTeam}
            isTeamFull={isTeamFull}
            duplicateName={duplicateName}      // 중복 안내용 이름 전달
          />
        </>
      ) : menu === 'dict' ? (
        // ===== 도감 화면 =====
        <>
          <HeaderBox
            menu="dict"
            teamCount={team.length}
            teamMax={TEAM_MAX}
            onMenuChange={setMenu}
          />

          <PokemonTitle />
          <PokemonSearch
            search={searchInput}
            onSearchChange={setSearchInput}
            onSearch={() => setSearchKeyword(searchInput)}
          />

          <PokemonList
            search={searchKeyword}
            team={team}
            onAddToTeam={handleAddToTeam}
            isTeamFull={isTeamFull}
            duplicateName={duplicateName}      // 중복 안내용 이름 전달
          />
        </>
      ) : (
        // ===== 내 팀 화면 =====
        <>
          <HeaderBox
            menu="myTeam"
            teamCount={team.length}
            teamMax={TEAM_MAX}
            onMenuChange={setMenu}
          />

          <PokemonTeam
            teamCount={team.length}
            teamMax={TEAM_MAX}
          />
          <TeamSlotList
            team={team}
            onRemove={handleRemoveFromTeam}
            onUpdate={handleUpdateTeamMember}
          />
        </>
      )}
    </div>
  );
}

export default App