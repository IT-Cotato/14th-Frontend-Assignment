import { useState } from 'react';
import PokemonHeader from './components/PokemonHeader';
import PokemonList from './components/PokemonList';
import MyTeamGrid from './components/MyTeamGrid';

interface Pokemon {
  number: string;
  name: string;
  type: string;
  image: string;
}

function App() {
  const [team, setTeam] = useState<Pokemon[]>([]);

  // 1) 팀 추가 함수 (중복 방지 + 최대 6마리 제한 + 함수형 업데이트)
  const handleAddPokemon = (pokemon: Pokemon) => {
    const isAlreadyInTeam = team.some((p) => p.number === pokemon.number);
    if (isAlreadyInTeam) {
      alert('이미 팀에 추가된 포켓몬입니다!');
      return;
    }

    if (team.length >= 6) {
      alert('팀은 최대 6마리까지만 가질 수 있습니다.');
      return;
    }

    setTeam((prevTeam) => [...prevTeam, pokemon]);
  };

  // 2) 팀 삭제 함수 (함수형 업데이트)
  const handleRemovePokemon = (number: string) => {
    setTeam((prevTeam) => prevTeam.filter((p) => p.number !== number));
  };

  return (
    <div className="app-container">
      {/* 헤더에 현재 팀 인원수 전달 */}
      <PokemonHeader teamCount={team.length} />

      {/* 나의 팀 가로형 슬롯 영역 (팀 목록과 삭제 함수 전달) */}
      <MyTeamGrid team={team} onRemove={handleRemovePokemon} />

      {/* 포켓몬 목록 (추가 버튼 연결) */}
      <PokemonList onAdd={handleAddPokemon} />
    </div>
  );
}

export default App;