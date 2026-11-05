import { useQueries } from '@tanstack/react-query';
import {
    fetchPokemonDetail,
    type PokemonListItem,
} from '../api/pokemon';

export function usePokemonDetails(items: PokemonListItem[]) {
    return useQueries({
        queries: items.map((item) => {
            return {
                queryKey: ['pokemon', 'detail', item.url],
                queryFn: () => fetchPokemonDetail(item.url),
            }
        })
    })
}