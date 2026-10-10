import SlotRectangle from "@/assets/slot-rectangle.svg?react";

export default function TeamSlotEmpty() {
  return (
    <div className="flex gap-3 w-[560px] px-3.5 py-3 justify-between items-center bg-white border border-neutral-line rounded-lg shadow-[0_8px_24px_0_rgba(20,33,61,0.08)]">
      <div className="flex flex-col gap-[3px]">
        <span className="text-neutral-ink text-[15px] font-bold leading-normal">
          빈 슬롯
        </span>
        <p className="text-neutral-muted text-caption leading-normal">
          포켓몬을 추가해 보세요.
        </p>
      </div>
      <div className="flex flex-col gap-[3px] w-25 p-2 rounded-md bg-neutral-surface-strong">
        <SlotRectangle />
        <SlotRectangle />
        <SlotRectangle />
      </div>
    </div>
  );
}
