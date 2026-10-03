type StatePanelProps = {
  symbol?: string;
  title?: string;
  description?: string;
};

function StatePanel({
  symbol = "0",
  title = "검색 결과가 없어요",
  description = "다른 이름이나 번호로 검색해 보세요.",
}: StatePanelProps) {
  return (
    <div className="empty-state">
      <div className="empty-state__symbol">{symbol}</div>

      <p className="empty-state__title">
        {title}
      </p>

      <p className="empty-state__description">
        {description}
      </p>
    </div>
  );
}

export default StatePanel;