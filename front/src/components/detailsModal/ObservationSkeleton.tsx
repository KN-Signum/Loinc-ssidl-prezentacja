import React from "react";
import {
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { SkeletonBlock } from "./SkeletonBlock";
import { BackButton } from "./primitives";

export interface ObservationSkeletonProps {
  onBack: () => void;
  parentTitle: string;
}

export const ObservationSkeleton: React.FC<ObservationSkeletonProps> = ({
  onBack,
  parentTitle,
}) => (
  <>
    <DialogHeader className="mb-1 space-y-2">
      <BackButton onClick={onBack} label={parentTitle} />
      <DialogTitle className="sr-only">
        Ładowanie szczegółów parametru
      </DialogTitle>
      <SkeletonBlock className="h-7 w-2/3" />
      <div className="flex flex-wrap gap-2">
        <SkeletonBlock className="h-6 w-28" />
        <SkeletonBlock className="h-4 w-40" />
      </div>
    </DialogHeader>
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <SkeletonBlock className="h-4 w-48" />
        <SkeletonBlock className="h-12 w-full" />
        <SkeletonBlock className="h-12 w-full" />
      </section>
    </div>
  </>
);
