import { TYPE_BG_CLASS, type Pokemon } from "@/types/pokemon";

export default function PokemonCard({ id, name, image, type }: Pokemon) {
  return (
    <div className="flex flex-col items-center w-[260px] gap-3.5 p-4.5 rounded-lg border border-neutral-line shadow-[0_8px_24px_0_rgba(20,33,61,0.08)] bg-white">
      <div className="flex items-center justify-center w-[140px] h-[140px] rounded-2xl bg-neutral-surface-strong p-2.5">
        <img src={image} alt={name} className="size-30" />
      </div>
      <p className="text-caption font-semibold leading-none text-neutral-muted">
        {id}
      </p>
      <span className="text-[18px] font-bold leading-none text-neutral-ink">
        {name}
      </span>
      <div
        className={`flex items-center justify-center ${TYPE_BG_CLASS[type]} uppercase  text-text-inverse rounded-full text-[11px] font-semibold px-3 py-2`}
      >
        {type}
      </div>
      <button className="flex items-center justify-center px-4 py-3 bg-brand-red rounded-md text-[17px] text-text-inverse font-bold shadow-[0_8px_0_0_var(--color-brand-red-dark)]">
        팀에 추가
      </button>
    </div>
  );
}
