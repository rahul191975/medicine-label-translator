import type { VoiceState } from "@/hooks/useVoiceSpeech";
import { Pause, Play, Square, Volume2 } from "lucide-react";
import { memo } from "react";

interface VoicePlayerProps {
  state: VoiceState;
  isSupported: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  langName: string;
}

export const VoicePlayer = memo(function VoicePlayer({
  state,
  isSupported,
  onPlay,
  onPause,
  onStop,
  langName,
}: VoicePlayerProps) {
  if (!isSupported) return null;

  return (
    <div
      data-ocid="voice.panel"
      className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 shadow-sm"
      aria-label="Voice playback controls"
    >
      <Volume2 size={20} className="text-primary shrink-0" aria-hidden="true" />
      <span className="text-sm font-medium text-muted-foreground flex-1 min-w-0 truncate">
        Read aloud in {langName}
      </span>

      {state === "idle" && (
        <button
          type="button"
          onClick={onPlay}
          data-ocid="voice.play_button"
          aria-label="Play voice reading"
          className="touch-target focus-ring flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg px-4 py-2 font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <Play size={16} aria-hidden="true" />
          Play
        </button>
      )}

      {(state === "playing" || state === "paused") && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPause}
            data-ocid="voice.pause_button"
            aria-label={state === "playing" ? "Pause" : "Resume"}
            className="touch-target focus-ring flex items-center justify-center bg-secondary text-secondary-foreground rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            <Pause size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onStop}
            data-ocid="voice.stop_button"
            aria-label="Stop reading"
            className="touch-target focus-ring flex items-center justify-center bg-secondary text-secondary-foreground rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            <Square size={16} aria-hidden="true" />
          </button>
          <span className="text-xs text-primary font-medium">
            {state === "playing" ? "Playing…" : "Paused"}
          </span>
        </div>
      )}
    </div>
  );
});
