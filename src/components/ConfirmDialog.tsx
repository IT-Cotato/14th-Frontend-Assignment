import Button from './Button';
import Dialog from './Dialog';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

function ConfirmDialog({ title, message, confirmLabel, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <Dialog titleId="confirm-dialog-title">
      <h2 id="confirm-dialog-title" className="dialog__title">
        {title}
      </h2>
      <p className="confirm-dialog__message">{message}</p>

      <div className="dialog__actions">
        <Button variant="secondary" onClick={onCancel}>
          취소
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}

export default ConfirmDialog;