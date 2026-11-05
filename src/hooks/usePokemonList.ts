import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { Pokemon } from '../App';

const POKE_API_URL = 'https://pokeapi.co/api/v2/pokemon';

interface PokemonListItem {
  name: string;
  url: string;
}

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

interface PokemonDetailResponse {
  id: number;
  name: string;
  types: Array<{ type: { name: string } }>;
  sprites: {
    front_default: string | null;
  };
}

export interface FailedPokemon {
  number: string;
  name: string;
  url: string;
}

export interface PokemonPage {
  count: number;
  pokemons: Pokemon[];
  failedDetails: FailedPokemon[];
  next: string | null;
  previous: string | null;
}

function toPokemon(detail: PokemonDetailResponse): Pokemon {
  const image = detail.sprites.front_default;

  if (!image) {
    throw new Error(`${detail.name}의 이미지가 없습니다.`);
  }

  return {
    number: `#${String(detail.id).padStart(4, '0')}`,
    name: detail.name,
    type: detail.types[0]?.type.name.toUpperCase() ?? 'UNKNOWN',
    types: detail.types.map(({ type }) => type.name.toUpperCase()),
    role: '일반',
    image,
  };
}

async function fetchPokemonDetail(
  pokemon: PokemonListItem,
  signal: AbortSignal
): Promise<Pokemon> {
  const response = await fetch(pokemon.url, { signal });

  if (!response.ok) {
    throw new Error(`포켓몬 상세 정보 요청 실패: ${response.status}`);
  }

  return toPokemon((await response.json()) as PokemonDetailResponse);
}

async function fetchPokemonPage(
  limit: number,
  offset: number,
  signal: AbortSignal
): Promise<PokemonPage> {
  const response = await fetch(`${POKE_API_URL}?limit=${limit}&offset=${offset}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`포켓몬 목록 요청 실패: ${response.status}`);
  }

  const list = (await response.json()) as PokemonListResponse;
  const details = await Promise.allSettled(
    list.results.map((pokemon) => fetchPokemonDetail(pokemon, signal))
  );
  if (signal.aborted) {
    throw new DOMException('요청이 취소되었습니다.', 'AbortError');
  }
  const pokemons: Pokemon[] = [];
  const failedDetails: FailedPokemon[] = [];

  details.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      pokemons.push(result.value);
      return;
    }

    failedDetails.push({
      number: `#${String(offset + index + 1).padStart(4, '0')}`,
      name: list.results[index].name,
      url: list.results[index].url,
    });
  });

  return {
    count: list.count,
    pokemons,
    failedDetails,
    next: list.next,
    previous: list.previous,
  };
}

export function getPageParams(url: string | null): { limit: number; offset: number } | null {
  if (!url) {
    return null;
  }

  const params = new URL(url).searchParams;
  return {
    limit: Number(params.get('limit')),
    offset: Number(params.get('offset')),
  };
}

export function usePokemonList(limit: number, offset: number) {
  const queryClient = useQueryClient();
  const queryKey = ['pokemons', { limit, offset }] as const;
  const query = useQuery({
    queryKey,
    queryFn: ({ signal }) => fetchPokemonPage(limit, offset, signal),
    placeholderData: keepPreviousData,
  });

  const retryPokemonDetail = async (failedPokemon: FailedPokemon) => {
    const pokemon = await fetchPokemonDetail(
      { name: failedPokemon.name, url: failedPokemon.url },
      new AbortController().signal
    );

    queryClient.setQueryData<PokemonPage>(queryKey, (currentPage) => {
      if (!currentPage) {
        return currentPage;
      }

      return {
        ...currentPage,
        pokemons: [...currentPage.pokemons, pokemon],
        failedDetails: currentPage.failedDetails.filter(
          ({ url }) => url !== failedPokemon.url
        ),
      };
    });
  };

  return {
    ...query,
    retryPokemonDetail,
    getPageParams,
  };
}

export function usePokemonSearch(search: string) {
  const normalizedSearch = search.trim().toLowerCase().replace(/^#/, '');

  return useQuery({
    queryKey: ['pokemon-search', normalizedSearch],
    queryFn: async ({ signal }) => {
      if (!Number.isNaN(Number(normalizedSearch))) {
        const response = await fetch(
          `${POKE_API_URL}/${encodeURIComponent(normalizedSearch)}`,
          { signal }
        );

        if (response.status === 404) {
          return [];
        }

        if (!response.ok) {
          throw new Error(`포켓몬 상세 정보 요청 실패: ${response.status}`);
        }

        return [
          toPokemon((await response.json()) as PokemonDetailResponse),
        ];
      }

      const response = await fetch(
        `${POKE_API_URL}?limit=2000&offset=0`,
        { signal }
      );

      if (!response.ok) {
        throw new Error(`포켓몬 목록 요청 실패: ${response.status}`);
      }

      const list = (await response.json()) as PokemonListResponse;
      const matchedPokemons = list.results.filter(({ name }) =>
        name.includes(normalizedSearch)
      );

      const details = await Promise.allSettled(
        matchedPokemons.map((pokemon) => fetchPokemonDetail(pokemon, signal))
      );

      return details
        .filter(
          (result): result is PromiseFulfilledResult<Pokemon> =>
            result.status === 'fulfilled'
        )
        .map((result) => result.value);
    },
    enabled: normalizedSearch.length > 0,
    retry: false,
  });
}
