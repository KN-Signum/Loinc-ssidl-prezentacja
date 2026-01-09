type BaseSwitcherProps = {
  knowledgeBase: boolean;
  setKnowledgeBase: (value: boolean) => void;
};

const BaseSwitcher = ({ knowledgeBase, setKnowledgeBase }: BaseSwitcherProps) => {
  return (
    <div
      role="tablist"
      aria-label="Przełącz widok"
      className="flex gap-12 w-3/4 justify-center"
    >
      <button
        role="tab"
        aria-selected={!knowledgeBase}
        className={`h-11 px-0 text-[15px] md:text-base transition-colors border-b-2 flex-1 ${
          !knowledgeBase
            ? "border-blue-600 text-blue-700 font-semibold"
            : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
        }`}
        onClick={() => setKnowledgeBase(false)}
      >
        Katalog usług medycznych
      </button>
      <button
        role="tab"
        aria-selected={knowledgeBase}
        className={`text-[15px] md:text-base transition-colors border-b-2 flex-1 ${
          knowledgeBase
            ? "border-blue-600 text-blue-700 font-semibold"
            : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
        }`}
        onClick={() => setKnowledgeBase(true)}
      >
        Baza wiedzy
      </button>
    </div>
  );
};

export default BaseSwitcher;