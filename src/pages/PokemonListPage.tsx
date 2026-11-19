import { useState } from 'react';
import { useSearchParams } from 'react-router';
import type { Pokemon } from '../App';
import PokemonHeader from '../components/PokemonHeader';
import PokemonList from '../components/PokemonList';
import MyTeamList from '../components/MyTeamList';

interface PokemonListPageProps {
  team: Pokemon[];
  onAdd: (pokemon: Pokemon) => void;
  onRemove: (number: string) => void;
}

// URL의 ?page= 값을 1 이상의 정수로 정리합니다.
function parsePage(value: string | null): number {
  const page = Math.floor(Number(value));
  return Number.isFinite(page) && page >= 1 ? page : 1;
}

function PokemonListPage({ team, onAdd, onRemove }: PokemonListPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState('ALL');

  // 검색어(q)와 페이지(page)는 URL에 저장해서 새로고침해도 유지됩니다.
  const search = searchParams.get('q') ?? '';
  const page = parsePage(searchParams.get('page'));

  const setSearch = (value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set('q', value);
        } else {
          next.delete('q');
        }
        // 검색어가 바뀌면 1페이지부터 다시 봅니다.
        next.delete('page');
        return next;
      },
      // 글자마다 방문 기록이 쌓이지 않도록 현재 기록을 교체합니다.
      { replace: true }
    );
  };

  const setPage = (nextPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nextPage <= 1) {
        next.delete('page');
      } else {
        next.set('page', String(nextPage));
      }
      return next;
    });
  };

  return (
    <>
      <PokemonHeader
        search={search}
        setSearch={setSearch}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />

      <div className="main-content">
        <div className="cardlist">
          <PokemonList
            onAdd={onAdd}
            search={search}
            selectedType={selectedType}
            page={page}
            onPageChange={setPage}
          />
        </div>

        <div className="teamlist">
          <div className="teamlist-title">
            <h3>나의 팀</h3>
          </div>

          <MyTeamList team={team} onRemove={onRemove} />
        </div>
      </div>
    </>
  );
}

export default PokemonListPage;
