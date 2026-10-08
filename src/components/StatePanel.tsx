type StatePanelProps = {
  symbol?: string;
  title?: string;
  description?: string;
  variant?: "empty" | "error";
  actionLabel?: string;
  onAction?: () => void;
};

function StatePanel({
  symbol = "0",
  title = "검색 결과가 없어요",
  description = "다른 이름이나 번호로 검색해 보세요.",
  variant = "empty",
  actionLabel,
  onAction,
}: StatePanelProps) {
  return (
    <div className={`empty-state${variant === "error" ? " empty-state--error" : ""}`}>
      <div className="empty-state__symbol">{symbol}</div>

      <p className="empty-state__title">
        {title}
      </p>

      <p className="empty-state__description">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          className="empty-state__action"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default StatePanel;