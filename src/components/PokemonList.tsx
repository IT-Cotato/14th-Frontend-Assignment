import { useEffect, useMemo, useState } from 'react';
import PokemonCard from './PokemonCard';
import type { Pokemon } from '../App';

const POKE_API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=151&offset=0';

interface PokemonListResponse {
  results: Array<{ name: string; url: string }>;
}

interface PokemonDetailResponse {
  id: number;
  name: string;
  types: Array<{ slot: number; type: { name: string } }>;
  sprites: {
    front_default: string | null;
  };
}

interface PokemonListProps {
  onAdd: (pokemon: Pokemon) => void;
  search: string;
  selectedType: string;
}

interface FailedPokemon {
  number: string;
  name: string;
}

function getPokemonDetail(
  pokemon: { name: string; url: string },
  signal: AbortSignal
): Promise<Pokemon> {
  return fetch(pokemon.url, { signal }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`포켓몬 상세 정보 요청 실패: ${response.status}`);
    }

    const detail = (await response.json()) as PokemonDetailResponse;
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
  });
}

function PokemonList({
  onAdd,
  search,
  selectedType,
}: PokemonListProps) {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [failedDetails, setFailedDetails] = useState<FailedPokemon[]>([]);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let isCurrentRequest = true;

    const loadPokemons = async () => {
      setIsLoading(true);
      setError(null);
      setFailedDetails([]);

      try {
        const response = await fetch(POKE_API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`포켓몬 목록 요청 실패: ${response.status}`);
        }

        const list = (await response.json()) as PokemonListResponse;
        const details = await Promise.allSettled(
          list.results.map((pokemon) =>
            getPokemonDetail(pokemon, controller.signal)
          )
        );

        if (!isCurrentRequest) {
          return;
        }

        const successfulPokemons: Pokemon[] = [];
        const failedPokemonDetails: FailedPokemon[] = [];

        details.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            successfulPokemons.push(result.value);
            return;
          }

          failedPokemonDetails.push({
            number: `#${String(index + 1).padStart(4, '0')}`,
            name: list.results[index].name,
          });
        });

        setPokemons(successfulPokemons);
        setFailedDetails(failedPokemonDetails);
      } catch (requestError) {
        if (
          !isCurrentRequest ||
          (requestError instanceof DOMException &&
            requestError.name === 'AbortError')
        ) {
          return;
        }

        setPokemons([]);
        setError(
          requestError instanceof Error
            ? requestError.message
            : '포켓몬을 불러오지 못했습니다.'
        );
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      }
    };

    void loadPokemons();

    return () => {
      isCurrentRequest = false;
      controller.abort();
    };
  }, [retryCount]);

  const filteredPokemons = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return pokemons.filter((pokemon) => {
      const matchesSearch =
        normalizedSearch === '' ||
        pokemon.name.toLowerCase().includes(normalizedSearch) ||
        pokemon.number.replace('#', '').includes(normalizedSearch);
      const matchesType =
        selectedType === 'ALL' ||
        pokemon.types?.includes(selectedType) ||
        pokemon.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [pokemons, search, selectedType]);

  if (isLoading) {
    return (
      <div className="status-grid">
        <StatusCard
          variant="loading"
          icon="..."
          title="포켓몬을 불러오는 중"
          description="잠시만 기다려 주세요."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-grid">
        <StatusCard
          variant="error"
          icon="!"
          title="연결이 원활하지 않아요"
          description="네트워크를 확인하고 다시 시도해 주세요."
          onRetry={() => setRetryCount((count) => count + 1)}
        />
      </div>
    );
  }

  return (
    <div className="pokemon-list">
      {filteredPokemons.length === 0 && (
        <StatusCard
          icon="0"
          title="검색 결과가 없어요"
          description="다른 이름이나 번호로 검색해 보세요."
        />
      )}
      {filteredPokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon.number}
          number={pokemon.number}
          name={pokemon.name}
          type={pokemon.type}
          types={pokemon.types}
          role={pokemon.role}
          image={pokemon.image}
          onAdd={() => onAdd(pokemon)}
        />
      ))}
      {failedDetails.map((pokemon) => (
        <div className="pokemon-card pokemon-detail-error" key={pokemon.number}>
          <div className="pokemon-image pokemon-image-placeholder">
            <span>?</span>
          </div>
          <span className="pokemon-number">{pokemon.number}</span>
          <h2>{pokemon.name}</h2>
          <p>상세 정보 실패</p>
          <button
            className="red-shadow-button"
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
          >
            다시 시도
          </button>
        </div>
      ))}
    </div>
  );
}

interface StatusCardProps {
  icon: string;
  title: string;
  description: string;
  detail?: string;
  variant?: 'loading' | 'error';
  onRetry?: () => void;
}

function StatusCard({
  icon,
  title,
  description,
  detail,
  variant,
  onRetry,
}: StatusCardProps) {
  return (
    <div
      className={`status-card ${
        variant === 'loading'
          ? 'status-card-loading'
          : variant === 'error'
            ? 'status-card-error'
            : ''
      }`}
    >
      <span className="status-icon">{icon}</span>
      <strong>{title}</strong>
      <p>{description}</p>
      {detail && <small>{detail}</small>}
      {onRetry && (
        <button className="red-shadow-button" type="button" onClick={onRetry}>
          다시 시도
        </button>
      )}
    </div>
  );
}

export default PokemonList;
