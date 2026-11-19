interface StatusCardProps {
  icon: string;
  title: string;
  description: string;
  detail?: string;
  variant?: 'loading' | 'error';
  onRetry?: () => void;
}

function StatusCard({
  icon,
  title,
  description,
  detail,
  variant,
  onRetry,
}: StatusCardProps) {
  return (
    <div
      className={`status-card ${
        variant === 'loading'
          ? 'status-card-loading'
          : variant === 'error'
            ? 'status-card-error'
            : ''
      }`}
    >
      <span className="status-icon">{icon}</span>
      <strong>{title}</strong>
      <p>{description}</p>
      {detail && <small>{detail}</small>}
      {onRetry && (
        <button className="red-shadow-button" type="button" onClick={onRetry}>
          다시 시도
        </button>
      )}
    </div>
  );
}

export default StatusCard;
