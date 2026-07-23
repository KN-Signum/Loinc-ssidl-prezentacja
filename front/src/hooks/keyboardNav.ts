export const SEARCH_INPUT_ID = "activity-search-input";

export const isEditableElement = (el: Element | null): boolean => {
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    (el as HTMLElement).isContentEditable
  );
};
