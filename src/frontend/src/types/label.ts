export interface MedicineLabelResult {
  medicationName: string;
  purpose: string;
  dosageInstructions: string;
  howToTake: string;
  warnings: string;
  sideEffects: string;
  storageInstructions: string;
  hasEmergencyAlert: boolean;
  emergencyAlertText: string;
}

export type ProcessLabelResult =
  | { __kind__: "ok"; ok: MedicineLabelResult }
  | { __kind__: "err"; err: string };

export interface SectionConfig {
  key: keyof Pick<
    MedicineLabelResult,
    | "medicationName"
    | "purpose"
    | "dosageInstructions"
    | "howToTake"
    | "warnings"
    | "sideEffects"
    | "storageInstructions"
  >;
  label: string;
  className: string;
  icon: string;
}

export const SECTION_CONFIGS: SectionConfig[] = [
  {
    key: "medicationName",
    label: "Medication Name",
    className: "section-medication",
    icon: "💊",
  },
  {
    key: "purpose",
    label: "Purpose",
    className: "section-purpose",
    icon: "🎯",
  },
  {
    key: "dosageInstructions",
    label: "Dosage",
    className: "section-dosage",
    icon: "📋",
  },
  {
    key: "howToTake",
    label: "How to Take",
    className: "section-dosage",
    icon: "🕐",
  },
  {
    key: "warnings",
    label: "Warnings",
    className: "section-warnings",
    icon: "⚠️",
  },
  {
    key: "sideEffects",
    label: "Side Effects",
    className: "section-sideeffects",
    icon: "🔬",
  },
  {
    key: "storageInstructions",
    label: "Storage",
    className: "section-storage",
    icon: "📦",
  },
];
