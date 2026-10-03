import { useEffect } from "react";

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
};

function ConfirmDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="confirm-title" className="dialog__title">
          {title}
        </h3>
        <p className="dialog__desc">{description}</p>

        <div className="dialog__actions">
          <button
            type="button"
            className="team-btn team-btn--secondary"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            className="team-btn team-btn--primary"
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