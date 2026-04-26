import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="mx-auto mt-4 w-full max-w-[88rem] px-6">
      <div className="rounded-t-2xl rounded-b-none border border-slate-200 bg-white/90 px-5 py-4 text-sm text-slate-500 shadow-sm backdrop-blur-sm text-center">
        <p>
          Aplikacja prezentacyjna bazy wiedzy zostala stworzona przez KN Signum
          we wspolpracy z HL7 Polska. {" "}
          <a
            href="/about"
            className="font-medium text-slate-500 underline-offset-4 transition-colors hover:text-slate-600 hover:underline"
          >
            Dowiedz sie wiecej
          </a>
        </p>
      </div>
    </footer>
  );
};
