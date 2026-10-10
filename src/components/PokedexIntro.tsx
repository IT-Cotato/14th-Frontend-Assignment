import { MAX_TEAM_SIZE } from "@/types/pokemon";

export default function PokedexIntro({ teamCount }: { teamCount: number }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col gap-1.5">
        <span className="text-[30px] font-bold leading-normal text-neutral-ink">
          포켓몬을 찾고 팀을 완성하세요
        </span>
        <p className="text-body font-normal leading-[25px] text-neutral-muted">
          도감과 나의 팀을 한 화면에서 관리할 수 있어요.
        </p>
      </div>
      <span className="flex items-center justify-center px-3 py-2 rounded-full bg-brand-yellow text-caption font-bold leading-normal text-neutral-ink">
        내 팀 {teamCount} / {MAX_TEAM_SIZE}
      </span>
    </div>
  );
}
