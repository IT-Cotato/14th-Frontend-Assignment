import './StatePanel.css';

interface StatePanelProps {
  icon: string;
  title: string;
  description: string;
}

function StatePanel({ icon, title, description }: StatePanelProps) {
  return (
    <div className="state-panel">
      <span className="state-panel__icon" aria-hidden="true">
        {icon}
      </span>
      <p className="state-panel__title">{title}</p>
      <p className="state-panel__description">{description}</p>
    </div>
  );
}

export default StatePanel;
