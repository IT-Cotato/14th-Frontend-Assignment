// 포켓몬 한 마리의 모양. App, PokemonList에서도 쓰도록 export
export type Pokemon = {
  id: number;
  name: string;
  image: string;
  types: string[];
  nickname?: string;   // 별명 (없을 수도 있음)
  role?: string;       // 역할 (없을 수도 있음)
};

// 카드가 받는 props = 포켓몬 정보 + 버튼 눌렀을 때 실행할 함수
type PokemonCardProps = Pokemon & {
  onAdd: () => void;
  disabled: boolean;
};

// 포켓몬 카드 하나를 그리는 컴포넌트
function PokemonCard({
  id,
  name,
  image,
  types,
  onAdd,
  disabled,
}: PokemonCardProps) {
  return (
    <div className="card-box">

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
        className="button-box" 
        onClick={onAdd}
        disabled={disabled}
      >
        <div className="button-chip">
          {disabled ? '팀이 가득 찼어요' : '팀에 추가'}
        </div>
      </button>

    </div>
  );
}

export default PokemonCard;