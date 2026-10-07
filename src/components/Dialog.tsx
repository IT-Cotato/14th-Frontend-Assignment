import { useEffect, useRef } from 'react'
import type { ReactNode, RefObject } from 'react'

type DialogProps = {
  titleId: string
  descriptionId?: string
  /** 삭제 확인처럼 즉시 응답이 필요한 창은 alertdialog로 알린다. */
  role?: 'alertdialog'
  className?: string
  /** 닫힌 뒤 원래 버튼이 사라졌을 때(삭제 등) 대신 포커스를 받을 요소 */
  returnFocusFallback?: RefObject<HTMLElement | null>
  onClose: () => void
  children: ReactNode
}

/**
 * 네이티브 <dialog>의 showModal로 여는 모달.
 * 포커스 가두기·배경 비활성화는 브라우저가 처리하고, Esc는 onClose로 연결한다.
 * 화면에 그려져 있는 동안만 열려 있으므로 열림 여부는 부모 state가 결정한다.
 */
function Dialog({
  titleId,
  descriptionId,
  role,
  className = '',
  returnFocusFallback,
  onClose,
  children,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    const fallback = returnFocusFallback?.current ?? null
    dialog.showModal()

    return () => {
      dialog.close()
      // 열기 전 버튼으로 포커스를 돌려준다. 그 버튼이 사라졌다면 대체 요소로 보낸다.
      const target = previouslyFocused?.isConnected ? previouslyFocused : fallback
      target?.focus()
    }
  }, [returnFocusFallback])

  return (
    <dialog
      ref={dialogRef}
      className={`dialog ${className}`.trim()}
      role={role}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        // Esc: 브라우저가 직접 닫지 않게 막고 부모 state로 닫는다.
        event.preventDefault()
        onClose()
      }}
      onClose={(event) => {
        // 브라우저가 강제로 닫은 경우에만 state를 맞춘다.
        if (!event.currentTarget.open) onClose()
      }}
    >
      {children}
    </dialog>
  )
}

export default Dialog
