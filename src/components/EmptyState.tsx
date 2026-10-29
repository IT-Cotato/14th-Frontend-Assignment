export default function EmptyState() {
    return (
        <section className="shadow-card flex flex-col w-full h-max px-9 py-[34px] gap-[10px] items-center rounded-lg border border-border-default bg-white">
            <div className="flex rounded-full text-[18px] font-bold items-center justify-center bg-brand-yellow w-[44px] h-[44px]">
                0
            </div>
            <h3 className="text-text-primary font-['Noto_Sans_KR'] text-[16px] font-bold">
                검색 결과가 없어요
            </h3>
            <p className="text-text-secondary text-body text-[13px]" lang="ko">
                다른 이름이나 번호로 검색해 보세요.
            </p>
        </section>
    );
}
