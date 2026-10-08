import { useState } from "react";
import PokemonHeader from "./PokemonHeader";
import PokemonList, { defaultPokemons, type PokemonItem } from "./PokemonList";
import TeamNoticePanel from "./TeamNoticePanel";
import StatePanel from "./StatePanel";
import EditDialog from "./EditDialog";
import ConfirmDialog from "./ConfirmDialog";
import {
  MAX_TEAM_SIZE,
  type ActivePage,
  type SortOrder,
  type TeamMember,
  type TeamMemberChanges,
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

const POKEMON_TYPES = Array.from(new Set(defaultPokemons.map((p) => p.type)));

function matchesQuery(pokemon: PokemonItem, query: string): boolean {
  const keyword = query.trim().toLowerCase();

  if (!keyword) return true;

  if (/^#?\d+$/.test(keyword)) {
    return pokemon.id === Number(keyword.replace("#", ""));
  }

  return pokemon.name.toLowerCase().includes(keyword);
}

/* ───────── 필터 팝업 ───────── */

type FilterDialogProps = {
  typeCounts: { type: string; count: number }[];
  selectedTypes: string[];
  sortOrder: SortOrder;
  onApply: (types: string[], order: SortOrder) => void;
  onClose: () => void;
};

function FilterDialog({
  typeCounts,
  selectedTypes,
  sortOrder,
  onApply,
  onClose,
}: FilterDialogProps) {
  const [types, setTypes] = useState<string[]>(selectedTypes);
  const [order, setOrder] = useState<SortOrder>(sortOrder);

  const toggleType = (type: string) => {
    setTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleReset = () => {
    setTypes([]);
    setOrder("asc");
  };

  return (
    <div className="filter-dialog__backdrop" onClick={onClose}>
      <div
        className="filter-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="filter-dialog-title">필터</h3>
        <p className="filter-dialog__desc">
          선택한 조건은 검색어와 함께 적용돼요.
        </p>

        <h4>타입</h4>
        <div className="filter-dialog__types">
          {typeCounts.map(({ type, count }) => (
            <button
              key={type}
              type="button"
              className={`type-chip ${type.toLowerCase()} filter-chip${
                types.includes(type) ? " is-selected" : ""
              }`}
              aria-pressed={types.includes(type)}
              onClick={() => toggleType(type)}
            >
              {type.toUpperCase()} {count}
            </button>
          ))}
        </div>

        <h4>번호 정렬</h4>
        <div className="filter-dialog__sort">
          <button
            type="button"
            className={order === "asc" ? "is-selected" : ""}
            aria-pressed={order === "asc"}
            onClick={() => setOrder("asc")}
          >
            번호 ↑
          </button>
          <button
            type="button"
            className={order === "desc" ? "is-selected" : ""}
            aria-pressed={order === "desc"}
            onClick={() => setOrder("desc")}
          >
            번호 ↓
          </button>
        </div>

        <div className="filter-dialog__footer">
          <button type="button" onClick={handleReset}>
            초기화
          </button>
          <div className="filter-dialog__footer-right">
            <button type="button" onClick={onClose}>
              취소
            </button>
            <button
              type="button"
              className="filter-dialog__apply"
              onClick={() => onApply(types, order)}
            >
              적용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── 나의 팀 패널 ───────── */

type TeamPanelProps = {
  team: TeamMember[];
  onRemove: (id: number) => void;
  onUpdate: (id: number, changes: TeamMemberChanges) => void;
};

function TeamPanel({ team, onRemove, onUpdate }: TeamPanelProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const editingIndex = team.findIndex((member) => member.id === editingId);
  const editingMember = editingIndex >= 0 ? team[editingIndex] : null;
  const deletingMember = team.find((member) => member.id === deletingId) ?? null;

  const handleEditSave = (changes: TeamMemberChanges) => {
    if (editingId === null) return;

    onUpdate(editingId, changes);
    setEditingId(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingId === null) return;

    onRemove(deletingId);
    setDeletingId(null);
  };

  return (
    <aside className="team-panel">
      <h3 className="team-panel__title">나의 팀</h3>

      {team.length === 0 ? (
        <p className="team-panel__empty">아직 팀원이 없어요.</p>
      ) : (
        <ul className="team-panel__list">
          {team.map((member) => (
            <li key={member.id} className="team-panel__item">
              <img
                className="team-panel__image"
                src={member.image}
                alt={member.name}
              />

              <div className="team-panel__info">
                <strong>{member.nickname || member.name}</strong>
                <span>
                  {member.type} · {member.role}
                </span>
              </div>

              <div className="team-panel__actions">
                                <button
                  type="button"
                  className="team-btn team-btn--secondary"
                  onClick={() => setEditingId(member.id)}
                >
                  편집
                </button>
                <button
                  type="button"
                  className="team-btn team-btn--danger"
                  onClick={() => setDeletingId(member.id)}
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editingMember && (
        <EditDialog
          key={editingMember.id}
          member={editingMember}
          slotNumber={editingIndex + 1}
          onSave={handleEditSave}
          onClose={() => setEditingId(null)}
        />
      )}

      {deletingMember && (
        <ConfirmDialog
          title="팀에서 삭제할까요?"
          description={`${deletingMember.nickname || deletingMember.name}을(를) 팀에서 삭제합니다.`}
          confirmLabel="삭제"
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingId(null)}
        />
      )}
    </aside>
  );
}

/* ───────── 도감 페이지 ───────── */

function PokedexPage({
  team,
  duplicateName,
  loadError,
  onNavigate,
  onAddToTeam,
  onRemove,
  onUpdate,
  onDismissLoadError,
}: PokedexPageProps) {
  const [iconFailed, setIconFailed] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [filterOpen, setFilterOpen] = useState(false);

  // 렌더링 중 계산 (별도 state 없음)
  const searched = defaultPokemons.filter((pokemon) =>
    matchesQuery(pokemon, query),
  );

  const typeCounts = POKEMON_TYPES.map((type) => ({
    type,
    count: searched.filter((pokemon) => pokemon.type === type).length,
  }));

  const visiblePokemons = searched
    .filter(
      (pokemon) =>
        selectedTypes.length === 0 || selectedTypes.includes(pokemon.type),
    )
    .sort((a, b) => (sortOrder === "asc" ? a.id - b.id : b.id - a.id));

  const handleSearch = () => setQuery(keyword);

  const handleApplyFilter = (types: string[], order: SortOrder) => {
    setSelectedTypes(types);
    setSortOrder(order);
    setFilterOpen(false);
  };

  return (
    <>
      <PokemonHeader
        activePage="pokedex"
        teamCount={team.length}
        onNavigate={onNavigate}
      />

      <div className="pokedex-title">
        <div className="pokedex-title__text">
          <h2>포켓몬을 찾고 팀을 완성하세요</h2>
          <p>도감과 나의 팀을 한 화면에서 관리할 수 있어요.</p>
        </div>

        <span className="pokedex-count">
          <span className="pokedex-count__label">
            내 팀 {team.length} / {MAX_TEAM_SIZE}
          </span>
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
            placeholder="피카츄 또는 25"
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>

        <button type="button" className="action" onClick={handleSearch}>
          <span className="label">검색</span>
        </button>

        <button
          type="button"
          className="filter-btn"
          onClick={() => setFilterOpen(true)}
        >
          필터
        </button>
      </div>

      <TeamNoticePanel team={team} duplicateName={duplicateName} />

      <div className="pokedex-layout">
        <section className="pokedex-main">
          <h3 className="pokedex-section-title">도감</h3>

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

          <PokemonList
            pokemons={visiblePokemons}
            team={team}
            onAddToTeam={onAddToTeam}
          />
        </section>

        <TeamPanel team={team} onRemove={onRemove} onUpdate={onUpdate} />
      </div>

      {filterOpen && (
        <FilterDialog
          typeCounts={typeCounts}
          selectedTypes={selectedTypes}
          sortOrder={sortOrder}
          onApply={handleApplyFilter}
          onClose={() => setFilterOpen(false)}
        />
      )}
    </>
  );
}

export default PokedexPage;