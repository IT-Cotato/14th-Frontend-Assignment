import PokemonHeader, { HeaderBox, PokemonSearch, PokemonTitle, PokemonReco, PokemonTeam } from './PokemonHeader'
import { useState, useEffect } from 'react';
import PokemonList from './PokemonList'
import type { Pokemon } from './PokemonCard';
import TeamSlotList from './TeamSlotList'
import TeamSidebar from './TeamSidebar';
// 현재 App.tsx와 같은 src 폴더에 있는 파일들에서 가져온다.

// 팀 최대 인원. 여기 한 군데만 바꾸면 앱 전체에 적용됨
const TEAM_MAX = 6;

// 브라우저 메모장의 칸 이름. 저장,불러오기 두 곳에서 쓰니까 한 군데로 모음
const STORAGE_KEY = 'pokemate-team';

// loadTeam이 돌려주는 상자의 모양: 팀 배열 + 복구했는지 여부
type LoadResult = {
  team: Pokemon[];      // 꺼내온 팀 (망가졌으면 빈 팀)
  recovered: boolean;   // 망가진 값을 빈 팀으로 복구했으면 true
};

// 브라우저 메모장에서 저장된 팀을 꺼내오는 함수
function loadTeam(): LoadResult {
  const saved = localStorage.getItem(STORAGE_KEY);   // 글자 또는 null

  // 저장된 게 없으면: 처음 쓰는 거라 정상 → 안내 필요 없음
  if (saved === null) {
    return { team: [], recovered: false };
  }

  try {
    const parsed = JSON.parse(saved);   // 글자 → 배열로 바꿔보기

    // 배열이 아니면 (예: 123, "hello") → 손상
    if (!Array.isArray(parsed)) {
      return { team: [], recovered: true };
    }

    // 안에 든 것 중 하나라도 포켓몬처럼 안 생겼으면 (예: [null]) → 손상
    if (!parsed.every((p) => p !== null && typeof p.id === 'number')) {
      return { team: [], recovered: true };
    }

    // 배열이고 안에 든 것도 다 정상 → 그대로 사용
    return { team: parsed, recovered: false };
  } catch {
    // 글자 자체가 깨져서 parse 실패 (예: abc{{) → 손상
    return { team: [], recovered: true };
  }
}

// 앱 파일이 처음 읽힐 때 딱 한 번 메모장을 확인 (팀 + 복구 여부 둘 다 여기서 얻음)
const initialLoad = loadTeam();

// 저장 데이터 복구 안내 패널
function RecoverNotice({ onClose }: { onClose: () => void }) {
  return (
    <div className='recover-box'>
      <div className='recover-mark-box'>
        <span className='recover-mark'>!</span>
      </div>
      <h3 className='recover-title'>저장된 팀을 불러오지 못했어요</h3>
      <p className='recover-desc'>저장 데이터가 손상되어 빈 팀으로 시작해요.</p>
      <button className='recover-button' onClick={onClose}>확인</button>
    </div>
  );
}

function App() {
  // 지금 보고 있는 화면 (홈 / 도감 / 내 팀)
  const [menu, setMenu] = useState<'home' | 'dict' | 'myTeam'>('home');
  // 현재 팀 배열 (앱 전체에서 팀 데이터의 진짜 주인) — 처음 값은 메모장에서 꺼낸 팀
  const [team, setTeam] = useState<Pokemon[]>(initialLoad.team);
  // 검색창에 지금 타이핑 중인 글자
  const [searchInput, setSearchInput] = useState('');
  // 검색 버튼을 눌러서 확정된 검색어 (목록 필터에 실제로 쓰임)
  const [searchKeyword, setSearchKeyword] = useState('');
  // 정렬 (오름차순, 내림차순)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  // 선택한 타입
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  // 중복 추가를 시도한 포켓몬 이름. 안내가 필요 없으면 null
  const [duplicateName, setDuplicateName] = useState<string | null>(null);
  // 복구 안내를 보여줄지. 처음엔 "복구했으면 true", 확인 누르면 false
  const [showRecoverNotice, setShowRecoverNotice] = useState<boolean>(initialLoad.recovered);

  // 팀이 꽉 찼는지. 여러 곳에서 쓰니까 한 번만 계산
  const isTeamFull = team.length >= TEAM_MAX;

  // 팀이 바뀔 때마다 브라우저 메모장(localStorage)에 저장
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(team));
    } catch {
      // 저장 실패(용량 초과, 시크릿 모드 등)해도 앱이 죽지 않게
      console.warn('팀 저장에 실패했어요.');
    }
  }, [team]);

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

  // 복구 안내 패널 (보여줘야 할 때만). 세 화면 모두 헤더 바로 아래에 넣음
  const recoverNotice = showRecoverNotice && (
    <RecoverNotice onClose={() => setShowRecoverNotice(false)} />
  );

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

          {recoverNotice}

          <PokemonHeader />
          <PokemonSearch
            search={searchInput}
            onSearchChange={setSearchInput}
            onSearch={() => setSearchKeyword(searchInput)}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            selectedType={selectedTypes}
            onTypeChange={setSelectedTypes}
          />
          <PokemonReco />
          <PokemonList
            search={searchKeyword}
            team={team}                        // 팀 배열 전달 (카드마다 추가됐는지 판단용)
            onAddToTeam={handleAddToTeam}
            isTeamFull={isTeamFull}
            duplicateName={duplicateName}      // 중복 안내용 이름 전달
            sortOrder={sortOrder}
            selectedType={selectedTypes}
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

          {recoverNotice}

          <PokemonTitle
            teamCount={team.length}
            teamMax={TEAM_MAX}
          />
          <PokemonSearch
            search={searchInput}
            onSearchChange={setSearchInput}
            onSearch={() => setSearchKeyword(searchInput)}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            selectedType={selectedTypes}
            onTypeChange={setSelectedTypes}
          />

          <div className='dict-content-box'>
            <PokemonList
              search={searchKeyword}
              team={team}
              onAddToTeam={handleAddToTeam}
              isTeamFull={isTeamFull}
              duplicateName={duplicateName}      // 중복 안내용 이름 전달
              sortOrder={sortOrder}
              selectedType={selectedTypes}
            />

            <TeamSidebar
              team={team}
              onRemove={handleRemoveFromTeam}
              onUpdate={handleUpdateTeamMember}
            />
          </div>
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

          {recoverNotice}

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