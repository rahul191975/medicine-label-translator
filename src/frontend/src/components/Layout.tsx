import { LANGUAGES, type Language } from "@/constants/languages";

interface LayoutProps {
  children: React.ReactNode;
  selectedLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export function Layout({
  children,
  selectedLanguage,
  onLanguageChange,
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-xs sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl" aria-hidden="true">
              💊
            </span>
            <div className="min-w-0">
              <h1 className="text-lg font-display font-bold text-foreground leading-tight truncate">
                <span className="text-primary">Med</span>Translate
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Medicine Label Translator
              </p>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <label
              htmlFor="language-select"
              className="text-sm font-medium text-muted-foreground sr-only sm:not-sr-only"
            >
              Language
            </label>
            <select
              id="language-select"
              data-ocid="language.select"
              value={selectedLanguage.code}
              onChange={(e) => {
                const lang = LANGUAGES.find((l) => l.code === e.target.value);
                if (lang) onLanguageChange(lang);
              }}
              className="touch-target text-sm font-body bg-background border border-input rounded-md px-3 py-2 text-foreground focus-ring cursor-pointer min-w-[130px]"
              aria-label="Select output language"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} – {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-background">
        <div className="max-w-2xl mx-auto px-4 py-6">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/40 border-t border-border py-4 mt-auto">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
