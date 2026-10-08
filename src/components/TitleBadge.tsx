export default function badge({ children }: { children: React.ReactNode }) {
    return (
        <div className="justify-center w-max h-max text-[13px] font-bold font-['Noto_Sans_KR'] px-[14px] py-[9px] rounded-full bg-brand-yellow">
            {children}
        </div>
    );
}
