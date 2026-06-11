import { Extension } from "../../features/activityDefinition/types";
import { CitationItem } from "../../features/citations/types";
import { CHILD_AGE_THRESHOLD_YEARS } from "./types";

export interface NfzCodeInfo {
  code: string;
  display: string;
}

export const extractNfzCodes = (
  extensions: Extension[] | undefined,
): NfzCodeInfo[] =>
  Array.from(
    new Map(
      (extensions ?? [])
        .filter((e) => e.url?.endsWith("activityDefinition-nfzCode"))
        .flatMap((nfzExt) => {
          const subExts = nfzExt.extension ?? [];
          const coding = subExts.find((e) => e.url === "type")?.valueCoding;
          return coding?.code
            ? [
                {
                  code: coding.code,
                  display: coding.display ?? coding.code,
                },
              ]
            : [];
        })
        .map((item) => [item.code, item] as [string, NfzCodeInfo]),
    ).values(),
  );

export const formatRangeValue = (
  value: number | undefined,
): number | undefined =>
  value !== undefined ? Math.round(value * 100) / 100 : undefined;

export const ageToYears = (item: CitationItem): number => {
  const unit = item.age?.low?.unit || item.age?.high?.unit || "";
  const val = item.age?.low?.value ?? item.age?.high?.value ?? Infinity;
  if (unit === "a") return val;
  if (unit === "mo") return val / 12;
  if (unit === "wk") return val / 52;
  if (unit === "d") return val / 365;
  return val;
};

export const isChildItem = (item: CitationItem): boolean => {
  if (!item.age) return false;
  const lowUnit = item.age.low?.unit || "";
  const highUnit = item.age.high?.unit || "";
  if (lowUnit === "d" || lowUnit === "wk") return true;
  if (highUnit === "d" || highUnit === "wk") return true;
  if (lowUnit === "mo" || highUnit === "mo") return true;
  if (
    highUnit === "a" &&
    (item.age.high?.value ?? Infinity) <= CHILD_AGE_THRESHOLD_YEARS
  )
    return true;
  return false;
};

export const formatBoundedSummary = (
  low: number | undefined,
  high: number | undefined,
  unit: string,
): string => {
  if (low !== undefined && high !== undefined) return `${low}–${high} ${unit}`;
  if (low !== undefined) return `≥ ${low} ${unit}`;
  if (high !== undefined) return `≤ ${high} ${unit}`;
  return "";
};
