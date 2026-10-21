"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { CLAVE_CONSENTIMIENTO, PLAUSIBLE_DOMAIN, consentimientoAnalitica } from "@/lib/analytics";

// Pide permiso antes de medir visitas. Si no hay analítica configurada, no muestra nada.
export function ConsentBanner() {
  const [estado, setEstado] = useState<"si" | "no" | null | "cargando">("cargando");

  useEffect(() => {
    setEstado(consentimientoAnalitica());
  }, []);

  if (!PLAUSIBLE_DOMAIN || estado === "cargando") return null;

  const elegir = (v: "si" | "no") => {
    try {
      localStorage.setItem(CLAVE_CONSENTIMIENTO, v);
    } catch {}
    setEstado(v);
  };

  return (
    <>
      {estado === "si" && (
        <Script defer data-domain={PLAUSIBLE_DOMAIN} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
      )}
      {estado === null && (
        <div className="consent" role="region" aria-label="Preferencias de medición">
          <p>
            ¿Nos dejás medir visitas y clics de forma anónima, sin cookies, para mejorar esta página?{" "}
            <a href="/privacidad#analitica">Más info</a>
          </p>
          <div className="consent__acciones">
            <button type="button" className="btn btn--fantasma btn--chico" onClick={() => elegir("no")}>
              No, gracias
            </button>
            <button type="button" className="btn btn--primario btn--chico" onClick={() => elegir("si")}>
              Acepto
            </button>
          </div>
        </div>
      )}
    </>
  );
}
