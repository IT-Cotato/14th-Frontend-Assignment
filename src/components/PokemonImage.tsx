import { useState } from 'react'

type PokemonImageProps = {
  name: string
  imageUrl?: string
  className: string
  fallbackClassName: string
}

/**
 * 이미지 자산이 없거나 불러오지 못한 포켓몬은 깨진 이미지 대신 이름을 보여 주는 대체 UI를 그린다.
 * 저장된 팀의 이미지 주소가 더 이상 열리지 않아도 팀 데이터 문제로 보지 않고 여기서만 대체한다.
 */
function PokemonImage({
  name,
  imageUrl,
  className,
  fallbackClassName,
}: PokemonImageProps) {
  // 실패한 주소 자체를 기억한다. 다른 주소가 들어오면 실패 여부가 렌더링 중에 자동으로 다시 계산된다.
  const [failedUrl, setFailedUrl] = useState<string | null>(null)

  if (!imageUrl || failedUrl === imageUrl) {
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

  return (
    <img
      className={className}
      src={imageUrl}
      alt={`${name} 일러스트`}
      onError={() => setFailedUrl(imageUrl)}
    />
  )
}

export default PokemonImage
