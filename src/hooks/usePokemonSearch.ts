import { useEffect, useState } from 'react';
import { fetchPokemonByIdOrName, isAbortError, isNotFoundError } from '../api/pokeapi';
import type { Pokemon } from '../types/pokemon';


export type SearchStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

interface SearchResult {
  query: string;
  attempt: number;
  status: 'success' | 'empty' | 'error';
  pokemon: Pokemon | null;
}


export function usePokemonSearch(query: string) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<SearchResult | null>(null);

  useEffect(() => {
    if (query === '') return;

    const controller = new AbortController();

    fetchPokemonByIdOrName(query, controller.signal)
      .then((pokemon) => setResult({ query, attempt, status: 'success', pokemon }))
      .catch((error: unknown) => {
        if (isAbortError(error)) return;
        setResult({
          query,
          attempt,
          status: isNotFoundError(error) ? 'empty' : 'error',
          pokemon: null,
        });
      });

    return () => controller.abort();
  }, [query, attempt]);

  const isCurrent = result !== null && result.query === query && result.attempt === attempt;
  let status: SearchStatus = 'loading';
  if (query === '') status = 'idle';
  else if (isCurrent) status = result.status;

  function retry() {
    setAttempt((prev) => prev + 1);
  }

  return { status, pokemon: isCurrent ? result.pokemon : null, retry };
}