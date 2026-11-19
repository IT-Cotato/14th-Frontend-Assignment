import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import PokemonHeader from "./PokemonHeader";
import PokemonList from "./PokemonList";
import TeamNoticePanel from "./TeamNoticePanel";
import type { TeamMember, TeamPokemon } from "./teamTypes";

type HomePageProps = {
  team: TeamMember[];
  duplicateName: string | null;
  onAddToTeam: (member: TeamPokemon) => void;
};

function HomePage({
  team,
  duplicateName,
  onAddToTeam,
}: HomePageProps) {
  const [heroFailed, setHeroFailed] = useState(false);
  const [iconFailed, setIconFailed] = useState(false);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <PokemonHeader
        activePage="home"
        teamCount={team.length}
      />

      <section className="hero">
        <div className="hero-copy">
          <span className="pill">오늘의 추천</span>
          <h1>포켓몬과 함께하는 하루</h1>
          <p>좋아하는 포켓몬을 찾고 나만의 팀을 만들어 보세요.</p>

          <div className="hero-actions">
            <Link className="hero-primary" to="/pokemon">
              도감 보기
            </Link>
            <Link className="hero-secondary" to="/my-team">
              내 팀
            </Link>
          </div>
        </div>

        <div className="hero-artwork">
          {!heroFailed && (
            <img
              src="/Pikachu.svg"
              alt="피카츄"
              onError={() => setHeroFailed(true)}
            />
          )}
        </div>
      </section>

      <form className="search-field" onSubmit={(event) => {
        event.preventDefault();
        const query = keyword.trim();
        const search = query ? `?${new URLSearchParams({ q: query })}` : "";
        void navigate({ pathname: "/pokemon", search });
      }}>
        <div className="input">
          <div className="icon">
            {!iconFailed && (
              <img
                src="/search-icon.svg"
                alt=""
                onError={() => setIconFailed(true)}
              />
            )}
          </div>
          <input
            className="query"
            aria-label="포켓몬 이름 또는 번호"
            placeholder="이름 또는 번호"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>
        <button type="submit" className="action"><span className="label">검색</span></button>
      </form>

      <div className="section-head">
        <h2>추천 포켓몬</h2>
        <Link to="/pokemon">전체 보기</Link>
      </div>

      <TeamNoticePanel team={team} duplicateName={duplicateName} />

      <PokemonList team={team} onAddToTeam={onAddToTeam} limit={4} />
    </>
  );
}

export default HomePage;
