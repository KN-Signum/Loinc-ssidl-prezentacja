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

export interface CitationWebLocation {
  url?: string;
}

export interface CitedArtifact {
  webLocation?: CitationWebLocation[];
}

export interface Citation {
  description?: string;
  citedArtifact?: CitedArtifact;
}

export interface CitationItem {
  citation?: Citation;
  citationId?: string;
  age?: CitationRange | null;
  range?: CitationRange | null;
  gender?: string;
  message?: string;
}
