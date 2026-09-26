export default function PokemonHeader() {
    return (
        <div className="flex flex-col gap-6">
            <header className="flex w-full h-[72px] px-6 py-3.5 justify-between items-center shrink-0 rounded-lg border border-border-default bg-white">
                <div className="flex items-center gap-2.5">
                    <div className="flex gap-[10px] flex-col justify-center items-center w-[38px] h-[38px] rounded-lg bg-brand-red font-['Inter'] text-[11px] font-extrabold  text-text-inverse">
                        PM
                    </div>
                    <h2 className="text-title">PokéMate</h2>
                </div>
                <nav className="flex gap-2 items-center">
                    <button className="justify-start text-text-inverse text-[13px] font-bold font-['Noto_Sans_KR'] px-[14px] py-[9px] rounded-full bg-brand-red">
                        홈
                    </button>

                    <button className="justify-start text-neutral-muted text-[13px] font-bold font-['Noto_Sans_KR'] px-[14px] py-[9px] rounded-full bg-neutral-surface-strong">
                        도감
                    </button>
                    <button className="justify-start text-neutral-muted text-[13px] font-bold font-['Noto_Sans_KR'] px-[14px] py-[9px] rounded-full bg-neutral-surface-strong">
                        내 팀
                    </button>
                    <span className="text-caption " lang="en">
                        0/6
                    </span>
                </nav>
            </header>

            <section className=" shadow-card flex w-full h-max px-9 py-[34px] gap-9 justify-between items-center shrink-0 rounded-lg border border-border-default bg-white">
                <div className="flex flex-col gap-[14px] ">
                    <div className="justify-center w-max text-[13px] font-bold font-['Noto_Sans_KR'] px-[14px] py-[9px] rounded-full bg-brand-yellow">
                        오늘의 추천
                    </div>
                    <h1 className="text-text-primary font-['Noto_Sans_KR'] text-[34px] font-bold leading-[46px]">
                        포켓몬과 함께하는 하루
                    </h1>
                    <p className="text-text-secondary text-body " lang="ko">
                        좋아하는 포켓몬을 찾고 나만의 팀을 만들어 보세요.
                    </p>
                    <div className="flex gap-2.5">
                        <button
                            className="text-label rounded-lg py-3 px-5 bg-brand-red shadow-hard-red text-text-inverse"
                            lang="ko"
                        >
                            도감 보기
                        </button>
                        <button
                            className="text-label rounded-lg py-3 px-5 border border-border-strong shadow-card"
                            lang="ko"
                        >
                            내 팀
                        </button>
                    </div>
                </div>
                <div className="p-[17px] rounded-lg bg-neutral-surface-strong">
                    <img src="/0025.svg" className="w-[238px]" />
                </div>
            </section>
        </div>
    );
}
