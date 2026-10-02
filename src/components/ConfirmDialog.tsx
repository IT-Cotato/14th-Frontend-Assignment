import { useId } from 'react'
import type { RefObject } from 'react'
import Dialog from './Dialog.tsx'

type ConfirmDialogProps = {
  title: string
  description: string
  confirmLabel: string
  returnFocusFallback?: RefObject<HTMLElement | null>
  onConfirm: () => void
  onCancel: () => void
}

/** 되돌리기 어려운 동작 전에 한 번 더 묻는 작은 확인 창. 첫 포커스는 취소 버튼이다. */
function ConfirmDialog({
  title,
  description,
  confirmLabel,
  returnFocusFallback,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId()
  const descriptionId = useId()

  return (
    <Dialog
      role="alertdialog"
      className="dialog--confirm"
      titleId={titleId}
      descriptionId={descriptionId}
      returnFocusFallback={returnFocusFallback}
      onClose={onCancel}
    >
      <div className="dialog__body">
        <div className="dialog__header">
          <h2 id={titleId} className="dialog__title dialog__title--small">
            {title}
          </h2>
          <p id={descriptionId} className="dialog__description">
            {description}
          </p>
        </div>
        <div className="dialog__actions">
          <button
            type="button"
            className="button button--secondary button--slot"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            type="button"
            className="button button--primary button--slot"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Dialog>
  )
}

export default ConfirmDialog
