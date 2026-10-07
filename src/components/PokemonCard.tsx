import TypeChip from "./TypeChip";
import {
  DEFAULT_ROLE,
  MAX_TEAM_SIZE,
  TYPE_LABEL,
  type TeamMember,
} from "./teamTypes";

interface PokemonCardProps {
  image: string;
  number: string;
  name: string;
  type: string;
  team: TeamMember[];
  onAddToTeam: (member: TeamMember) => void;
}

function PokemonCard({
  image,
  number,
  name,
  type,
  team,
  onAddToTeam,
}: PokemonCardProps) {
  // "#025" 같은 번호 문자열에서 숫자만 뽑아 id로 사용
  const id = Number(number.replace(/\D/g, ""));
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
      type: TYPE_LABEL[type.toLowerCase()] ?? type,
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
      <TypeChip type={type} />

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