export type NoticeTone = 'success' | 'info' | 'warning'

export interface Notice {
  id: number
  tone: NoticeTone
  message: string
}

/** 색상만으로 구분하지 않도록 아이콘 옆에 상태 문구를 함께 적는다. */
const toneLabels: Record<NoticeTone, string> = {
  success: '완료',
  info: '안내',
  warning: '확인 필요',
}

type ToastProps = {
  notice: Notice | null
}

/**
 * 화면 아래쪽에 잠깐 나타나는 상태 안내.
 * 스크린 리더가 읽을 수 있도록 live region은 항상 그려 두고 내용만 바꾼다.
 */
function Toast({ notice }: ToastProps) {
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {notice && (
        <p key={notice.id} className={`toast toast--${notice.tone}`}>
          <span className="toast__label">{toneLabels[notice.tone]}</span>
          <span>{notice.message}</span>
        </p>
      )}
    </div>
  )
}

export default Toast
