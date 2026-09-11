/* eslint-disable react-refresh/only-export-components */
import type { CSSProperties, MouseEvent } from 'react'

export interface MemberProfile {
  potatoId: string
  name: string
  age: string
  school: string
  major: string
  mbti: string
  hobby: string
  message: string
}

// 이 파일을 src/members/본인이름.tsx로 복사한 뒤 아래 정보만 수정합니다.
export const memberProfile: MemberProfile = {
  potatoId: 'potato-08',
  name: '임성민',
  age: '02년생',
  school: '한국외국어대학교',
  major: '독일어전공',
  mbti: 'INTP',
  hobby: '독서, 영화감상, 운동, 게임, 음악감상, 글쓰기, 스포츠감상',
  message: '정말 열심히 하겠습니다. 감사합니다.',
}

interface MemberCardTemplateProps {
  profile: MemberProfile
  style?: CSSProperties
  onClose: () => void
  onClick: (event: MouseEvent<HTMLElement>) => void
}

const profileLabels: Array<[keyof MemberProfile, string]> = [
  ['age', '나이'],
  ['school', '학교'],
  ['major', '전공'],
  ['mbti', 'MBTI'],
  ['hobby', '취미'],
]

export default function MemberCardTemplate({
  profile,
  style,
  onClose,
  onClick,
}: MemberCardTemplateProps) {
  return (
    <article className="profile-card" style={style} onClick={onClick}>
      <button
        className="profile-card__close"
        type="button"
        aria-label="프로필 카드 닫기"
        onClick={onClose}
      >
        ×
      </button>
      <h2 className="profile-card__name">{profile.name} PROFILE</h2>
      <dl>
        {profileLabels.map(([key, label]) => (
          <div className="profile-card__row" key={key}>
            <dt>{label}</dt>
            <dd>{profile[key]}</dd>
          </div>
        ))}
      </dl>
      <p className="profile-card__quote">“ {profile.message} ”</p>
    </article>
  )
}
