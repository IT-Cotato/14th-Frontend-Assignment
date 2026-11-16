import { Link } from "react-router";
import "./StatePanel.css";

type StatePanelVariant = "empty" | "loading" | "error" | "notFound";

type StatePanelLink = {
    label: string;
    to: string;
    variant: "primary" | "secondary";
};

type StatePanelProps = {
    variant?: StatePanelVariant;
    title: string;
    description: string;
} & (
    | { actionLabel: string; onAction: () => void; links?: never }
    | { actionLabel?: never; onAction?: never; links?: StatePanelLink[] }
);

const variantClassNames: Record<StatePanelVariant, string> = {
    empty: "state-panel--empty",
    loading: "state-panel--loading",
    error: "state-panel--error",
    notFound: "state-panel--not-found",
};

const badgeSymbols: Record<StatePanelVariant, string> = {
    empty: "0",
    loading: "…",
    error: "!",
    notFound: "!",
};

const panelRoles: Record<StatePanelVariant, "status" | "alert" | undefined> = {
    empty: undefined,
    loading: "status",
    error: "alert",
    notFound: undefined,
};

function StatePanel({
    variant = "empty",
    title,
    description,
    actionLabel,
    onAction,
    links,
}: StatePanelProps) {
    return (
        <div
            className={`state-panel ${variantClassNames[variant]}`}
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
            {links !== undefined && (
                <div className="state-panel__actions">
                    {links.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`state-panel__action${
                                link.variant === "secondary"
                                    ? " state-panel__action--secondary"
                                    : ""
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default StatePanel;
