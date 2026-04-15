import { X } from "lucide-react";
import { memo } from "react";

interface EmergencyAlertProps {
  text: string;
  onDismiss: () => void;
}

export const EmergencyAlert = memo(function EmergencyAlert({
  text,
  onDismiss,
}: EmergencyAlertProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      data-ocid="emergency.alert"
      className="alert-emergency rounded-lg p-4 flex items-start gap-3 mb-4"
    >
      <span className="text-2xl shrink-0" aria-hidden="true">
        🚨
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-red-900 dark:text-red-100 text-base leading-snug">
          EMERGENCY WARNING
        </p>
        <p className="text-red-800 dark:text-red-200 mt-1 text-base">{text}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        data-ocid="emergency.close_button"
        aria-label="Dismiss emergency alert"
        className="touch-target focus-ring shrink-0 flex items-center justify-center rounded-full p-1 text-red-700 hover:bg-red-200 dark:text-red-300 dark:hover:bg-red-900/60 transition-colors"
      >
        <X size={20} aria-hidden="true" />
      </button>
    </div>
  );
});
