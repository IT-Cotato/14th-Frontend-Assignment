import { useEffect, useState } from "react";
import PokemonHeader from "./PokemonHeader";
import PokemonCard from "./PokemonCard";
import TeamNoticePanel from "./TeamNoticePanel";
import StatePanel from "./StatePanel";
import {
  HttpError,
  getArtworkUrl,
  isAbortError,
  loadCards,
  type CardResult,
} from "./pokeApi";
import type {
  ActivePage,
  TeamMember,
  TeamMemberChanges,
} from "./teamTypes";

type PokedexPageProps = {
  team: TeamMember[];
  duplicateName: string | null;
  loadError: boolean;
  onNavigate: (page: ActivePage) => void;
  onAddToTeam: (member: TeamMember) => void;
  onRemove: (id: number) => void;
  onUpdate: (id: number, changes: TeamMemberChanges) => void;
  onDismissLoadError: () => void;
};

type ViewState =
  | { status: "loading" }
  | { status: "success"; cards: CardResult[] }
  | { status: "empty" }
  | { status: "error" };

function PokedexPage({
  team,
  duplicateName,
  loadError,
  onNavigate,
  onAddToTeam,
  onDismissLoadError,
}: PokedexPageProps) {
  const [iconFailed, setIconFailed] = useState(false);
  const [keyword, setKeyword] = useState(""); // 입력 중인 값 (오류가 나도 유지)
  const [query, setQuery] = useState(""); // 실제로 검색한 값
  const [retryKey, setRetryKey] = useState(0);
  const [view, setView] = useState<ViewState>({ status: "loading" });

  // 요청은 Effect에서, 필터링 같은 계산은 렌더링 중에 처리
  useEffect(() => {
    const controller = new AbortController();
    setView({ status: "loading" });

    loadCards(query, controller.signal)
      .then((cards) => {
        if (controller.signal.aborted) return;
        setView({ status: "success", cards });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isAbortError(error)) return;

        if (error instanceof HttpError && error.status === 404) {
          setView({ status: "empty" });
          return;
        }
        setView({ status: "error" });
      });

    // 검색어가 바뀌거나 페이지를 떠나면 이전 요청 취소
    return () => controller.abort();
  }, [query, retryKey]);

  const handleSearch = () => setQuery(keyword);
  const handleRetry = () => setRetryKey((key) => key + 1);

  const apiBadge =
    view.status === "error"
      ? { label: "PokéAPI 연결 실패", mod: "error" }
      : view.status === "loading"
        ? { label: "PokéAPI 연결 중", mod: "loading" }
        : { label: "PokéAPI 온라인", mod: "online" };

  return (
    <>
      <PokemonHeader
        activePage="pokedex"
        teamCount={team.length}
        onNavigate={onNavigate}
      />

      <div className="pokedex-title">
        <div className="pokedex-title__text">
          <h2>실시간 포켓몬 도감</h2>
          <p>이름이나 도감 번호로 포켓몬을 바로 찾아보세요.</p>
        </div>

        <span className={`api-badge api-badge--${apiBadge.mod}`}>
          {apiBadge.label}
        </span>
      </div>

      <div className="search-field">
        <div className="input">
          <div className="icon">
            {!iconFailed && (
              <img
                src="/search-icon.svg"
                alt="검색"
                onError={() => setIconFailed(true)}
              />
            )}
          </div>
          <input
            className="query"
            value={keyword}
            placeholder="pikachu"
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>

        <button type="button" className="action" onClick={handleSearch}>
          <span className="label">검색</span>
        </button>
      </div>

      <TeamNoticePanel team={team} duplicateName={duplicateName} />

      <div className="pokedex-layout">
        <section className="pokedex-main">
          {loadError && (
            <StatePanel
              variant="error"
              symbol="!"
              title="저장된 팀을 불러오지 못했어요"
              description="저장 데이터를 초기화했어요."
              actionLabel="확인"
              onAction={onDismissLoadError}
            />
          )}

          {view.status === "loading" && (
            <StatePanel
            variant="loading"
            symbol="…"
            title="포켓몬을 불러오는 중"
            description="잠시만 기다려 주세요."
            />
            )}

          {view.status === "empty" && (
            <StatePanel
              symbol="?"
              title="검색 결과가 없어요"
              description="도감 번호나 영문 이름을 확인해 주세요."
            />
          )}

          {view.status === "error" && (
            <StatePanel
              variant="error"
              symbol="!"
              title="연결이 원할하지 않아요"
              description="잠시 후 다시 시도해 주세요."
              actionLabel="다시 시도"
              onAction={handleRetry}
            />
          )}

          {view.status === "success" && (
            <div className="pokemon-grid">
              {view.cards.map((card) =>
                card.status === "ok" ? (
                  <PokemonCard
                    key={card.data.id}
                    image={card.data.image}
                    number={`#${String(card.data.id).padStart(4, "0")}`}
                    name={card.data.name}
                    type={card.data.type}
                    types={card.data.types}
                    team={team}
                    onAddToTeam={onAddToTeam}
                  />
                ) : (
                <article
                key={card.id}
                className="pokemon-card pokemon-card--failed"
                aria-label={`${card.name} 상세 정보 실패`}
                >
                  <div className="artwork">
                    <img
                    src={getArtworkUrl(card.id)}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    />
                    </div>
                    <span className="number">{`#${String(card.id).padStart(4, "0")}`}</span>
                    <h3 className="name">상세 정보 실패</h3>
                    <button type="button" className="action-btn" onClick={handleRetry}>
                      다시 시도
                      </button>
                      </article>
                      ),
              )}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default PokedexPage;