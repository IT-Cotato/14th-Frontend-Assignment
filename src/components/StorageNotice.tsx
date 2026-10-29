import type { TeamLoadIssue } from '../utils/teamStorage.ts'

/** 불러오기 문제(손상·접근 불가)와 "팀 저장" 실패를 구분해 안내한다. */
export type StorageIssue = TeamLoadIssue | 'save-failed'

const messages: Record<StorageIssue, { title: string; description: string }> = {
  corrupted: {
    title: '저장 데이터에 문제가 있었어요',
    description:
      '저장된 팀 정보를 읽을 수 없어 빈 팀으로 복구했어요. 다시 팀을 구성해 저장해 주세요.',
  },
  unavailable: {
    title: '브라우저 저장소를 사용할 수 없어요',
    description:
      '저장된 팀을 불러오지 못해 빈 팀으로 시작해요. 이 브라우저에서는 ‘팀 저장’을 해도 새로고침 후 유지되지 않을 수 있어요.',
  },
  'save-failed': {
    title: '팀을 저장하지 못했어요',
    description:
      '브라우저 저장 공간이나 사이트 데이터 설정을 확인한 뒤 ‘팀 저장’을 다시 눌러 주세요. 마지막으로 저장한 팀은 그대로예요.',
  },
}

type StorageNoticeProps = {
  issue: StorageIssue
  onDismiss: () => void
}

/** 저장 데이터 문제를 알리는 안내 영역. 확인을 누르거나 저장에 성공하면 사라진다. */
function StorageNotice({ issue, onDismiss }: StorageNoticeProps) {
  const { title, description } = messages[issue]

  return (
    <div className="state-banner" role="alert">
      <span className="state-banner__icon" aria-hidden="true">
        !
      </span>
      <div className="state-banner__text">
        <p className="state-banner__title">{title}</p>
        <p className="state-banner__description">{description}</p>
      </div>
      <button
        type="button"
        className="button button--secondary button--slot"
        onClick={onDismiss}
      >
        확인
      </button>
    </div>
  )
}

export default StorageNotice
