import type { SectionConfig } from "@/types/label";
import { memo } from "react";

interface SectionCardProps {
  config: SectionConfig;
  content: string;
  index: number;
  isActive: boolean;
}

export const SectionCard = memo(function SectionCard({
  config,
  content,
  index,
  isActive,
}: SectionCardProps) {
  if (!content) return null;

  return (
    <div
      data-ocid={`result.item.${index + 1}`}
      className={`${config.className} rounded-lg p-4 transition-all duration-300 ${
        isActive
          ? "ring-2 ring-primary ring-offset-1 shadow-md scale-[1.01]"
          : ""
      }`}
      aria-current={isActive ? "true" : undefined}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl shrink-0" aria-hidden="true">
          {config.icon}
        </span>
        <h3 className="font-display font-semibold text-foreground text-base leading-tight">
          {config.label}
        </h3>
      </div>
      <p className="text-foreground leading-relaxed text-base whitespace-pre-wrap">
        {content}
      </p>
    </div>
  );
});
