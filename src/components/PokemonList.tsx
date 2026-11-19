import { useMemo, useState } from 'react';
import PokemonCard from './PokemonCard';
import StatusCard from './StatusCard';
import type { Pokemon } from '../App';
import {
  getPageParams,
  usePokemonSearch,
  usePokemonList,
  type FailedPokemon,
} from '../hooks/usePokemonList';

const PAGE_SIZE = 4;

interface PokemonListProps {
  onAdd: (pokemon: Pokemon) => void;
  search: string;
  selectedType: string;
  page: number;
  onPageChange: (page: number) => void;
}

function PokemonList({
  onAdd,
  search,
  selectedType,
  page,
  onPageChange,
}: PokemonListProps) {
  const offset = (page - 1) * PAGE_SIZE;
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
  } = usePokemonList(PAGE_SIZE, offset);
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
  }, [pokemons, normalizedSearch, selectedType]);

  const searchPokemons = (pokemonSearch.data ?? []).filter(
    (pokemon) =>
      selectedType === 'ALL' ||
      pokemon.types?.includes(selectedType) ||
      pokemon.type === selectedType
  );
  const searchTotalPages = Math.ceil(searchPokemons.length / PAGE_SIZE);
  const currentSearchPage = Math.min(
    page,
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
    (currentSearchPage - 1) * PAGE_SIZE,
    currentSearchPage * PAGE_SIZE
  );

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
            onClick={() => onPageChange(Math.max(currentSearchPage - 1, 1))}
            disabled={currentSearchPage === 1 || pokemonSearch.isFetching}
          >
            &lt;
          </button>
          {visibleSearchPages.map((pageNumber) => (
            <button
              className={`pagination-page ${
                pageNumber === currentSearchPage ? 'pagination-page-active' : ''
              }`}
              type="button"
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              disabled={
                pageNumber === currentSearchPage || pokemonSearch.isFetching
              }
            >
              {pageNumber}
            </button>
          ))}
          <button
            className="pagination-arrow"
            type="button"
            onClick={() =>
              onPageChange(Math.min(currentSearchPage + 1, searchTotalPages))
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
  const currentPage = page;
  const totalPages = Math.ceil(data.count / PAGE_SIZE);
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
          onClick={() =>
            onPageChange((previousPage?.offset ?? 0) / PAGE_SIZE + 1)
          }
          disabled={!previousPage || isFetching}
        >
          &lt;
        </button>
        {visiblePages.map((pageNumber) => (
          <button
            className={`pagination-page ${
              pageNumber === currentPage ? 'pagination-page-active' : ''
            }`}
            type="button"
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            disabled={pageNumber === currentPage || isFetching}
          >
            {pageNumber}
          </button>
        ))}
        <button
          className="pagination-arrow"
          type="button"
          onClick={() =>
            onPageChange((nextPage?.offset ?? offset) / PAGE_SIZE + 1)
          }
          disabled={!nextPage || isFetching}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

export default PokemonList;