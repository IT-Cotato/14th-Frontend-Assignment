import { Link, useLocation } from "react-router-dom";
import TypeChip from "./TypeChip";
import {
  DEFAULT_ROLE,
  MAX_TEAM_SIZE,
  TYPE_LABEL,
  type TeamMember,
  type TeamPokemon,
} from "./teamTypes";

interface PokemonCardProps {
  id?: number; // 추가: 있으면 번호 문자열 대신 이 값을 사용
  image: string;
  number: string;
  name: string;
  type: string;
  types?: string[];
  team: TeamMember[];
  onAddToTeam: (member: TeamPokemon) => void;
}

export function AddToTeamButton({
  id,
  image,
  name,
  types,
  team,
  onAddToTeam,
}: Pick<PokemonCardProps, "image" | "name" | "team" | "onAddToTeam"> & {
  id: number;
  types: string[];
}) {
  const isAdded = team.some((member) => member.id === id);
  const isFull = team.length >= MAX_TEAM_SIZE;

  return (
    <button
      type="button"
      className={`action-btn${isAdded ? " is-added" : ""}`}
      onClick={() => onAddToTeam({
        id,
        name,
        type: types.map((type) => TYPE_LABEL[type.toLowerCase()] ?? type).join("/"),
        role: DEFAULT_ROLE,
        nickname: "",
        image,
      })}
      disabled={!Number.isInteger(id) || id <= 0 || (!isAdded && isFull)}
    >
      {isAdded ? "추가됨" : isFull ? "팀이 가득 참" : "내 팀에 추가"}
    </button>
  );
}

function PokemonCard({
  id: idProp, // 추가
  image,
  number,
  name,
  type,
  types,
  team,
  onAddToTeam,
}: PokemonCardProps) {
  // 타입이 여러 개면 전부, 아니면 기존처럼 type 하나만 사용
  const typeList = types && types.length > 0 ? types : [type];

  // 수정: id가 오면 그대로 쓰고, 없으면 기존처럼 "#025" 같은 번호 문자열에서 숫자만 뽑아 사용
  const id = idProp ?? Number(number.replace(/\D/g, ""));
  const isAdded = team.some((member) => member.id === id);
  const { pathname, search } = useLocation();
  const detailPath = `/pokemon/${id}`;
  const detailState = { listSearch: pathname === "/pokemon" ? search : "" };

  return (
    <article className={`pokemon-card${isAdded ? " is-added" : ""}`}>
      <Link className="artwork" to={detailPath} state={detailState} aria-label={`${name} 상세 보기`}>
        <img src={image} alt="" />
      </Link>

      <span className="number">{number}</span>
      <h3 className="name">
        <Link to={detailPath} state={detailState}>
          {name}
        </Link>
      </h3>

      <div className="types">
        {typeList.map((t) => (
          <TypeChip key={t} type={t} />
        ))}
      </div>

      <AddToTeamButton
        id={id}
        image={image}
        name={name}
        types={typeList}
        team={team}
        onAddToTeam={onAddToTeam}
      />
    </article>
  );
}

export default PokemonCard;
