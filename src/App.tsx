import PokemonHeader, { HeaderBox, PokemonSearch, PokemonTitle, PokemonReco, PokemonTeam } from './PokemonHeader' 
import { useState } from 'react';
import PokemonList from './PokemonList'
import type { Pokemon } from './PokemonCard';
import TeamSlotList from './TeamSlotList'
//현재 App.tsx와 같은 src 폴더에 있는 PokemonHeader.tsx에서 가져온다.

function App() {
  const [menu, setMenu] = useState<'home' | 'dict' | 'myTeam'>('home');
  const [team, setTeam] = useState<Pokemon[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 포켓몬 한 마리를 팀에 추가하는 이벤트 핸들러
  function handleAddToTeam(pokemon: Pokemon) {
    if (team.length >= 6) return;                        // 6마리 꽉 찼으면 아무것도 안 함
    if (team.some((p) => p.id === pokemon.id)) return;   // 이미 팀에 있는 포켓몬이면 아무것도 안 함
    setTeam([...team, pokemon]);                         // 기존 팀을 펼치고 끝에 새 포켓몬을 붙인 "새 배열"로 교체
  }
    // 팀에서 포켓몬 한 마리 삭제
  function handleRemoveFromTeam(id: number) {
    setTeam(team.filter((p) => p.id !== id));
  }

  // 팀 안의 포켓몬 한 마리의 별명·역할 수정
  function handleUpdateTeamMember(id: number, nickname: string, role: string) {
    setTeam(
      team.map((p) =>
        p.id === id ? { ...p, nickname, role } : p
      )
    );
  }

  return (
      <div className="page-container">
        {menu === 'home' ? (
          <>
            <HeaderBox
            menu="home"
            teamCount={team.length}
            teamMax={6}
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
            onAddToTeam={handleAddToTeam}
            isTeamFull={team.length >= 6}
          />
        </>
        ) : menu === 'dict' ? (
          <>
            <HeaderBox
              menu="dict"
              teamCount={team.length}
              teamMax={6}
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
              onAddToTeam={handleAddToTeam}
              isTeamFull={team.length >= 6}
            />
          </>
        ) : (
          <>
            <HeaderBox
              menu="myTeam"
              teamCount={team.length}
              teamMax={6}
              onMenuChange={setMenu}
            />

            <PokemonTeam
              teamCount={team.length}
              teamMax={6}
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