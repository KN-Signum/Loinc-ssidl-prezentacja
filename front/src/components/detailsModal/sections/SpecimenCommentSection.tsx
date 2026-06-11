import React from "react";

export const SpecimenCommentSection: React.FC<{
  comment: string | null;
}> = ({ comment }) => {
  if (!comment) return null;

  return (
    <div className="pt-2 border-t border-slate-200 mt-2">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
        Komentarz
      </span>
      <p className="text-sm text-slate-700 leading-relaxed">{comment}</p>
    </div>
  );
};
