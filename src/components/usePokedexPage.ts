import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  HttpError,
  LIST_LIMIT,
  fetchPokemon,
  fetchPokemonPage,
  normalizeQuery,
  pokemonKeys,
  type PokemonData,
} from "./pokeApi";

const DETAIL_STALE_TIME = 5 * 60 * 1000;
const FIRST_PAGE = { limit: LIST_LIMIT, offset: 0 };

export type CardModel =
  | { status: "pending"; id: number; name: string }
  | { status: "ok"; data: PokemonData }
  | {
      status: "failed";
      id: number;
      name: string;
      isRetrying: boolean;
      retry: () => void;
    };

export type ViewState =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "error" }
  | { status: "success"; cards: CardModel[] };

export function usePokedexPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [draft, setDraft] = useState({ query, keyword: query });
  if (draft.query !== query) setDraft({ query, keyword: query });
  const keyword = draft.query === query ? draft.keyword : query;
  const pageParam = searchParams.get("page");
  const requestedPage = pageParam && /^\d+$/.test(pageParam)
    ? Math.max(1, Number(pageParam))
    : 1;

  const target = normalizeQuery(query);
  const isSearch = target !== "";
  const firstPage = useQuery({
    queryKey: pokemonKeys.list(FIRST_PAGE),
    queryFn: ({ signal }) => fetchPokemonPage(FIRST_PAGE, signal),
    enabled: requestedPage > 1,
    staleTime: DETAIL_STALE_TIME,
  });
  const lastPage = firstPage.data && Math.max(1, Math.ceil(firstPage.data.count / LIST_LIMIT));
  const currentPage = lastPage ? Math.min(requestedPage, lastPage) : 1;
  const offset = (currentPage - 1) * LIST_LIMIT;

  useEffect(() => {
    if (pageParam === null || (requestedPage > 1 && lastPage === undefined)) return;
    if (pageParam === String(currentPage)) return;

    const params = new URLSearchParams(searchParams);
    params.set("page", String(currentPage));
    setSearchParams(params, { replace: true });
  }, [pageParam, requestedPage, lastPage, currentPage, searchParams, setSearchParams]);

  const params = { limit: LIST_LIMIT, offset };

  // 목록
  const listQuery = useQuery({
    queryKey: pokemonKeys.list(params),
    queryFn: ({ signal }) => fetchPokemonPage(params, signal),
    enabled: !isSearch && (requestedPage === 1 || lastPage !== undefined),
  });

  const searchQuery = useQuery({
    queryKey: pokemonKeys.search(target),
    queryFn: ({ signal }) => fetchPokemon(target, signal),
    enabled: isSearch,
  });

  const waitingForCount = requestedPage > 1 && lastPage === undefined;
  const items = isSearch || waitingForCount ? [] : (listQuery.data?.items ?? []);
  const detailQueries = useQueries({
    queries: items.map((item) => ({
      queryKey: pokemonKeys.detail(String(item.id)),
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        fetchPokemon(String(item.id), signal),
      staleTime: DETAIL_STALE_TIME,
    })),
  });

  let view: ViewState;
  if (isSearch) {
    if (searchQuery.data) {
      view = {
        status: "success",
        cards: [{ status: "ok", data: searchQuery.data }],
      };
    } else if (searchQuery.isError) {
      const error = searchQuery.error;
      view =
        error instanceof HttpError && error.status === 404
          ? { status: "empty" }
          : { status: "error" };
    } else {
      view = { status: "loading" };
    }
  } else if (waitingForCount) {
    view = { status: firstPage.isError ? "error" : "loading" };
  } else if (listQuery.data) {
    const cards = items.map((item, i): CardModel => {
      const q = detailQueries[i];
      if (q.data) return { status: "ok", data: q.data };
      if (q.isError) {
        return {
          status: "failed",
          id: item.id,
          name: item.name,
          isRetrying: q.isFetching,
          retry: () => void q.refetch(),
        };
      }
      return { status: "pending", id: item.id, name: item.name };
    });
    view = cards.length > 0 ? { status: "success", cards } : { status: "empty" };
  } else if (listQuery.isError) {
    view = { status: "error" };
  } else {
    view = { status: "loading" };
  }

  const activeQuery = isSearch ? searchQuery : waitingForCount ? firstPage : listQuery;
  const isRefreshing = activeQuery.isFetching && activeQuery.data !== undefined;

  const page = listQuery.data;
  const previous = page?.previous ?? null;
  const next = page?.next ?? null;

  const pagination =
    isSearch || !page
      ? null
      : {
          currentPage,
          totalPages: Math.ceil(page.count / LIST_LIMIT),
          hasPrevious: previous !== null,
          hasNext: next !== null,
          pageHref: (pageNumber: number) => {
            const params = new URLSearchParams(searchParams);
            params.delete("q");
            params.set("page", String(pageNumber));
            const search = params.toString();
            return search ? `/pokemon?${search}` : "/pokemon";
          },
        };

  return {
    keyword,
    setKeyword: (value: string) => setDraft({ query, keyword: value }),
    search: () => {
      const submitted = keyword.trim();
      const params = new URLSearchParams(searchParams);
      if (normalizeQuery(submitted)) params.set("q", submitted);
      else params.delete("q");
      params.delete("page");
      if (params.toString() !== searchParams.toString()) setSearchParams(params);
    },
    retry: () => void activeQuery.refetch(),
    view,
    isRefreshing,
    pagination,
  };
}
