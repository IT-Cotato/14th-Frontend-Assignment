import { useLocation, useParams } from 'react-router';
import Breadcrumb from '../components/Breadcrumb';
import PokemonDetail from '../components/PokemonDetail';
import StatePanel from '../components/StatePanel';
import type { AddStatus } from '../components/PokemonCard';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { formatPokemonNumber } from '../utils/formatNumber';
import type { Pokemon } from '../types/pokemon';

interface PokemonDetailPageProps {
  teamIds: readonly number[];
  teamLimit: number;
  onAdd: (pokemon: Pokemon) => void;
}

function getBackTo(state: unknown): string {
  const from = (state as { from?: unknown } | null)?.from;
  if (typeof from === 'string' && (from === '/pokemon' || from.startsWith('/pokemon?'))) {
    return from;
  }
  return '/pokemon';
}

function PokemonDetailPage({ teamIds, teamLimit, onAdd }: PokemonDetailPageProps) {
  const { pokemonId = '' } = useParams();
  const location = useLocation();
  const { status, pokemon, retry } = usePokemonDetail(pokemonId);

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

  if (status === 'notFound' || !pokemon) {
    return (
      <StatePanel
        tone="error"
        icon="!"
        title="포켓몬을 찾을 수 없어요"
        description="번호나 이름을 확인하거나 도감으로 돌아가세요."
      />
    );
  }

  const addStatus: AddStatus = teamIds.includes(pokemon.id)
    ? 'added'
    : teamIds.length >= teamLimit
      ? 'full'
      : 'available';

  const { id, name, types, imageUrl } = pokemon;

  return (
    <>
      <Breadcrumb
        parentLabel="도감"
        parentTo={getBackTo(location.state)}
        current={formatPokemonNumber(pokemon.id)}
      />
      <PokemonDetail
        pokemon={pokemon}
        addStatus={addStatus}
        onAdd={() => onAdd({ id, name, types, imageUrl })}
      />
    </>
  );
}

export default PokemonDetailPage;