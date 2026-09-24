function StatePanel() {
  return (
    <div className="empty-state">
      <div className="empty-state__symbol">0</div>

      <p className="empty-state__title">
        검색 결과가 없어요
      </p>

      <p className="empty-state__description">
        다른 이름이나 번호로 검색해 보세요.
      </p>
    </div>
  );
}

export default StatePanel; 