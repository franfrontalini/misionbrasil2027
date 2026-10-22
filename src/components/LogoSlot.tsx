import Image from "next/image";
import { siteConfig } from "@/lib/config";

const { logos } = siteConfig;

// Isologotipo UTN FRC, versión reducida, para el header. Se muestran las dos variantes de color
// y el CSS elige: blanco sobre la foto del hero, azul cuando el header se vuelve blanco.
export function LogoHeader() {
  return (
    <span className="logo-header">
      <Image src={logos.utnFrcReducidoBlanco} alt="UTN Facultad Regional Córdoba" width={1633} height={999} className="logo-header__blanco" priority />
      <Image src={logos.utnFrcReducidoAzul} alt="" aria-hidden width={1633} height={999} className="logo-header__azul" priority />
    </span>
  );
}

// Logos del footer: isologotipo extendido en blanco y espacio para el del programa.
export function LogoSlot({ tipo }: { tipo: "utnFrc" | "misiones" }) {
  if (tipo === "utnFrc") {
    return <Image src={logos.utnFrcBlanco} alt="UTN Facultad Regional Córdoba" width={2000} height={676} className="logo-footer" />;
  }
  if (logos.misiones) {
    return <Image src={logos.misiones} alt="Programa de Misiones Académicas" width={360} height={120} className="logo-footer" />;
  }
  return (
    <span className="logo-slot" aria-hidden="true">
      Logo Misiones Académicas
    </span>
  );
}
