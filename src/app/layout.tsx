import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const heading = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "VIVIVI - Your AI Companion",
  description: "Meet your dream companion. Chat, call, and connect with stunning 3D AI characters. Free to start.",
  keywords: ["AI girlfriend", "virtual companion", "AI chat", "3D character", "digital girlfriend"],
  openGraph: {
    title: "VIVIVI - Your AI Companion",
    description: "Meet your dream companion. Stunning 3D characters powered by AI.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${heading.variable} ${body.variable} font-[family-name:var(--font-body)] bg-[var(--bg)] text-[var(--text)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
