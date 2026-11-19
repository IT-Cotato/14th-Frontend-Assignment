import { Link, useLocation, useParams } from 'react-router';
import type { Pokemon } from '../App';
import StatusCard from '../components/StatusCard';
import {
  PokemonNotFoundError,
  STAT_MAX,
  usePokemonDetail,
} from '../hooks/usePokemonDetail';

interface PokemonDetailPageProps {
  onAdd: (pokemon: Pokemon) => void;
}

function PokemonDetailPage({ onAdd }: PokemonDetailPageProps) {
  // /pokemon/:pokemonId 의 pokemonId (예: "6", "charizard")
  const { pokemonId = '' } = useParams();
  const location = useLocation();
  // 목록에서 들어왔으면 그때의 검색어·페이지로, 주소로 바로 들어왔으면 도감 첫 페이지로
  const listSearch =
    (location.state as { listSearch?: string } | null)?.listSearch ?? '';
  const backTo = `/pokemon${listSearch}`;
  const { data, error, isPending, isError, refetch } =
    usePokemonDetail(pokemonId);

  if (isPending) {
    return (
      <div className="detail-status">
        <StatusCard
          variant="loading"
          icon="..."
          title="포켓몬을 불러오는 중"
          description="잠시만 기다려 주세요."
        />
      </div>
    );
  }

  // 경로는 맞지만 PokéAPI가 404를 준 경우 → 데이터 없음 화면
  if (error instanceof PokemonNotFoundError) {
    return (
      <section className="empty-result-card">
        <div className="empty-icon">?</div>
        <h2 className="empty-title">포켓몬 데이터가 없어요</h2>
        <p className="empty-description">
          '{pokemonId}'에 해당하는 포켓몬을 찾을 수 없어요. 번호나 영문 이름을
          확인해 주세요.
        </p>
        <Link className="red-shadow-button empty-action" to={backTo}>
          도감으로 돌아가기
        </Link>
      </section>
    );
  }

  if (isError) {
    return (
      <div className="detail-status">
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

  const { pokemon } = data;

  return (
    <>
      <nav className="breadcrumb" aria-label="현재 위치">
        <span>도감</span>
        <span> / </span>
        <span>{pokemon.number}</span>
      </nav>

      <article className="pokemon-detail">
        <div className="detail-artwork-panel">
          <div className="detail-artwork">
            <img src={data.artwork || pokemon.image} alt={data.displayName} />
          </div>
        </div>

        <div className="detail-info">
          <span className="detail-pill">{pokemon.number}</span>
          <h1>{data.displayName}</h1>
          <p className="detail-description">{data.description}</p>

          <div className="pokemon-types">
            {(pokemon.types ?? [pokemon.type]).map((type) => (
              <span className={`type ${type.toLowerCase()}`} key={type}>
                {type}
              </span>
            ))}
          </div>

          <dl className="detail-facts">
            <div className="detail-fact">
              <dt>키</dt>
              <dd>{data.heightM} m</dd>
            </div>
            <div className="detail-fact">
              <dt>몸무게</dt>
              <dd>{data.weightKg} kg</dd>
            </div>
            <div className="detail-fact">
              <dt>특성</dt>
              <dd>{data.ability}</dd>
            </div>
          </dl>

          <ul className="detail-stats">
            {data.stats.map((stat) => (
              <li className="detail-stat" key={stat.key}>
                <span>{stat.label}</span>
                <div
                  className="detail-track"
                  role="meter"
                  aria-label={stat.label}
                  aria-valuenow={stat.value}
                  aria-valuemin={0}
                  aria-valuemax={STAT_MAX}
                >
                  <div
                    className="detail-track-fill"
                    style={{
                      width: `${Math.min(stat.value / STAT_MAX, 1) * 100}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <button
            className="red-shadow-button"
            type="button"
            onClick={() => onAdd(pokemon)}
          >
            내 팀에 추가
          </button>
        </div>
      </article>

      <Link
        className="red-shadow-button detail-back-button"
        to={backTo}
        aria-label="도감으로 돌아가기"
      >
        &lt;
      </Link>
    </>
  );
}

export default PokemonDetailPage;
