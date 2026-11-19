import { useQueries, useQuery } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import { AddToTeamButton } from "./PokemonCard";
import PokemonHeader from "./PokemonHeader";
import StatePanel from "./StatePanel";
import TeamNoticePanel from "./TeamNoticePanel";
import TypeChip from "./TypeChip";
import { fetchAbilityName, fetchPokemon, HttpError, normalizeQuery, pokemonKeys } from "./pokeApi";
import type { TeamMember, TeamPokemon } from "./teamTypes";

type PokemonDetailPageProps = {
  team: TeamMember[];
  duplicateName: string | null;
  onAddToTeam: (member: TeamPokemon) => void;
};

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  speed: "Speed",
};

function PokemonDetailPage({ team, duplicateName, onAddToTeam }: PokemonDetailPageProps) {
  const { pokemonId = "" } = useParams();
  const { state } = useLocation();
  const backToList = { pathname: "/pokemon", search: state?.listSearch ?? "" };
  const target = normalizeQuery(pokemonId);
  const detail = useQuery({
    queryKey: pokemonKeys.detail(target),
    queryFn: ({ signal }) => fetchPokemon(target, signal),
  });
  const pokemon = detail.data;
  const visibleStats = pokemon?.stats.filter(
    ({ name }) => name !== "special-attack" && name !== "special-defense",
  ) ?? [];
  const statScale = Math.max(120, ...visibleStats.map(({ value }) => value));
  const abilities = pokemon?.abilities ?? [];
  const abilityQueries = useQueries({
    queries: abilities.map((name) => ({
      queryKey: ["ability", name],
      queryFn: ({ signal }: { signal: AbortSignal }) => fetchAbilityName(name, signal),
      staleTime: 5 * 60 * 1000,
    })),
  });
  const abilityLabels = abilities.map((name, index) => abilityQueries[index].data ?? name);
  const number = pokemon ? `#${String(pokemon.id).padStart(4, "0")}` : pokemonId;
  const isMissing = detail.error instanceof HttpError && detail.error.status === 404;

  return (
    <>
      <PokemonHeader activePage="pokedex" teamCount={team.length} />
      <main className="route-page pokemon-detail-page">
        <nav className="route-breadcrumb" aria-label="현재 위치">
          <Link to={backToList}>도감</Link> / <span aria-current="page">{number}</span>
        </nav>

        {pokemon ? (
          <>
            <article className="detail-panel">
              <div className="detail-panel__artwork">
                {pokemon.image && <img src={pokemon.image} alt={pokemon.name} />}
              </div>
              <div className="detail-panel__content">
                <span className="detail-panel__number">{number}</span>
                <h1>{pokemon.name}</h1>
                <p>{pokemon.description}</p>
                <div className="detail-panel__types">
                  {pokemon.types.map((type) => <TypeChip key={type} type={type} />)}
                </div>
                <dl className="detail-panel__facts">
                  <div><dt>키</dt><dd>{pokemon.height} m</dd></div>
                  <div><dt>몸무게</dt><dd>{pokemon.weight} kg</dd></div>
                  <div><dt>특성</dt><dd>{abilityLabels.join(", ") || "없음"}</dd></div>
                </dl>
                <ul className="detail-panel__stats">
                  {visibleStats.map(({ name, value }) => (
                    <li key={name}>
                      <span className="detail-panel__stat-label">{STAT_LABELS[name] ?? name}</span>
                      <progress
                        max={statScale}
                        value={value}
                        aria-label={STAT_LABELS[name] ?? name}
                      />
                    </li>
                  ))}
                </ul>
                <AddToTeamButton {...pokemon} team={team} onAddToTeam={onAddToTeam} />
              </div>
            </article>
            <TeamNoticePanel team={team} duplicateName={duplicateName} />
          </>
        ) : detail.isPending ? (
          <StatePanel variant="loading" symbol="…" title="포켓몬을 불러오는 중" description="잠시만 기다려 주세요." />
        ) : isMissing ? (
          <>
            <StatePanel variant="error" symbol="!" title="포켓몬을 찾을 수 없어요" description="도감 번호나 영문 이름을 확인해 주세요." />
            <Link className="team-btn team-btn--secondary" to="/">홈으로</Link>
          </>
        ) : (
          <StatePanel
            variant="error"
            symbol="!"
            title="연결이 원활하지 않아요"
            description="잠시 후 다시 시도해 주세요."
            actionLabel="다시 시도"
            onAction={() => void detail.refetch()}
          />
        )}
      </main>
    </>
  );
}

export default PokemonDetailPage;
