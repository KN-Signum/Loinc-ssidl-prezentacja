import React from "react";
import { FlaskConical, TestTube2, Truck } from "lucide-react";
import { Badge } from "../../ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../ui/accordion";
import { TestedMaterial } from "../../../features/specimenDefinition/SpecimenDefinition";
import { DetailSection, SectionTitle } from "../primitives";

export const TestedMaterialsSection: React.FC<{
  materials: TestedMaterial[];
}> = ({ materials }) => {
  if (materials.length === 0) return null;

  return (
    <DetailSection variant="muted">
      <SectionTitle icon={FlaskConical} className="mb-4">
        Materiał badany
      </SectionTitle>

      <div className="space-y-3">
        {materials.map((mat, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-slate-200 bg-white shadow-sm"
          >
            <div className="flex items-center gap-3 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-200 text-blue-600">
                <TestTube2 className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-900 font-semibold">
                {mat.display}
              </p>
            </div>

            {mat.handlingSections.length > 0 && (
              <Accordion
                type="single"
                collapsible
                className="border-t border-slate-100 px-3"
              >
                <AccordionItem value={`factors-${idx}`} className="border-b-0">
                  <AccordionTrigger className="py-2.5 hover:no-underline">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <Truck className="h-4 w-4" />
                      Czynniki przedanalityczne
                      <Badge variant="outline" className="text-xs">
                        {mat.handlingSections.length}
                      </Badge>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pb-1">
                      {mat.handlingSections.map((sec, i) => (
                        <div key={i}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-slate-900">
                              {sec.title}
                            </span>
                          </div>
                          <ul className="pl-4 list-disc space-y-1">
                            {sec.instructions.map((instr, j) => (
                              <li key={j} className="text-sm text-slate-700">
                                {instr}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        ))}
      </div>
    </DetailSection>
  );
};
