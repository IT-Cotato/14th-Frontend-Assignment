import { useQuery } from '@tanstack/react-query';
import { fetchPokemonList } from '../api/pokemon';

export function usePokemonList(
    limit: number,
    offset: number,
    enabled: boolean
) {
    return useQuery({
        queryKey: ['pokemon', 'list', { limit, offset }],
        queryFn: () => fetchPokemonList(limit, offset),
        enabled: enabled,
})};
