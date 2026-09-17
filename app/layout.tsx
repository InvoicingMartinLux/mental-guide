import type { Metadata, Viewport } from "next";
import { Nunito, Poppins, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { PlanProvider } from "@/components/PlanProvider";
import { Header } from "@/components/Header";

// WellPath type system: Nunito for headlines, Poppins for body, Source Code Pro for code.
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-source-code-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mental Guide – Healthier life, week by week",
  description:
    "Answer a few questions and get a personal weekly plan for healthier phone usage. Print it out or check it off online.",
};

export const viewport: Viewport = {
  themeColor: "#FAF8FF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      className={`${nunito.variable} ${poppins.variable} ${sourceCodePro.variable}`}
    >
      <body className="min-h-screen bg-canvas font-sans text-ink">
        <LanguageProvider>
          <AuthProvider>
            <PlanProvider>
              <Header />
              <main>{children}</main>
            </PlanProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
