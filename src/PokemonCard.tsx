type PokemonCardProps = {
  id: number;
  name: string;
  image: string;
  type: string;
  imgClassName: string;
  numClassName: string;
  nameClassName: string;
  attrBoxClassName: string;
  attrClassName: string;
  buttonBoxClassName: string;
  buttonClassName: string;
};

function PokemonCard({
  id,
  name,
  image,
  type,
  imgClassName,
  numClassName,
  nameClassName,
  attrBoxClassName,
  attrClassName,
  buttonBoxClassName,
  buttonClassName,
}: PokemonCardProps) {
  return (
    <div className="card-box">

      <div className="img-box">
        <img
          className={`pokemon-image ${imgClassName}`}
          src={image}
          alt={name}
        />
      </div>

      <div className={numClassName}>
        #{String(id).padStart(4, '0')}
        {/* 문자열의 길이가 4가 될 때까지 앞에 0을 붙여달라는 뜻 */}
      </div>

      <div className={nameClassName}>
        {name}
      </div>

      <div className={attrBoxClassName}>
        <div className={attrClassName}>
          {type}
        </div>
      </div>

      <button className={buttonBoxClassName}>
        <div className={buttonClassName}>
          팀에 추가
        </div>
      </button>

    </div>
  );
}

export default PokemonCard;