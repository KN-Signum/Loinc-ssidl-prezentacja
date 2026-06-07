import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="mx-auto mt-4 w-full max-w-[88rem] px-6">
      <div className="rounded-t-2xl rounded-b-none border border-slate-200 bg-white/90 px-5 py-4 text-sm text-slate-500 shadow-sm backdrop-blur-sm text-center">
        <p>
          Aplikacja powstała w ramach <a href="https://projekty.umed.pl/br/wdrozenie-slownika-loinc-w-obszarze-diagnostyki-laboratoryjnej-oraz-opracowanie-prototypu-systemu-standaryzacji-informacji-w-diagnostyce-laboratoryjnej/" target="_blank" rel="noreferrer" className="font-medium text-slate-600 underline-offset-4 transition-colors hover:text-slate-800 hover:underline">projektu wdrożenia słownika LOINC w diagnostyce laboratoryjnej</a> we współpracy z <a href="https://www.knsignum.pl/pl" target="_blank" rel="noreferrer" className="font-medium text-slate-600 underline-offset-4 transition-colors hover:text-slate-800 hover:underline">Kołem Naukowym Signum</a>.
        </p>
      </div>
    </footer>
  );
};
