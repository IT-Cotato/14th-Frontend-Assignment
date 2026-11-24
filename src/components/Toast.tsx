import './Toast.css';

interface ToastProps {
  message: string;
  tone?: 'default' | 'error';
}

function Toast({ message, tone = 'default' }: ToastProps) {
  return (
    <div
      className={`toast${tone === 'error' ? ' toast--error' : ''}`}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {message}
    </div>
  );
}

export default Toast;