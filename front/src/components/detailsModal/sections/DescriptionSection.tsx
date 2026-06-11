import React from "react";
import { MarkdownText } from "../../ui/MarkdownText";
import { DESCRIPTION_CHAR_LIMIT } from "../types";
import { DetailSection, SectionTitle } from "../primitives";

export const DescriptionSection: React.FC<{
  description: string;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ description, isExpanded, onToggle }) => {
  if (!description) return null;

  const isLong = description.length > DESCRIPTION_CHAR_LIMIT;
  const displayed =
    isLong && !isExpanded
      ? description.slice(0, DESCRIPTION_CHAR_LIMIT) + "..."
      : description;

  return (
    <DetailSection variant="muted">
      <SectionTitle className="mb-2">Opis</SectionTitle>
      <MarkdownText>{displayed}</MarkdownText>
      {isLong && (
        <button
          onClick={onToggle}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium underline"
        >
          {isExpanded ? "pokaż mniej" : "pokaż więcej"}
        </button>
      )}
    </DetailSection>
  );
};
