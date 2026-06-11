import React from "react";
import { ChevronLeft, LucideIcon } from "lucide-react";
import { Badge } from "../ui/badge";

export const DetailSection: React.FC<{
  variant?: "white" | "muted";
  children: React.ReactNode;
}> = ({ variant = "white", children }) => (
  <section
    className={`rounded-lg border border-slate-200 p-4 ${
      variant === "white" ? "bg-white shadow-sm" : "bg-slate-50/50"
    }`}
  >
    {children}
  </section>
);

export const SectionTitle: React.FC<{
  icon?: LucideIcon;
  className?: string;
  children: React.ReactNode;
}> = ({ icon: Icon, className = "", children }) => (
  <h4
    className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 ${className}`}
  >
    {Icon && <Icon className="h-4 w-4" />}
    {children}
  </h4>
);

export type CodeBadgeColor = "blue" | "violet" | "emerald";

const CODE_BADGE_COLORS: Record<CodeBadgeColor, string> = {
  blue: "text-blue-700 border-blue-200 bg-blue-50",
  violet: "text-violet-700 border-violet-200 bg-violet-50",
  emerald: "text-emerald-700 border-emerald-200 bg-emerald-50",
};

export const CodeBadge: React.FC<{
  color: CodeBadgeColor;
  mono?: boolean;
  children: React.ReactNode;
}> = ({ color, mono = true, children }) => (
  <Badge
    variant="outline"
    className={`w-fit ${CODE_BADGE_COLORS[color]}${mono ? " font-mono" : ""}`}
  >
    {children}
  </Badge>
);

export const BackButton: React.FC<{
  onClick: () => void;
  label: string;
}> = ({ onClick, label }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium mb-1 w-fit"
  >
    <ChevronLeft className="h-4 w-4" />
    Powrót do {label}
  </button>
);

export const MutedText: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className = "", children }) => (
  <p className={`text-sm text-slate-500 italic ${className}`}>{children}</p>
);

export const InfoCard: React.FC<{
  icon: LucideIcon;
  iconColorClass: string;
  label: string;
  value: string;
  valueClassName?: string;
  code?: string | null;
}> = ({
  icon: Icon,
  iconColorClass,
  label,
  value,
  valueClassName = "",
  code,
}) => (
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-3">
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${iconColorClass}`}
    >
      <Icon className="h-5 w-5" />
    </div>
    <div className="min-w-0">
      <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
        {label}
      </span>
      <div className="flex items-center gap-x-2 text-sm font-medium text-slate-800">
        <span className={`wrap-break-words ${valueClassName}`}>{value}</span>
        {code && (
          <>
            <span className="text-slate-300">|</span>
            <span className="font-mono text-slate-500">{code}</span>
          </>
        )}
      </div>
    </div>
  </div>
);
