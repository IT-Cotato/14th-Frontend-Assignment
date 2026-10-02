type PokemonImageProps = {
  name: string
  imageUrl?: string
  className: string
  fallbackClassName: string
}

/** 이미지 자산이 없는 포켓몬은 깨진 이미지 대신 이름을 보여 주는 대체 UI를 그린다. */
function PokemonImage({
  name,
  imageUrl,
  className,
  fallbackClassName,
}: PokemonImageProps) {
  if (!imageUrl) {
    return (
      <span
        className={fallbackClassName}
        role="img"
        aria-label={`${name} 이미지 준비 중`}
      >
        {name}
      </span>
    )
  }

  return <img className={className} src={imageUrl} alt={`${name} 일러스트`} />
}

export default PokemonImage
