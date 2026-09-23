import "./StatePanel.css";

type StatePanelProps = {
    title: string;
    description: string;
};

function StatePanel({ title, description }: StatePanelProps) {
    return (
        <div className="state-panel">
            <span className="state-panel__badge" aria-hidden="true">
                0
            </span>
            <p className="state-panel__title">{title}</p>
            <p className="state-panel__description">{description}</p>
        </div>
    );
}

export default StatePanel;
