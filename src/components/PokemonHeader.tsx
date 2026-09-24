import pikachuImg from "../assets/pokemon/Pikachu.png";
import SearchIcon from "../assets/search.svg?react";

export default function PokemonHeader() {
  return (
    <div className="flex flex-col gap-6">
      <section className="flex justify-between px-6 py-2.5 rounded-lg border border-neutral-line bg-white">
        <div className="flex items-center gap-2.5">
          <span className="flex w-[38px] h-[38px] items-center justify-center rounded-lg bg-brand-red text-text-inverse text-[11px] font-extrabold leading-none">
            PM
          </span>
          <p className="text-xl font-extrabold text-neutral-ink leading-none">
            PokéMate
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center px-[14px] py-[9px] rounded-full bg-brand-red text-text-inverse text-[13px] font-bold leading-none">
            홈
          </button>
          <button className="flex items-center justify-center px-[14px] py-[9px] rounded-full bg-neutral-surface-strong text-neutral-muted text-[13px] font-bold leading-none">
            도감
          </button>
          <button className="flex items-center justify-center px-[14px] py-[9px] rounded-full bg-neutral-surface-strong text-neutral-muted text-[13px] font-bold leading-none">
            내팀
          </button>
          <p className="text-neutral-ink text-caption font-bold">0 / 6</p>
        </div>
      </section>

      <section className="flex px-9 py-8.5 gap-9 justify-between rounded-2xl border border-border-strong shadow-[0_8px_24px_0_rgba(20,33,61,0.08)] bg-white">
        <div className="flex flex-col gap-3.5">
          <span className="flex items-center justify-center px-3 py-2 bg-brand-yellow rounded-full text-caption font-bold leading-none text-neutral-ink w-fit">
            오늘의 추천
          </span>
          <span className="text-[36px] font-bold leading-[46px] text-neutral-ink">
            포켓몬과 함께하는 하루
          </span>
          <p className="text-body font-regular leading-[26px] text-neutral-muted">
            좋아하는 포켓몬을 찾고 나만의 팀을 만들어 보세요.
          </p>
          <div className="flex gap-2.5">
            <button className="flex items-center justify-center px-5 py-3 rounded-md text-[14px] font-bold text-text-inverse bg-brand-red shadow-[0_8px_0_0_var(--color-brand-red-dark)]">
              도감 보기
            </button>
            <button className="flex items-center justify-center px-4 py-3 rounded-md border border-border-strong bg-white shadow-[0_8px_24px_0_rgba(20,33,61,0.08)] text-[14px] font-bold leading-none text-neutral-ink">
              내 팀
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center w-[238px] h-[238px] rounded-3xl bg-neutral-surface-strong p-[17px]">
          <img src={pikachuImg} alt="피카츄" className="w-52 h-52" />
        </div>
      </section>

      <section className="flex relative gap-3 w-170">
        <div className="absolute left-3.5 top-4">
          <SearchIcon />
        </div>
        <input
          type="text"
          placeholder="이름 또는 번호"
          className="flex items-center bg-white pl-12 pr-[14px] py-[11px] border border-neutral-line placeholder:text-[13px] placeholder:font-medium placeholder:text-[#8AA0B8] rounded-md flex-1 outline-none"
        />
        <button className="flex items-center justify-center px-5 py-3 rounded-md bg-brand-red shadow-[0_8px_0_0_var(--color-brand-red-dark)] text-[14px] font-bold leading-normal text-text-inverse">
          검색
        </button>
      </section>
    </div>
  );
}
