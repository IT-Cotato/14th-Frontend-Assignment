export type Notice = {
  type: "success" | "info";
  text: string;
  duration: number;
};

type ToastProps = {
  notice: Notice | null;
};

function Toast({ notice }: ToastProps) {
  if (!notice) return null;

  return (
    <div className={`toast toast--${notice.type}`} role="status">
      {notice.text}
    </div>
  );
}

export default Toast;