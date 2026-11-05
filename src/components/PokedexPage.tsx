import { useState } from "react";
import PokemonHeader from "./PokemonHeader";
import PokemonCard from "./PokemonCard";
import TeamNoticePanel from "./TeamNoticePanel";
import StatePanel from "./StatePanel";
import Pagination from "./Pagination";
import { usePokedexPage } from "./usePokedexPage";
import { getArtworkUrl } from "./pokeApi";
import type { ActivePage, TeamMember, TeamMemberChanges } from "./teamTypes";

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

const formatNumber = (id: number) => `#${String(id).padStart(4, "0")}`;

function PokedexPage({
  team,
  duplicateName,
  loadError,
  onNavigate,
  onAddToTeam,
  onDismissLoadError,
}: PokedexPageProps) {
  const [iconFailed, setIconFailed] = useState(false);
  const { keyword, setKeyword, search, retry, view, isRefreshing, pagination } =
    usePokedexPage();

  // 시안: "최신 목록" 배지. 캐시를 보여주며 뒤에서 갱신 중이면 "갱신 중"
  const badge =
    view.status === "success"
      ? isRefreshing
        ? { label: "갱신 중", mod: " pill--refreshing" }
        : { label: "최신 목록", mod: "" }
      : null;

  return (
    <>
      <PokemonHeader
        activePage="pokedex"
        teamCount={team.length}
        onNavigate={onNavigate}
      />

      <div className="pokedex-title">
        <div className="pokedex-title__text">
          <h2>포켓몬 도감</h2>
          <p>페이지를 이동해도 이전 포켓몬을 빠르게 다시 볼 수 있어요.</p>
        </div>

        {badge && (
          <span className={`pill${badge.mod}`} role="status">
            {badge.label}
          </span>
        )}
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
            placeholder="이름 또는 번호"
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") search();
            }}
          />
        </div>

        <button type="button" className="action" onClick={search}>
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
              onAction={retry}
            />
          )}

          {view.status === "success" && (
            <div className="pokemon-grid">
              {view.cards.map((card) => {
                if (card.status === "ok") {
                  return (
                    <PokemonCard
                      key={card.data.id}
                      id={card.data.id}
                      image={card.data.image}
                      number={formatNumber(card.data.id)}
                      name={card.data.name}
                      type={card.data.type}
                      types={card.data.types}
                      team={team}
                      onAddToTeam={onAddToTeam}
                    />
                  );
                }

                const isFailed = card.status === "failed";

                return (
                  <article
                    key={card.id}
                    className={`pokemon-card ${
                      isFailed
                        ? "pokemon-card--failed"
                        : "pokemon-card--pending"
                    }`}
                    aria-label={`${card.name} ${isFailed ? "상세 정보 실패" : "불러오는 중"}`}
                    aria-busy={!isFailed}
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
                    <span className="number">{formatNumber(card.id)}</span>
                    <h3 className="name">
                      {isFailed ? "상세 정보 실패" : "불러오는 중…"}
                    </h3>
                    {isFailed && (
                      <button
                        type="button"
                        className="action-btn"
                        disabled={card.isRetrying}
                        onClick={card.retry}
                      >
                        {card.isRetrying ? "불러오는 중…" : "다시 시도"}
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          {view.status === "success" && pagination && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              hasPrevious={pagination.hasPrevious}
              hasNext={pagination.hasNext}
              onPrevious={pagination.goPrevious}
              onNext={pagination.goNext}
              onSelectPage={pagination.goToPage}
            />
          )}
        </section>
      </div>
    </>
  );
}

export default PokedexPage;
