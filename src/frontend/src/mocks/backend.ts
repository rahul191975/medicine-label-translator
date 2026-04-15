import type { backendInterface } from "../backend";

export const mockBackend: backendInterface = {
  processLabel: async (_text: string, _language: string) => ({
    __kind__: "ok" as const,
    ok: {
      medicationName: "Ibuprofen 400mg",
      hasEmergencyAlert: true,
      emergencyAlertText:
        "WARNING: Do not exceed 1200mg per day. If you experience chest pain, difficulty breathing, or swelling of face/throat, seek emergency medical care immediately.",
      warnings:
        "Do not take if allergic to ibuprofen or aspirin. Avoid if you have stomach ulcers or kidney disease. Do not use with blood thinners. Keep out of reach of children.",
      howToTake:
        "Take with food or milk to reduce stomach upset. Swallow tablet whole with a full glass of water. Do not crush or chew.",
      storageInstructions:
        "Store at room temperature between 15-30°C (59-86°F). Keep away from moisture and heat. Do not store in the bathroom.",
      sideEffects:
        "Stomach pain or upset, nausea, heartburn, dizziness, headache. Rare: skin rash, ringing in ears, blurred vision.",
      purpose: "Pain reliever and fever reducer (NSAID). Used for headaches, muscle pain, toothaches, menstrual cramps, arthritis, and fever.",
      dosageInstructions:
        "Adults and children 12 years and older: Take 1 tablet (400mg) every 4 to 6 hours while symptoms persist. Do not take more than 3 tablets in 24 hours.",
    },
  }),
  transform: async (input) => ({
    status: BigInt(200),
    body: input.response.body,
    headers: input.response.headers,
  }),
};
