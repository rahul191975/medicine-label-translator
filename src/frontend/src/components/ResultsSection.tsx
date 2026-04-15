import { SectionCard } from "@/components/SectionCard";
import type { MedicineLabelResult } from "@/types/label";
import { SECTION_CONFIGS } from "@/types/label";
import { memo } from "react";

interface ResultsSectionProps {
  result: MedicineLabelResult;
  activeIndex: number;
}

export const ResultsSection = memo(function ResultsSection({
  result,
  activeIndex,
}: ResultsSectionProps) {
  return (
    <section
      aria-label="Medicine label results"
      data-ocid="results.section"
      className="space-y-3"
    >
      <h2 className="font-display font-bold text-foreground text-xl flex items-center gap-2">
        <span aria-hidden="true">✅</span> Simplified Results
      </h2>
      <div className="space-y-3">
        {SECTION_CONFIGS.map((config, index) => (
          <SectionCard
            key={config.key}
            config={config}
            content={result[config.key] as string}
            index={index}
            isActive={activeIndex === index}
          />
        ))}
      </div>
    </section>
  );
});
