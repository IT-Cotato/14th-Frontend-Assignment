import TitleBadge from "../components/TitleBadge";

export default function HomePanel() {
    return (
        <section className=" shadow-card flex w-full h-max px-9 py-[34px] gap-9 justify-between items-center shrink-0 rounded-lg border border-border-default bg-white">
            <div className="flex flex-col gap-[14px] ">
                <TitleBadge>오늘의 추천</TitleBadge>
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
    );
}
