import TypeChip from "./TypeChip";
import {
  DEFAULT_ROLE,
  MAX_TEAM_SIZE,
  TYPE_LABEL,
  type TeamMember,
} from "./teamTypes";

interface PokemonCardProps {
  id?: number; // 추가: 있으면 번호 문자열 대신 이 값을 사용
  image: string;
  number: string;
  name: string;
  type: string;
  types?: string[];
  team: TeamMember[];
  onAddToTeam: (member: TeamMember) => void;
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
  const isFull = team.length >= MAX_TEAM_SIZE;

  const handleClick = () => {
    if (!Number.isInteger(id) || id <= 0) {
      console.error("포켓몬 번호를 읽지 못했어요:", number);
      return;
    }

    onAddToTeam({
      id,
      name,
      type: typeList.map((t) => TYPE_LABEL[t.toLowerCase()] ?? t).join("/"),
      role: DEFAULT_ROLE,
      nickname: "",
      image,
    });
  };

  const getLabel = () => {
    if (isAdded) return "추가됨";
    if (isFull) return "팀이 가득 참";
    return "팀에 추가";
  };

  return (
    <article className={`pokemon-card${isAdded ? " is-added" : ""}`}>
      <div className="artwork">
        <img src={image} alt={name} />
      </div>

      <span className="number">{number}</span>
      <h3 className="name">{name}</h3>

      <div className="types">
        {typeList.map((t) => (
          <TypeChip key={t} type={t} />
        ))}
      </div>

      <button
        className={`action-btn${isAdded ? " is-added" : ""}`}
        onClick={handleClick}
        disabled={!isAdded && isFull}
      >
        {getLabel()}
      </button>
    </article>
  );
}

export default PokemonCard;