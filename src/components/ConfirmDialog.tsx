import type { MouseEvent } from "react";
import "./ConfirmDialog.css";

type ConfirmDialogProps = {
    title: string;
    description: string;
    confirmLabel: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

function ConfirmDialog({
    title,
    description,
    confirmLabel,
    cancelLabel = "취소",
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    function handleDialogClick(event: MouseEvent<HTMLDivElement>) {
        // dialog 안쪽 클릭이 오버레이의 onCancel까지 전파되지 않도록 막음
        event.stopPropagation();
    }

    return (
        <div className="confirm-dialog__overlay" onClick={onCancel}>
            <div
                className="confirm-dialog"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
                onClick={handleDialogClick}
            >
                <h2 id="confirm-dialog-title" className="confirm-dialog__title">
                    {title}
                </h2>
                <p
                    id="confirm-dialog-description"
                    className="confirm-dialog__description"
                >
                    {description}
                </p>
                <div className="confirm-dialog__actions">
                    <button
                        type="button"
                        className="confirm-dialog__button confirm-dialog__button--secondary"
                        onClick={onCancel}
                        autoFocus
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        className="confirm-dialog__button confirm-dialog__button--danger"
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;
