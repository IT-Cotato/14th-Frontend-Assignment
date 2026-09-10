import type { CSSProperties, MouseEvent } from 'react'

export interface MemberProfile {
  name: string
  age: string
  school: string
  major: string
  mbti: string
  hobby: string
  message: string
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
