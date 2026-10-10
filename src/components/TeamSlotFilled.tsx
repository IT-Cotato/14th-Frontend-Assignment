import { TYPE_LABEL } from "@/types/pokemon";

type Size = "md" | "sm";

const SIZE_CLASS: Record<Size, { container: string; button: string }> = {
  md: {
    container: "w-[560px] px-3.5 py-3",
    button: "px-5 py-3 text-label",
  },
  sm: {
    container: "w-[326px] p-3",
    button: "px-4 py-3 text-[13px]",
  },
};

interface TeamSlotFilledProps {
  size?: Size;
  id: string;
  image: string;
  name: string;
  type: string;
  role: string;
  removeFromTeam: (id: string) => void;
}

export default function TeamSlotFilled({
  size = "md",
  id,
  image,
  name,
  type,
  role,
  removeFromTeam,
}: TeamSlotFilledProps) {
  const s = SIZE_CLASS[size];

  return (
    <div
      className={`flex gap-2 px-3.5 py-3 justify-between items-center bg-white border border-neutral-line-strong rounded-lg shadow-[0_8px_24px_0_rgba(20,33,61,0.08)] ${s.container}`}
    >
      <div className="flex items-center justify-center w-16 h-16 bg-neutral-surface-strong rounded-md">
        <img src={image} className="size-14" />
      </div>
      <div className="flex flex-col gap-[3px] flex-1">
        <span className="text-neutral-ink text-[15px] font-bold leading-normal">
          {name}
        </span>
        <p className="text-neutral-muted text-caption leading-normal">
          {TYPE_LABEL[type]} · {role}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          className={`flex px-5 py-3 items-center justify-center rounded-md border border-neutral-line shadow-[0_8px_24px_0_rgba(20,33,61,0.08)] text-neutral-ink text-label font-bold leading-normal ${s.button}`}
        >
          편집
        </button>
        <button
          className={`flex px-5 py-3 items-center justify-center rounded-md bg-brand-red shadow-[0_8px_0_0_var(--color-brand-red-dark)] text-text-inverse text-label font-bold leading-normal ${s.button}`}
          onClick={() => removeFromTeam(id)}
        >
          삭제
        </button>
      </div>
    </div>
  );
}
