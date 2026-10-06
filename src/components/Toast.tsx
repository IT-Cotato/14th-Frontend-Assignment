import "./Toast.css";

export type ToastVariant = "success" | "error";

type ToastProps = {
    variant: ToastVariant;
    title: string;
    description: string;
};

function Toast({ variant, title, description }: ToastProps) {
    return (
        <div
            className="toast"
            role={variant === "error" ? "alert" : "status"}
            aria-live={variant === "error" ? "assertive" : "polite"}
        >
            <span
                className={`toast__badge toast__badge--${variant}`}
                aria-hidden="true"
            >
                {variant === "error" ? "!" : "✓"}
            </span>
            <div className="toast__text">
                <p className="toast__title">{title}</p>
                <p className="toast__description">{description}</p>
            </div>
        </div>
    );
}

export default Toast;
