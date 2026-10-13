import Button from './Button';
import './StatePanel.css';

interface StatePanelProps {
  tone?: 'default' | 'error';
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function StatePanel({ tone = 'default', icon, title, description, action }: StatePanelProps) {
  return (
    <div className={`state-panel${tone === 'error' ? ' state-panel--error' : ''}`}>
      <span className="state-panel__icon" aria-hidden="true">
        {icon}
      </span>
      <p className="state-panel__title">{title}</p>
      <p className="state-panel__description">{description}</p>
      {action && (
        <div className="state-panel__action">
          <Button variant="primary" size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}

export default StatePanel;