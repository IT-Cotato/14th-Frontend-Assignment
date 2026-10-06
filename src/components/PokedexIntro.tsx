export default function PokedexIntro() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col gap-1.5">
        <span className="text-[30px] font-bold leading-normal text-neutral-ink">
          포켓몬 도감
        </span>
        <p className="text-body font-normal leading-[25px] text-neutral-muted">
          다양한 포켓몬을 만나고 팀에 추가해 보세요.
        </p>
      </div>
      <span className="flex items-center justify-center px-3 py-2 rounded-full bg-brand-yellow text-caption font-bold leading-normal text-neutral-ink">
        전체 151마리
      </span>
    </div>
  );
}
