// Analítica básica con Plausible (sin cookies), cargada solo si la persona acepta.
// Se activa definiendo NEXT_PUBLIC_PLAUSIBLE_DOMAIN. Sin esa variable no se envía nada.

export const CLAVE_CONSENTIMIENTO = "mb27_analitica";
export const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "";

declare global {
  interface Window {
    plausible?: (evento: string, opciones?: { props?: Record<string, string> }) => void;
  }
}

export function consentimientoAnalitica(): "si" | "no" | null {
  try {
    const v = localStorage.getItem(CLAVE_CONSENTIMIENTO);
    return v === "si" || v === "no" ? v : null;
  } catch {
    return null;
  }
}

export function track(evento: string, props?: Record<string, string>) {
  if (!PLAUSIBLE_DOMAIN || consentimientoAnalitica() !== "si") return;
  window.plausible?.(evento, props ? { props } : undefined);
}
