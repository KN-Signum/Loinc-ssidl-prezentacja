import React from "react";
import { Truck } from "lucide-react";
import { Badge } from "../../ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../ui/accordion";
import { HandlingSection } from "../../../features/specimenDefinition/SpecimenDefinition";
import { DetailSection, SectionTitle } from "../primitives";

export const PreAnalyticalFactorsSection: React.FC<{
  sections: HandlingSection[];
}> = ({ sections }) => {
  if (sections.length === 0) return null;

  return (
    <DetailSection>
      <SectionTitle icon={Truck} className="mb-4">
        Czynniki przedanalityczne
      </SectionTitle>

      <Accordion type="single" collapsible className="w-full">
        {sections.map((sec, idx) => (
          <AccordionItem
            key={idx}
            value={`hs-${idx}`}
            className="border-b border-slate-200"
          >
            <AccordionTrigger className="py-3 hover:no-underline">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">
                  {sec.title}
                </span>
                {sec.code && (
                  <Badge variant="outline" className="text-xs font-mono">
                    {sec.code}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="pl-4 list-disc space-y-1">
                {sec.instructions.map((instr, i) => (
                  <li key={i} className="text-sm text-slate-700">
                    {instr}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </DetailSection>
  );
};
