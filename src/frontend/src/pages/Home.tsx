import { EmergencyAlert } from "@/components/EmergencyAlert";
import { InputTabs } from "@/components/InputTabs";
import { ResultsSection } from "@/components/ResultsSection";
import { SAMPLE_LABEL, SampleDemoButton } from "@/components/SampleDemoButton";
import { VoicePlayer } from "@/components/VoicePlayer";
import type { Language } from "@/constants/languages";
import { useTranslateLabel } from "@/hooks/useTranslateLabel";
import { useVoiceSpeech } from "@/hooks/useVoiceSpeech";
import type { MedicineLabelResult } from "@/types/label";
import { SECTION_CONFIGS } from "@/types/label";
import { AlertCircle, Globe, Loader2, Sparkles } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface HomeProps {
  selectedLanguage: Language;
}

function buildVoiceChunks(result: MedicineLabelResult): string[] {
  return SECTION_CONFIGS.map((cfg) => {
    const content = result[cfg.key] as string;
    return content ? `${cfg.label}: ${content}` : "";
  }).filter(Boolean);
}

export default function Home({ selectedLanguage }: HomeProps) {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<MedicineLabelResult | null>(null);
  const [emergencyDismissed, setEmergencyDismissed] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const { mutate, isPending, isError, error, reset } = useTranslateLabel();
  const voice = useVoiceSpeech();

  const scrollToResults = useCallback(() => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }, []);

  const handleProcess = useCallback(() => {
    if (!inputText.trim()) return;
    setResult(null);
    setEmergencyDismissed(false);
    voice.stop();
    mutate(
      { text: inputText, language: selectedLanguage.code },
      {
        onSuccess: (data) => {
          if (data.data) {
            setResult(data.data);
            scrollToResults();
          }
        },
      },
    );
  }, [inputText, selectedLanguage.code, mutate, voice, scrollToResults]);

  const handleSampleLoad = useCallback(
    (_text?: string) => {
      setInputText(SAMPLE_LABEL);
      setResult(null);
      setEmergencyDismissed(false);
      voice.stop();
      mutate(
        { text: SAMPLE_LABEL, language: selectedLanguage.code },
        {
          onSuccess: (data) => {
            if (data.data) {
              setResult(data.data);
              scrollToResults();
            }
          },
        },
      );
    },
    [selectedLanguage.code, mutate, voice, scrollToResults],
  );

  const handleImageCapture = useCallback((text: string) => {
    setInputText(text);
  }, []);

  const handleVoicePlay = useCallback(() => {
    if (!result) return;
    voice.play(buildVoiceChunks(result), selectedLanguage.code);
  }, [result, selectedLanguage.code, voice]);

  const canProcess = inputText.trim().length > 0 && !isPending;

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 border border-primary/20">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 rounded-xl p-3 shrink-0">
            <span className="text-3xl" aria-hidden="true">
              💊
            </span>
          </div>
          <div className="min-w-0">
            <h2 className="font-display font-bold text-foreground text-xl leading-tight">
              Scan Your Medicine
            </h2>
            <p className="text-muted-foreground text-base mt-0.5">
              Translate &amp; simplify any medicine label instantly
            </p>
          </div>
        </div>
      </div>

      {/* Input section */}
      <section
        aria-label="Input method"
        className="bg-card rounded-2xl border border-border p-4 shadow-sm space-y-4"
      >
        <InputTabs
          inputText={inputText}
          onInputChange={setInputText}
          onImageCapture={handleImageCapture}
        />

        {/* Sample demo */}
        <SampleDemoButton onLoad={handleSampleLoad} disabled={isPending} />

        {/* Language indicator + process button */}
        <div className="space-y-2 pt-1">
          <div
            className="flex items-center gap-2 text-sm text-muted-foreground"
            aria-label="Selected output language"
          >
            <Globe
              size={16}
              className="text-primary shrink-0"
              aria-hidden="true"
            />
            <span>
              Translating to:{" "}
              <span className="font-semibold text-foreground">
                {selectedLanguage.nativeName} ({selectedLanguage.name})
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleProcess}
            disabled={!canProcess}
            data-ocid="process.submit_button"
            aria-label={`Translate and simplify medicine label into ${selectedLanguage.name}`}
            aria-busy={isPending}
            className="touch-target focus-ring w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3.5 px-6 font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isPending ? (
              <>
                <Loader2
                  size={20}
                  className="animate-spin"
                  aria-hidden="true"
                />
                Translating…
              </>
            ) : (
              <>
                <Sparkles size={20} aria-hidden="true" />
                Translate &amp; Simplify
              </>
            )}
          </button>
        </div>
      </section>

      {/* Loading state */}
      {isPending && (
        <output
          aria-live="polite"
          data-ocid="process.loading_state"
          className="flex flex-col items-center justify-center gap-4 py-10 text-center"
        >
          <Loader2
            size={40}
            className="animate-spin text-primary"
            aria-hidden="true"
          />
          <div>
            <p className="font-semibold text-foreground text-lg">
              Translating your medicine label…
            </p>
            <p className="text-muted-foreground text-base mt-1">
              Simplifying medical terms for you
            </p>
          </div>
        </output>
      )}
      {isError && !isPending && (
        <div
          role="alert"
          data-ocid="process.error_state"
          className="bg-card rounded-2xl border border-destructive/30 p-5 space-y-3"
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              size={24}
              className="text-destructive shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-base">
                Something went wrong
              </p>
              <p className="text-muted-foreground text-base mt-1">
                {error?.message ??
                  "Could not process the label. Please try again."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              reset();
              handleProcess();
            }}
            data-ocid="process.retry_button"
            className="touch-target focus-ring w-full flex items-center justify-center gap-2 border border-border rounded-xl py-2.5 px-4 text-base font-semibold hover:bg-muted transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Results */}
      {result && !isPending && (
        <div
          ref={resultsRef}
          className="space-y-4"
          data-ocid="result.success_state"
        >
          {/* Emergency alert */}
          {result.hasEmergencyAlert && !emergencyDismissed && (
            <EmergencyAlert
              text={result.emergencyAlertText}
              onDismiss={() => setEmergencyDismissed(true)}
            />
          )}

          {/* Voice player */}
          <VoicePlayer
            state={voice.state}
            isSupported={voice.isSupported}
            onPlay={handleVoicePlay}
            onPause={voice.pause}
            onStop={voice.stop}
            langName={selectedLanguage.name}
          />

          {/* Section cards */}
          <ResultsSection result={result} activeIndex={voice.activeIndex} />
        </div>
      )}

      {/* Empty state */}
      {!result && !isPending && !isError && (
        <div
          data-ocid="label.empty_state"
          className="flex flex-col items-center justify-center py-12 gap-4 text-center"
        >
          <span className="text-6xl" aria-hidden="true">
            🔍
          </span>
          <div>
            <p className="text-lg font-semibold text-foreground">
              Ready to translate your medicine label
            </p>
            <p className="text-muted-foreground text-base mt-1">
              Type or paste label text above, or try the sample below
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
