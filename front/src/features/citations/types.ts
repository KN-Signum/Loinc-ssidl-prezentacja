export interface CitationRange {
  low?: {
    value?: number;
    unit?: string;
  };
  high?: {
    value?: number;
    unit?: string;
  };
}

export interface CitationItem {
  citation?: any;
  citationId?: string;
  age?: CitationRange | null;
  range?: CitationRange | null;
  message?: string;
}
