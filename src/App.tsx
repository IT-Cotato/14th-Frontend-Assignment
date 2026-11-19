import { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router';
import AppHeader from './components/AppHeader';
import PokemonListPage from './pages/PokemonListPage';
import PokemonDetailPage from './pages/PokemonDetailPage';
import MyTeamPage from './pages/MyTeamPage';
import TeamEditPage from './pages/TeamEditPage';
import NotFoundPage from './pages/NotFoundPage';

export interface Pokemon {
  number: string;
  name: string;
  type: string;
  types?: string[];
  role: string;
  image: string;
  nickname?: string;
}

function App() {
  const [team, setTeam] = useState<Pokemon[]>(() => {
    const savedTeam = localStorage.getItem('myTeam');

    return savedTeam ? JSON.parse(savedTeam) : [];
  });

  useEffect(() => {
    localStorage.setItem('myTeam', JSON.stringify(team));
  }, [team]);

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

  const handleEditPokemon = (
    number: string,
    nickname: string,
    role: string
  ) => {
    setTeam((prevTeam) =>
      prevTeam.map((pokemon) =>
        pokemon.number === number
          ? { ...pokemon, nickname, role }
          : pokemon
      )
    );
  };

  return (
    <Routes>
      <Route element={<Layout teamCount={team.length} />}>
        {/* 첫 화면 없이 바로 도감으로 이동 */}
        <Route index element={<Navigate to="/pokemon" replace />} />
        <Route
          path="pokemon"
          element={
            <PokemonListPage
              team={team}
              onAdd={handleAddPokemon}
              onRemove={handleRemovePokemon}
            />
          }
        />
        <Route
          path="pokemon/:pokemonId"
          element={<PokemonDetailPage onAdd={handleAddPokemon} />}
        />
        <Route
          path="my-team"
          element={<MyTeamPage team={team} onRemove={handleRemovePokemon} />}
        />
        <Route
          path="my-team/:teamPokemonId/edit"
          element={<TeamEditPage team={team} onEdit={handleEditPokemon} />}
        />
        {/* 위에서 정의하지 않은 모든 경로 → 경로 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

// 모든 화면에 공통으로 들어가는 헤더 + 현재 경로의 화면(Outlet)
function Layout({ teamCount }: { teamCount: number }) {
  return (
    <div className="app-container">
      <AppHeader teamCount={teamCount} />
      <Outlet />
    </div>
  );
}

export default App;