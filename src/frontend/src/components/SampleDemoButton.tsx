import { Sparkles } from "lucide-react";
import { memo } from "react";

const SAMPLE_LABEL = `PARACETAMOL TABLETS IP 500mg

Each tablet contains: Paracetamol 500mg

INDICATIONS: For the relief of mild to moderate pain including headache, migraine, 
dental pain, period pain, and for fever reduction.

DOSAGE: Adults and children over 12 years: 1-2 tablets every 4-6 hours as required.
Maximum 8 tablets in 24 hours. Do not give to children under 12 years.

WARNINGS: Do not exceed the stated dose. Overdose can cause serious liver damage.
Do not take with other paracetamol-containing products. Keep out of reach of children.
If you have liver or kidney problems, consult your doctor before use.
Do not take if allergic to paracetamol.

SIDE EFFECTS: Rare allergic reactions including skin rash. 
Discontinue use and consult a doctor if you experience any adverse effects.

STORAGE: Store below 25°C in a dry place. Keep away from moisture and sunlight.
Keep all medicines out of reach of children.

Manufactured by: PharmaCo Ltd | Batch No: PC-2026-01 | Exp: 12/2027`;

interface SampleDemoButtonProps {
  onLoad: (text: string) => void;
  disabled?: boolean;
}

export const SampleDemoButton = memo(function SampleDemoButton({
  onLoad,
  disabled,
}: SampleDemoButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onLoad(SAMPLE_LABEL)}
      disabled={disabled}
      data-ocid="sample.demo_button"
      aria-label="Try with sample paracetamol medicine label"
      className="touch-target focus-ring w-full flex items-center justify-center gap-2 border-2 border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 text-primary font-semibold rounded-xl py-3 px-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
    >
      <Sparkles size={20} aria-hidden="true" />
      Try with Sample Label (Paracetamol 500mg)
    </button>
  );
});

export { SAMPLE_LABEL };
