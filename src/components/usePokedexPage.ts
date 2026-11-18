import { useState } from "react";
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

// ?ì„¸ ?°ì´?°ëŠ” ê±°ì˜ ??ë°”ë€Œë?ë¡?5ë¶„ê°„ fresh ì²˜ë¦¬ (ëª©ë¡?€ ê¸°ë³¸ê°?0 ???Œì•„?¤ë©´ ê°±ì‹ )
const DETAIL_STALE_TIME = 5 * 60 * 1000;

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
  const [offset, setOffset] = useState(0);
  const [keyword, setKeyword] = useState(""); // ?…ë ¥ ì¤‘ì¸ ê°?
  const [query, setQuery] = useState(""); // ?¤ì œë¡?ê²€?‰í•œ ê°?

  const target = normalizeQuery(query);
  const isSearch = target !== "";
  const params = { limit: LIST_LIMIT, offset };

  // ëª©ë¡
  const listQuery = useQuery({
    queryKey: pokemonKeys.list(params),
    queryFn: ({ signal }) => fetchPokemonPage(params, signal),
    enabled: !isSearch,
  });

  // ê²€??(ë²ˆí˜¸/?ë¬¸ ?´ë¦„ 1ê°?
  const searchQuery = useQuery({
    queryKey: pokemonKeys.search(target),
    queryFn: ({ signal }) => fetchPokemon(target, signal),
    enabled: isSearch,
  });

  // ì¹´ë“œë³??ì„¸
  const items = isSearch ? [] : (listQuery.data?.items ?? []);
  const detailQueries = useQueries({
    queries: items.map((item) => ({
      queryKey: pokemonKeys.detail(item.id),
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        fetchPokemon(item.url, signal),
      staleTime: DETAIL_STALE_TIME,
    })),
  });

  // ?€?€ ?”ë©´ ?íƒœ ê³„ì‚° ?€?€
  // ìºì‹œ ?°ì´?°ê? ?ˆìœ¼ë©?background ê°±ì‹ ???¤íŒ¨?´ë„ ì¹´ë“œë¥?? ì?
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
    view = { status: "success", cards };
  } else if (listQuery.isError) {
    view = { status: "error" };
  } else {
    view = { status: "loading" };
  }

  // ?´ë? ë³´ì—¬ì¤??°ì´?°ê? ?ˆëŠ”???¤ì—???¤ì‹œ ê°€?¸ì˜¤??ì¤?
  const activeQuery = isSearch ? searchQuery : listQuery;
  const isRefreshing = activeQuery.isFetching && activeQuery.data !== undefined;

  // ?€?€ ?˜ì´ì§€ ?´ë™ (next/previous ?‘ë‹µ ?¬ìš©) ?€?€
  const page = listQuery.data;
  const previous = page?.previous ?? null;
  const next = page?.next ?? null;

  const pagination =
    isSearch || !page
      ? null
      : {
          currentPage: Math.floor(offset / LIST_LIMIT) + 1,
          totalPages: Math.ceil(page.count / LIST_LIMIT),
          hasPrevious: previous !== null,
          hasNext: next !== null,
          goPrevious: () => previous && setOffset(previous.offset),
          goNext: () => next && setOffset(next.offset),
          goToPage: (n: number) => setOffset((n - 1) * LIST_LIMIT),
        };

  return {
    keyword,
    setKeyword,
    search: () => setQuery(keyword),
    retry: () => void activeQuery.refetch(),
    view,
    isRefreshing,
    pagination,
  };
}
