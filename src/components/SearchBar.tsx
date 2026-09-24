import SearchIcon from "@/assets/search.svg?react";

export default function SearchBar() {
  return (
    <div className="flex relative gap-3 w-170">
      <div className="absolute left-3.5 top-4">
        <SearchIcon />
      </div>
      <input
        type="text"
        placeholder="이름 또는 번호"
        className="flex items-center bg-white pl-12 pr-[14px] py-[11px] border border-neutral-line placeholder:text-[13px] placeholder:font-medium placeholder:text-[#8AA0B8] rounded-md flex-1 outline-none"
        aria-label="포켓몬 검색"
      />
      <button className="flex items-center justify-center px-5 py-3 rounded-md bg-brand-red shadow-[0_8px_0_0_var(--color-brand-red-dark)] text-[14px] font-bold leading-normal text-text-inverse">
        검색
      </button>
    </div>
  );
}
