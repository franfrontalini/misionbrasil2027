import type { Metadata, Viewport } from "next";
import { Barlow, Noto_Sans, JetBrains_Mono, Crimson_Pro } from "next/font/google";
import { siteConfig } from "@/lib/config";
import "./globals.css";

// Tipografías del Manual de Identidad Visual UTN FRC.
const barlow = Barlow({ variable: "--font-barlow", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const noto = Noto_Sans({ variable: "--font-noto", subsets: ["latin"], weight: ["500", "700", "800", "900"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "600"] });
const crimson = Crimson_Pro({ variable: "--font-crimson", subsets: ["latin"], weight: ["400"], style: ["italic"] });

const descripcion =
  "10 días en São Paulo y Río de Janeiro para conocer industrias, universidades y tecnología. Convocatoria de interesados abierta para estudiantes de Ingeniería Industrial y Mecánica de UTN Córdoba.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Brasil 2027 · Misión Académica UTN FRC",
  description: descripcion,
  keywords: ["Misión Académica", "Brasil 2027", "UTN FRC", "Ingeniería Industrial", "Ingeniería Mecánica", "São Paulo", "Río de Janeiro"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Misión Académica Brasil 2027",
    title: "Brasil 2027 · La ingeniería no tiene fronteras",
    description: descripcion,
    url: "/",
    images: [{ url: "/og-brasil-2027.jpg", width: 1200, height: 630, alt: "Brasil 2027 · La ingeniería no tiene fronteras" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brasil 2027 · La ingeniería no tiene fronteras",
    description: descripcion,
    images: ["/og-brasil-2027.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B2986",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR" className={`${barlow.variable} ${noto.variable} ${mono.variable} ${crimson.variable}`}>
      <body>{children}</body>
    </html>
  );
}
