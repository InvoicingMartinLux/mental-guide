import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { PlanProvider } from "@/components/PlanProvider";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Mental Guide – Healthier life, week by week",
  description:
    "Answer a few questions and get a personal weekly plan for healthier phone usage. Print it out or check it off online.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="min-h-screen font-sans">
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
