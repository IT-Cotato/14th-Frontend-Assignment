/* eslint-disable react-refresh/only-export-components */
import type { CSSProperties, MouseEvent } from "react";

export interface MemberProfile {
  potatoId: string;
  name: string;
  age: string;
  school: string;
  major: string;
  mbti: string;
  hobby: string;
  message: string;
}

// 이 파일을 src/members/본인이름.tsx로 복사한 뒤 아래 정보만 수정합니다.
export const memberProfile: MemberProfile = {
  potatoId: "potato-09",
  name: "박은진",
  age: "04년생",
  school: "덕성여자대학교",
  major: "디지털소프트웨어공학부",
  mbti: "ISFP",
  hobby: "드럼",
  message: "안녕하세요! 만나서 반갑습니다 ~.~ 친해져요 ㅎㅎ",
};

interface MemberCardTemplateProps {
  profile: MemberProfile;
  style?: CSSProperties;
  onClose: () => void;
  onClick: (event: MouseEvent<HTMLElement>) => void;
}

const profileLabels: Array<[keyof MemberProfile, string]> = [
  ["age", "나이"],
  ["school", "학교"],
  ["major", "전공"],
  ["mbti", "MBTI"],
  ["hobby", "취미"],
];

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
  );
}
