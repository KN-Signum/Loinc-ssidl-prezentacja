import React from "react";

interface MarkdownTextProps {
  children: string;
  className?: string;
}

function parseInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export const MarkdownText: React.FC<MarkdownTextProps> = ({
  children,
  className = "",
}) => <span className={className}>{parseInline(children)}</span>;
