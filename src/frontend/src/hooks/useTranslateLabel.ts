import { createActor } from "@/backend";
import type { MedicineLabelResult, ProcessLabelResult } from "@/types/label";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation } from "@tanstack/react-query";

export interface TranslateLabelParams {
  text: string;
  language: string;
}

export interface TranslateLabelResult {
  data: MedicineLabelResult | null;
  error: string | null;
}

export function useTranslateLabel() {
  const { actor } = useActor(createActor);

  return useMutation<TranslateLabelResult, Error, TranslateLabelParams>({
    mutationFn: async ({ text, language }: TranslateLabelParams) => {
      if (!actor) throw new Error("Backend not available");

      const result: ProcessLabelResult = await actor.processLabel(
        text,
        language,
      );

      if (result.__kind__ === "ok") {
        return { data: result.ok, error: null };
      }
      return { data: null, error: result.err };
    },
  });
}
