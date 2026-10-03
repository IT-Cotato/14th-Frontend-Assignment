// 포켓몬 한 마리의 모양. App, PokemonList에서도 쓰도록 export
export type Pokemon = {
  id: number;
  name: string;
  image: string;
  types: string[];
  nickname?: string;   // 별명 (없을 수도 있음)
  role?: string;       // 역할 (없을 수도 있음)
};

// 카드가 받는 props = 포켓몬 정보 + 상태 2개 + 버튼 눌렀을 때 실행할 함수
type PokemonCardProps = Pokemon & {
  onAdd: () => void;
  isAdded: boolean;      // 이 포켓몬이 이미 팀에 있는지
  isTeamFull: boolean;   // 팀이 꽉 찼는지
};

// 포켓몬 카드 하나를 그리는 컴포넌트
function PokemonCard({
  id,
  name,
  image,
  types,
  onAdd,
  isAdded,
  isTeamFull,
}: PokemonCardProps) {
  // 버튼을 막는 건 "팀이 꽉 찼고 + 아직 추가 안 된 카드"일 때만
  //  (추가됨 버튼은 눌러야 중복 안내가 뜨니까 막지 않음)
  const isDisabled = isTeamFull && !isAdded;

  // 상태에 따라 버튼 글자 정하기 (추가됨을 먼저 검사)
  let buttonText = '팀에 추가';
  if (isAdded) {
    buttonText = '추가됨';
  } else if (isTeamFull) {
    buttonText = '팀이 가득 찼어요';
  }

  return (
    // 추가된 카드면 added 클래스 → 민트 배경·테두리
    <div className={`card-box ${isAdded ? 'added' : ''}`}>

      <div className="img-box">
        <img
          className="pokemon-image"
          src={image}
          alt={name}
        />
      </div>

      <div className="pokemonNum">
        #{String(id).padStart(4, '0')}
        {/* 문자열의 길이가 4가 될 때까지 앞에 0을 붙여달라는 뜻 */}
      </div>

      <div className="pokemonName">
        {name}
      </div>

      <div className="attr-box">
        <div className="type-box">
          {types.map((type) => (
            <div
              key={type}
              className={`type-chip ${type.toLowerCase()}`}
            >
              {type}
            </div>
          ))}
        </div>
      </div>

      {/* 버튼을 누르면 부모에게서 받은 onAdd 함수가 실행됨 */}
      <button
        className={`button-box ${isAdded ? 'added' : ''}`}   // 추가됨이면 흰 버튼 모양
        onClick={onAdd}
        disabled={isDisabled}                                // 가득 참 + 미추가일 때만 못 누름
      >
        <div className="button-chip">
          {buttonText}
        </div>
      </button>

    </div>
  );
}

export default PokemonCard;