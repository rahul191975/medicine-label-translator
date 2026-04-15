import { Layout } from "@/components/Layout";
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  type Language,
} from "@/constants/languages";
import { Suspense, lazy, useState } from "react";

const HomePage = lazy(() => import("@/pages/Home"));

function AppSkeleton() {
  return (
    <div
      className="space-y-4 animate-pulse"
      aria-label="Loading…"
      aria-live="polite"
    >
      <div className="h-40 bg-muted rounded-lg" />
      <div className="grid grid-cols-3 gap-3">
        <div className="h-20 bg-muted rounded-lg" />
        <div className="h-20 bg-muted rounded-lg" />
        <div className="h-20 bg-muted rounded-lg" />
      </div>
      <div className="h-6 bg-muted rounded w-1/3" />
      <div className="h-24 bg-muted rounded-lg" />
    </div>
  );
}

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("selectedLanguage");
    return LANGUAGES.find((l) => l.code === saved) ?? DEFAULT_LANGUAGE;
  });

  function handleLanguageChange(lang: Language) {
    localStorage.setItem("selectedLanguage", lang.code);
    setSelectedLanguage(lang);
  }

  return (
    <Layout
      selectedLanguage={selectedLanguage}
      onLanguageChange={handleLanguageChange}
    >
      <Suspense fallback={<AppSkeleton />}>
        <HomePage selectedLanguage={selectedLanguage} />
      </Suspense>
    </Layout>
  );
}
