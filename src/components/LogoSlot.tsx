import Image from "next/image";
import { siteConfig } from "@/lib/config";

const textos = {
  utnFrc: "Logo UTN FRC",
  misiones: "Logo Misiones Académicas",
};

// Espacio reservado para los logos oficiales. No se dibuja ningún logo propio:
// cuando se carga el archivo en siteConfig.logos, se muestra la imagen oficial.
export function LogoSlot({ tipo, variante = "footer" }: { tipo: keyof typeof textos; variante?: "header" | "footer" }) {
  const src = siteConfig.logos[tipo];
  if (src) {
    return (
      <Image
        src={src}
        alt={tipo === "utnFrc" ? "UTN Facultad Regional Córdoba" : "Programa de Misiones Académicas"}
        width={variante === "header" ? 120 : 180}
        height={variante === "header" ? 36 : 54}
        className={`logo logo--${variante}`}
      />
    );
  }
  if (variante === "header") return null;
  return (
    <span className="logo-slot" aria-hidden="true">
      {textos[tipo]}
    </span>
  );
}
