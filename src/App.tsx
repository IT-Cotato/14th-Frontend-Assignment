import { useState } from 'react';
import PokemonHeader from './components/PokemonHeader';
import PokemonList from './components/PokemonList';
import MyTeamList from './components/MyTeamList';

interface Pokemon {
  number: string;
  name: string;
  type: string;
  role: string;
  image: string;
}

function App() {
  const [team, setTeam] = useState<Pokemon[]>([]);

  const handleAddPokemon = (pokemon: Pokemon) => {
    setTeam((prevTeam) => {
      const isAlreadyInTeam = prevTeam.some(
        (p) => p.number === pokemon.number
      );

      if (isAlreadyInTeam) {
        alert('이미 팀에 추가된 포켓몬입니다!');
        return prevTeam;
      }

      if (prevTeam.length >= 6) {
        alert('팀은 최대 6마리까지만 가질 수 있습니다.');
        return prevTeam;
      }

      return [...prevTeam, pokemon];
    });
  };

  const handleRemovePokemon = (number: string) => {
    setTeam((prevTeam) =>
      prevTeam.filter((pokemon) => pokemon.number !== number)
    );
  };

  return (
    <div className="app-container">
      <PokemonHeader teamCount={team.length} />

      <div className="main-content">
        <div className="cardlist">
          <h3>도감</h3>
          <PokemonList onAdd={handleAddPokemon} />
        </div>
        <div className="teamlist">
          <div className="teamlist-title">
          <h3>나의 팀</h3>
          </div>
        <MyTeamList
          team={team}
          onRemove={handleRemovePokemon}
        />
        </div>
      </div>
    </div>
  );
}

export default App;