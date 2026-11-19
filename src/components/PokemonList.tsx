import { useEffect, useMemo, useState } from 'react';
import PokemonCard from './PokemonCard';
import type { Pokemon } from '../App';
import {
  getPageParams,
  usePokemonSearch,
  usePokemonList,
  type FailedPokemon,
} from '../hooks/usePokemonList';

const LIST_PAGE_SIZE = 20;
const SEARCH_PAGE_SIZE = 4;

interface PokemonListProps {
  onAdd: (pokemon: Pokemon) => void;
  search: string;
  selectedType: string;
}

function PokemonList({
  onAdd,
  search,
  selectedType,
}: PokemonListProps) {
  const [offset, setOffset] = useState(0);
  const [searchPage, setSearchPage] = useState(1);
  const [retryingUrls, setRetryingUrls] = useState<Set<string>>(new Set());
  const [retryErrors, setRetryErrors] = useState<Record<string, string>>({});
  const {
    data,
    error,
    isError,
    isFetching,
    isPending,
    refetch,
    retryPokemonDetail: retryDetail,
  } = usePokemonList(LIST_PAGE_SIZE, offset);
  const pokemonSearch = usePokemonSearch(search);
  const normalizedSearch = search.trim().toLowerCase();
  const pokemons = data?.pokemons ?? [];
  const failedDetails = data?.failedDetails ?? [];

  const retryPokemonDetail = async (failedPokemon: FailedPokemon) => {
    if (retryingUrls.has(failedPokemon.url)) {
      return;
    }

    setRetryingUrls((urls) => new Set(urls).add(failedPokemon.url));
    setRetryErrors((errors) => {
      const nextErrors = { ...errors };
      delete nextErrors[failedPokemon.url];
      return nextErrors;
    });

    try {
      await retryDetail(failedPokemon);
    } catch (requestError) {
      setRetryErrors((errors) => ({
        ...errors,
        [failedPokemon.url]:
          requestError instanceof Error
            ? requestError.message
            : '포켓몬 상세 정보를 불러오지 못했습니다.',
      }));
    } finally {
      setRetryingUrls((urls) => {
        const nextUrls = new Set(urls);
        nextUrls.delete(failedPokemon.url);
        return nextUrls;
      });
    }
  };

  const filteredPokemons = useMemo(() => {
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

  const searchPokemons = (pokemonSearch.data ?? []).filter(
    (pokemon) =>
      selectedType === 'ALL' ||
      pokemon.types?.includes(selectedType) ||
      pokemon.type === selectedType
  );
  const searchTotalPages = Math.ceil(
    searchPokemons.length / SEARCH_PAGE_SIZE
  );
  const currentSearchPage = Math.min(
    searchPage,
    Math.max(searchTotalPages, 1)
  );
  const visibleSearchPageStart = Math.min(
    Math.max(currentSearchPage - 1, 1),
    Math.max(searchTotalPages - 3, 1)
  );
  const visibleSearchPages = Array.from(
    { length: Math.min(4, searchTotalPages) },
    (_, index) => visibleSearchPageStart + index
  );
  const visibleSearchPokemons = searchPokemons.slice(
    (currentSearchPage - 1) * SEARCH_PAGE_SIZE,
    currentSearchPage * SEARCH_PAGE_SIZE
  );

  useEffect(() => {
    setSearchPage(1);
  }, [normalizedSearch, selectedType]);

  if (normalizedSearch) {
    if (pokemonSearch.isPending) {
      return (
        <div className="status-grid">
          <StatusCard
            variant="loading"
            icon="..."
            title="포켓몬을 찾는 중"
            description="잠시만 기다려 주세요."
          />
        </div>
      );
    }

    if (pokemonSearch.isError) {
      return (
        <div className="status-grid">
          <StatusCard
            variant="error"
            icon="!"
            title="검색 중 문제가 발생했어요"
            description={
              pokemonSearch.error instanceof Error
                ? pokemonSearch.error.message
                : '네트워크를 확인하고 다시 시도해 주세요.'
            }
            onRetry={() => void pokemonSearch.refetch()}
          />
        </div>
      );
    }

    return (
      <div className="pokemon-list">
        {pokemonSearch.isFetching && (
          <div className="status-grid">
            <StatusCard
              variant="loading"
              icon="..."
              title="포켓몬을 찾는 중"
              description="잠시만 기다려 주세요."
            />
          </div>
        )}
        {visibleSearchPokemons.length > 0 ? (
          visibleSearchPokemons.map((pokemon) => (
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
          ))
        ) : (
          <StatusCard
            icon="0"
            title="검색 결과가 없어요"
            description="포켓몬 번호나 정확한 영문 이름을 확인해 보세요."
          />
        )}
        <div className="pokemon-pagination">
          <button
            className="pagination-arrow"
            type="button"
            onClick={() =>
              setSearchPage((page) => Math.max(page - 1, 1))
            }
            disabled={currentSearchPage === 1 || pokemonSearch.isFetching}
          >
            &lt;
          </button>
          {visibleSearchPages.map((page) => (
            <button
              className={`pagination-page ${
                page === currentSearchPage ? 'pagination-page-active' : ''
              }`}
              type="button"
              key={page}
              onClick={() => setSearchPage(page)}
              disabled={page === currentSearchPage || pokemonSearch.isFetching}
            >
              {page}
            </button>
          ))}
          <button
            className="pagination-arrow"
            type="button"
            onClick={() =>
              setSearchPage((page) => Math.min(page + 1, searchTotalPages))
            }
            disabled={
              currentSearchPage >= searchTotalPages ||
              pokemonSearch.isFetching
            }
          >
            &gt;
          </button>
        </div>
      </div>
    );
  }

  if (isPending) {
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

  if (isError) {
    return (
      <div className="status-grid">
        <StatusCard
          variant="error"
          icon="!"
          title="연결이 원활하지 않아요"
          description={
            error instanceof Error
              ? error.message
              : '네트워크를 확인하고 다시 시도해 주세요.'
          }
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  const previousPage = getPageParams(data.previous);
  const nextPage = getPageParams(data.next);
  const currentPage = offset / LIST_PAGE_SIZE + 1;
  const totalPages = Math.ceil(data.count / LIST_PAGE_SIZE);
  const visiblePageStart = Math.min(
    Math.max(currentPage - 1, 1),
    Math.max(totalPages - 3, 1)
  );
  const visiblePages = Array.from(
    { length: Math.min(4, totalPages) },
    (_, index) => visiblePageStart + index
  );

  return (
    <div className="pokemon-list">
      {isFetching && (
        <div className="status-grid">
          <StatusCard
            variant="loading"
            icon="..."
            title="포켓몬을 불러오는 중"
            description="잠시만 기다려 주세요."
          />
        </div>
      )}
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
          <p>{retryErrors[pokemon.url] ?? '상세 정보 실패'}</p>
          <button
            className="red-shadow-button"
            type="button"
            onClick={() => void retryPokemonDetail(pokemon)}
            disabled={retryingUrls.has(pokemon.url)}
          >
            {retryingUrls.has(pokemon.url) ? '불러오는 중' : '다시 시도'}
          </button>
        </div>
      ))}
      <div className="pokemon-pagination">
        <button
          className="pagination-arrow"
          type="button"
          onClick={() => setOffset(previousPage?.offset ?? 0)}
          disabled={!previousPage || isFetching}
        >
          &lt;
        </button>
        {visiblePages.map((page) => (
          <button
            className={`pagination-page ${
              page === currentPage ? 'pagination-page-active' : ''
            }`}
            type="button"
            key={page}
            onClick={() => setOffset((page - 1) * LIST_PAGE_SIZE)}
            disabled={page === currentPage || isFetching}
          >
            {page}
          </button>
        ))}
        <button
          className="pagination-arrow"
          type="button"
          onClick={() => setOffset(nextPage?.offset ?? offset)}
          disabled={!nextPage || isFetching}
        >
          &gt;
        </button>
      </div>
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
