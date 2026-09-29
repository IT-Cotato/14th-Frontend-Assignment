import type { ReactNode } from 'react';
import './Dialog.css';

interface DialogProps {
  titleId: string;
  children: ReactNode;
}

function Dialog({ titleId, children }: DialogProps) {
  return (
    <div className="dialog-backdrop">
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        {children}
      </div>
    </div>
  );
}

export default Dialog;