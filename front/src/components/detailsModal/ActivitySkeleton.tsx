import React from "react";
import {
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { SkeletonBlock } from "./SkeletonBlock";

export const ActivitySkeleton: React.FC = () => (
  <>
    <DialogHeader className="mb-1 space-y-2">
      <DialogTitle className="sr-only">Ładowanie szczegółów usługi</DialogTitle>
      <SkeletonBlock className="h-7 w-2/3" />
      <div className="flex flex-wrap gap-2 mb-2">
        <SkeletonBlock className="h-6 w-24" />
        <SkeletonBlock className="h-6 w-40" />
      </div>
    </DialogHeader>
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <SkeletonBlock className="h-4 w-48" />
        <SkeletonBlock className="h-4 w-5/6" />
      </section>
      <section className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-4">
        <SkeletonBlock className="h-4 w-44" />
        <div className="flex items-center gap-3">
          <SkeletonBlock className="h-10 w-10" />
          <div className="flex-1 space-y-2">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-4 w-2/3" />
          </div>
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <SkeletonBlock className="h-4 w-40" />
        <SkeletonBlock className="h-12 w-full" />
      </section>
    </div>
  </>
);
