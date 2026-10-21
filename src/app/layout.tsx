import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/lib/config";

// Tipografías del Manual de Identidad Visual UTN FRC, servidas desde el propio proyecto
// (sin descargas a Google Fonts durante el build). Solo el subconjunto latino: alcanza para
// español y portugués.
import "@fontsource/barlow/latin-400.css";
import "@fontsource/barlow/latin-500.css";
import "@fontsource/barlow/latin-600.css";
import "@fontsource/barlow/latin-700.css";
import "@fontsource/noto-sans/latin-500.css";
import "@fontsource/noto-sans/latin-700.css";
import "@fontsource/noto-sans/latin-800.css";
import "@fontsource/noto-sans/latin-900.css";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-600.css";
import "@fontsource/crimson-pro/latin-400-italic.css";
import "./globals.css";

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
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  );
}
