"use client";

import { useEffect, useState } from "react";
import { IconCerrar, IconMenu } from "./Icons";
import { LogoSlot } from "./LogoSlot";

const enlaces = [
  { href: "#mision", label: "La misión" },
  { href: "#destinos", label: "Destinos" },
  { href: "#becas", label: "Becas y cuotas" },
  { href: "#preguntas", label: "Preguntas frecuentes" },
  { href: "#inscripcion", label: "Inscripción" },
];

export function Header() {
  const [solido, setSolido] = useState(false);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolido(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [abierto]);

  return (
    <header className={`header ${solido || abierto ? "header--solido" : ""}`}>
      <div className="header__inner contenedor">
        <a href="#inicio" className="header__marca" aria-label="Brasil 2027, ir al inicio">
          <LogoSlot tipo="utnFrc" variante="header" />
          <span className="header__nombre">
            <span className="mono">Misión Académica</span>
            <strong>Brasil 2027</strong>
          </span>
        </a>

        <nav className="header__nav" aria-label="Secciones">
          <ul>
            {enlaces.slice(0, 4).map((e) => (
              <li key={e.href}>
                <a href={e.href}>{e.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <a href="#inscripcion" className="btn btn--primario btn--chico header__cta" data-cta="header">
          Inscripción
        </a>

        <button
          type="button"
          className="header__toggle"
          aria-expanded={abierto}
          aria-controls="menu-movil"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setAbierto((v) => !v)}
        >
          {abierto ? <IconCerrar /> : <IconMenu />}
        </button>
      </div>

      <nav id="menu-movil" className={`menu-movil ${abierto ? "menu-movil--abierto" : ""}`} aria-label="Secciones" hidden={!abierto}>
        <ul>
          {enlaces.map((e) => (
            <li key={e.href}>
              <a href={e.href} onClick={() => setAbierto(false)}>
                {e.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
