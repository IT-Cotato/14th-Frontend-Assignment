import type { ReactNode } from 'react'

export type StatePanelVariant = 'loading' | 'empty' | 'error'

/** 원 안의 기호. 시안: Loading 파란 원 '…', Empty 노란 원 '0', Error 분홍 원 '!' */
const icons: Record<StatePanelVariant, string> = {
  loading: '…',
  empty: '0',
  error: '!',
}

type StatePanelProps = {
  variant: StatePanelVariant
  title: string
  description: ReactNode
  /** Error의 ‘다시 시도’ 버튼. 넘기면 primary 버튼으로 그린다. */
  onRetry?: () => void
  /** 그 밖의 추가 동작 (예: Empty의 조건 초기화) */
  children?: ReactNode
}

/** 카드 목록 대신 보여 주는 Loading·Empty·Error 영역. */
function StatePanel({ variant, title, description, onRetry, children }: StatePanelProps) {
  return (
    <div
      className={`state-panel state-panel--${variant}`}
      // 로딩은 조용히, 오류는 바로 알린다. Empty 개수 안내는 목록의 role="status"가 맡는다.
      role={variant === 'error' ? 'alert' : variant === 'loading' ? 'status' : undefined}
    >
      <span className="state-panel__icon" aria-hidden="true">
        {icons[variant]}
      </span>
      <p className="state-panel__title">{title}</p>
      <p className="state-panel__description">{description}</p>
      {onRetry && (
        <button
          type="button"
          // 시안의 ‘다시 시도’는 카드 버튼과 같은 크기에 아래쪽 진한 그림자를 쓴다.
          className="button button--primary button--card state-panel__action"
          onClick={onRetry}
        >
          다시 시도
        </button>
      )}
      {children}
    </div>
  )
}

export default StatePanel
