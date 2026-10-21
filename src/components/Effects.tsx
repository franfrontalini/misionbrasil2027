"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

// Comportamientos globales de la landing:
//  - aparición suave de los bloques marcados con [data-reveal] al entrar en pantalla;
//  - registro de clics en CTA ([data-cta]) si la persona aceptó la analítica;
//  - CTA fijo en móvil, que se oculta cuando el formulario ya está a la vista.
export function Effects() {
  useEffect(() => {
    const elementos = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const reveal = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            reveal.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    elementos.forEach((el) => reveal.observe(el));

    const onClick = (ev: MouseEvent) => {
      const cta = (ev.target as HTMLElement).closest<HTMLElement>("[data-cta]");
      if (cta) track("Clic CTA", { ubicacion: cta.dataset.cta ?? "" });
    };
    document.addEventListener("click", onClick);

    const sticky = document.querySelector<HTMLElement>(".cta-fijo");
    const hero = document.querySelector("#inicio");
    const form = document.querySelector("#inscripcion");
    const visibles = new Set<Element>();
    const obsSticky = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) visibles.add(e.target);
          else visibles.delete(e.target);
        }
        sticky?.classList.toggle("cta-fijo--visible", visibles.size === 0);
      },
      { threshold: 0.05 },
    );
    if (hero) obsSticky.observe(hero);
    if (form) obsSticky.observe(form);

    return () => {
      reveal.disconnect();
      obsSticky.disconnect();
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
