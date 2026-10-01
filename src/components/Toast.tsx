import "./Toast.css";

type ToastProps = {
    title: string;
    description: string;
};

function Toast({ title, description }: ToastProps) {
    return (
        <div className="toast" role="status" aria-live="polite">
            <span className="toast__badge" aria-hidden="true">
                ✓
            </span>
            <div className="toast__text">
                <p className="toast__title">{title}</p>
                <p className="toast__description">{description}</p>
            </div>
        </div>
    );
}

export default Toast;
