import { useEffect, useState } from 'react';
import PokemonList from './PokemonList';
import StatePanel from './StatePanel';
import {
  fetchPokemonByUrl,
  fetchPokemonList,
  getIdFromUrl,
  isAbortError,
} from '../api/pokeapi';
import type { Pokemon } from '../types/pokemon';

interface PokedexCard {
  url: string;
  id: number;
  pokemon: Pokemon | null;
}

type ListState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; cards: PokedexCard[] };

interface PokedexListProps {
  teamIds: readonly number[];
  teamLimit: number;
  duplicateName: string | null;
  onAdd: (pokemon: Pokemon) => void;
}

async function loadPokedex(signal: AbortSignal): Promise<PokedexCard[]> {
  const items = await fetchPokemonList(signal);
  const results = await Promise.allSettled(
    items.map((item) => fetchPokemonByUrl(item.url, signal)),
  );

  return items.map((item, index) => {
    const result = results[index];
    return {
      url: item.url,
      id: getIdFromUrl(item.url),
      pokemon: result.status === 'fulfilled' ? result.value : null,
    };
  });
}

function PokedexList({ teamIds, teamLimit, duplicateName, onAdd }: PokedexListProps) {
  const [listState, setListState] = useState<ListState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    loadPokedex(controller.signal)
      .then((cards) => {
        if (controller.signal.aborted) return;
        setListState({ status: 'success', cards });
      })
      .catch((error: unknown) => {
        if (isAbortError(error)) return;
        setListState({ status: 'error' });
      });

    return () => controller.abort();
  }, [attempt]);

  function handleRetry() {
    setListState({ status: 'loading' });
    setAttempt((prev) => prev + 1);
  }

  async function handleRetryCard(id: number) {
    if (listState.status !== 'success') return;
    const card = listState.cards.find((item) => item.id === id);
    if (!card) return;

    try {
      const pokemon = await fetchPokemonByUrl(card.url);
      setListState((prev) =>
        prev.status === 'success'
          ? {
              ...prev,
              cards: prev.cards.map((item) => (item.id === id ? { ...item, pokemon } : item)),
            }
          : prev,
      );
    } catch {
      // 다시 실패하면 Error 카드를 그대로 둠
    }
  }

  if (listState.status === 'loading') {
    return (
      <StatePanel
        tone="loading"
        icon="…"
        title="포켓몬을 불러오는 중"
        description="잠시만 기다려 주세요."
      />
    );
  }

  if (listState.status === 'error') {
    return (
      <StatePanel
        tone="error"
        icon="!"
        title="연결이 원활하지 않아요"
        description="네트워크를 확인하고 다시 시도해 주세요."
        action={{ label: '다시 시도', onClick: handleRetry }}
      />
    );
  }

  return (
    <PokemonList
      pokemons={listState.cards.map((card) => card.pokemon ?? { id: card.id, failed: true })}
      teamIds={teamIds}
      teamLimit={teamLimit}
      duplicateName={duplicateName}
      onAdd={onAdd}
      onRetryCard={handleRetryCard}
    />
  );
}

export default PokedexList;