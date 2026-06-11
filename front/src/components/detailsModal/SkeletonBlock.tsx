import React from "react";

export const SkeletonBlock: React.FC<{ className?: string }> = ({
  className = "",
}) => <div className={`animate-pulse rounded bg-slate-200 ${className}`} />;
