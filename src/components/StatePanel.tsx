import "./StatePanel.css";

type StatePanelVariant = "empty" | "loading" | "error";

type StatePanelProps = {
    variant?: StatePanelVariant;
    title: string;
    description: string;
} & (
    | { actionLabel: string; onAction: () => void }
    | { actionLabel?: never; onAction?: never }
);

const badgeSymbols: Record<StatePanelVariant, string> = {
    empty: "0",
    loading: "…",
    error: "!",
};

const panelRoles: Record<StatePanelVariant, "status" | "alert" | undefined> = {
    empty: undefined,
    loading: "status",
    error: "alert",
};

function StatePanel({
    variant = "empty",
    title,
    description,
    actionLabel,
    onAction,
}: StatePanelProps) {
    return (
        <div
            className={`state-panel state-panel--${variant}`}
            role={panelRoles[variant]}
        >
            <span className="state-panel__badge" aria-hidden="true">
                {badgeSymbols[variant]}
            </span>
            <p className="state-panel__title">{title}</p>
            <p className="state-panel__description">{description}</p>
            {actionLabel !== undefined && (
                <button
                    type="button"
                    className="state-panel__action"
                    onClick={onAction}
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}

export default StatePanel;
