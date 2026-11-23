import Button from './Button';
import './StatePanel.css';

interface StatePanelAction {
  label: string;
  onClick?: () => void;
  to?: string;
}

interface StatePanelProps {
  tone?: 'default' | 'loading' | 'error';
  icon: string;
  title: string;
  description: string;
  action?: StatePanelAction;
  secondaryAction?: StatePanelAction;
}

function StatePanel({
  tone = 'default',
  icon,
  title,
  description,
  action,
  secondaryAction,
}: StatePanelProps) {
  return (
      <div className={`state-panel${tone === 'default' ? '' : ` state-panel--${tone}`}`}>
      <span className="state-panel__icon" aria-hidden="true">
        {icon}
      </span>
      <p className="state-panel__title">{title}</p>
      <p className="state-panel__description">{description}</p>
      {(action || secondaryAction) && (
        <div className="state-panel__action">
          {secondaryAction && (
            <Button
              variant="secondary"
              size="sm"
              onClick={secondaryAction.onClick}
              to={secondaryAction.to}
            >
              {secondaryAction.label}
            </Button>
          )}
          {action && (
            <Button variant="primary" size="sm" onClick={action.onClick} to={action.to}>
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default StatePanel;