import PokemonList from './PokemonList';
import StatePanel from './StatePanel';
import type { SearchStatus } from '../hooks/usePokemonSearch';
import type { Pokemon } from '../types/pokemon';

interface PokedexSearchResultProps {
  status: SearchStatus;
  pokemon: Pokemon | null;
  onRetry: () => void;
  teamIds: readonly number[];
  teamLimit: number;
  duplicateName: string | null;
  onAdd: (pokemon: Pokemon) => void;
}

function PokedexSearchResult({
  status,
  pokemon,
  onRetry,
  teamIds,
  teamLimit,
  duplicateName,
  onAdd,
}: PokedexSearchResultProps) {
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
        action={{ label: '다시 시도', onClick: onRetry }}
      />
    );
  }
  return (
    <PokemonList
      pokemons={pokemon ? [pokemon] : []}
      teamIds={teamIds}
      teamLimit={teamLimit}
      duplicateName={duplicateName}
      onAdd={onAdd}
    />
  );
}

export default PokedexSearchResult;