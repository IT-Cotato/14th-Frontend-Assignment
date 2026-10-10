import TeamList from "@/components/TeamList";
import { MAX_TEAM_SIZE, type TeamMember } from "@/types/pokemon";

export default function TeamPage({
  team,
  removeFromTeam,
  onSave,
  onCancel,
}: {
  team: TeamMember[];
  removeFromTeam: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <span className="text-neutral-ink text-[30px] font-bold leading-normal">
            나의 팀
          </span>
          <p className="text-neutral-muted text-[15px] leading-[25px]">
            최대 6마리의 포켓몬으로 나만의 팀을 완성하세요.
          </p>
        </div>

        <span className="flex px-3 py-2 items-center justify-center rounded-full bg-brand-yellow text-neutral-ink text-caption font-bold leading-normal">
          {team.length} / {MAX_TEAM_SIZE}
        </span>

        <div className="flex gap-2.5">
          <button
            className="flex px-5 py-3 items-center justify-center rounded-md bg-brand-red shadow-[0_8px_0_0_var(--color-brand-red-dark)] text-text-inverse text-label font-bold leading-normal"
            onClick={onSave}
          >
            팀 저장
          </button>
          <button
            className="flex px-5 py-3 items-center justify-center rounded-md border border-border-strong shadow-[0_8px_24px_0_rgba(20,33,61,0.08)] text-neutral-ink text-label font-bold leading-normal"
            onClick={onCancel}
          >
            취소
          </button>
        </div>
      </div>

      <TeamList team={team} removeFromTeam={removeFromTeam} />
    </div>
  );
}
