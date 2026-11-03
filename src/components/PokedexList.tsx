import PokemonList from './PokemonList';
import Pagination from './Pagination';
import StatePanel from './StatePanel';
import { POKEDEX_PAGE_SIZE } from '../api/pokeapi';
import type { PokedexPage } from '../hooks/usePokedexPage';
import type { Pokemon } from '../types/pokemon';

interface PokedexListProps {
  pokedex: PokedexPage;
  offset: number;
  onOffsetChange: (offset: number) => void;
  teamIds: readonly number[];
  teamLimit: number;
  duplicateName: string | null;
  onAdd: (pokemon: Pokemon) => void;
}

function PokedexList({
  pokedex,
  offset,
  onOffsetChange,
  teamIds,
  teamLimit,
  duplicateName,
  onAdd,
}: PokedexListProps) {
  const { status, pokemons, count, previousOffset, nextOffset, retry, retryCard } = pokedex;

  if (status === 'loading') {
    return (
      <StatePanel
        tone="loading"
        icon="…"
        title="포켓몬을 불러오는 중"
        description="잠시만 기다려 주세요."
      />
    );
  }

  if (status === 'error') {
    return (
      <StatePanel
        tone="error"
        icon="!"
        title="연결이 원활하지 않아요"
        description="네트워크를 확인하고 다시 시도해 주세요."
        action={{ label: '다시 시도', onClick: retry }}
      />
    );
  }

  return (
    <>
      <PokemonList
        pokemons={pokemons}
        teamIds={teamIds}
        teamLimit={teamLimit}
        duplicateName={duplicateName}
        onAdd={onAdd}
        onRetryCard={retryCard}
      />
      <Pagination
        offset={offset}
        limit={POKEDEX_PAGE_SIZE}
        count={count}
        previousOffset={previousOffset}
        nextOffset={nextOffset}
        onChange={onOffsetChange}
      />
    </>
  );
}

export default PokedexList;