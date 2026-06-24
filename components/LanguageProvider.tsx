"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Lang, translate } from "@/lib/i18n";
import { STORAGE_KEYS } from "@/lib/plan";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("de");

  // Restore the saved language after mount (avoids SSR/CSR mismatch).
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEYS.lang) as Lang | null;
    if (saved === "de" || saved === "en") {
      setLangState(saved);
    } else if (navigator.language?.toLowerCase().startsWith("en")) {
      setLangState("en");
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEYS.lang, next);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => translate(lang, key, params),
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
  );
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
