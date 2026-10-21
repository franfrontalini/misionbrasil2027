"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { ANIOS, BECAS, CARRERAS } from "@/lib/config";
import { track } from "@/lib/analytics";
import { interesadoSchema, erroresPorCampo, type CampoInteresado } from "@/lib/validation";
import { IconCheck } from "./Icons";

type Errores = Partial<Record<CampoInteresado, string>>;
type Estado = { tipo: "inicial" } | { tipo: "enviando" } | { tipo: "exito"; actualizado: boolean } | { tipo: "error"; mensaje: string };

const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

const ORDEN: CampoInteresado[] = ["nombre", "apellido", "email", "legajo", "telefono", "carrera", "anio_cursada", "interes_beca", "consentimiento_datos"];

export function InterestForm() {
  const form = useRef<HTMLFormElement>(null);
  const exitoRef = useRef<HTMLHeadingElement>(null);
  const inicio = useRef(0);
  const [errores, setErrores] = useState<Errores>({});
  const [estado, setEstado] = useState<Estado>({ tipo: "inicial" });

  useEffect(() => {
    inicio.current = Date.now();
  }, []);

  useEffect(() => {
    if (estado.tipo === "exito") exitoRef.current?.focus();
  }, [estado.tipo]);

  function enfocarPrimerError(errs: Errores) {
    const campo = ORDEN.find((c) => errs[c]);
    if (!campo) return;
    const el = form.current?.querySelector<HTMLElement>(`[name="${campo}"]`);
    el?.focus();
  }

  function datosDelForm() {
    const fd = new FormData(form.current!);
    return {
      nombre: String(fd.get("nombre") ?? ""),
      apellido: String(fd.get("apellido") ?? ""),
      email: String(fd.get("email") ?? ""),
      legajo: String(fd.get("legajo") ?? ""),
      telefono: String(fd.get("telefono") ?? ""),
      carrera: String(fd.get("carrera") ?? ""),
      anio_cursada: String(fd.get("anio_cursada") ?? ""),
      interes_beca: String(fd.get("interes_beca") ?? ""),
      consentimiento_datos: fd.get("consentimiento_datos") === "on",
      sitio_web: String(fd.get("sitio_web") ?? ""),
      _turnstile: String(fd.get("cf-turnstile-response") ?? ""),
    };
  }

  function validarCampo(campo: CampoInteresado) {
    if (!errores[campo]) return;
    const r = interesadoSchema.safeParse(datosDelForm());
    const nuevos = r.success ? {} : erroresPorCampo(r.error);
    setErrores((prev) => ({ ...prev, [campo]: nuevos[campo] }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (estado.tipo === "enviando") return;

    const datos = datosDelForm();
    const r = interesadoSchema.safeParse(datos);
    if (!r.success) {
      const errs = erroresPorCampo(r.error);
      setErrores(errs);
      setEstado({ tipo: "error", mensaje: "Revisá los campos marcados." });
      enfocarPrimerError(errs);
      return;
    }

    setErrores({});
    setEstado({ tipo: "enviando" });
    try {
      const res = await fetch("/api/interesados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...datos, _t: Date.now() - inicio.current }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        if (json.campos) {
          setErrores(json.campos);
          enfocarPrimerError(json.campos);
        }
        setEstado({ tipo: "error", mensaje: json.error ?? "No pudimos enviar el formulario. Probá de nuevo." });
        return;
      }
      track("Formulario enviado", { carrera: datos.carrera });
      setEstado({ tipo: "exito", actualizado: json.resultado === "actualizado" });
    } catch {
      setEstado({ tipo: "error", mensaje: "Parece que hay un problema de conexión. Revisá tu internet y probá de nuevo." });
    }
  }

  if (estado.tipo === "exito") {
    return (
      <div className="form-exito" role="status">
        <span className="form-exito__icono">
          <IconCheck />
        </span>
        <h3 ref={exitoRef} tabIndex={-1}>
          ¡Gracias por tu interés!
        </h3>
        <p>
          {estado.actualizado
            ? "Ya teníamos un registro con tu legajo o correo, así que actualizamos tus datos. "
            : "Recibimos tus datos para la Misión Académica Brasil 2027. "}
          Te vamos a contactar cuando tengamos novedades sobre el programa, los costos y las próximas etapas.
        </p>
        <p className="form-exito__nota">Recordá que este registro es una manifestación de interés: todavía no implica una plaza reservada.</p>
      </div>
    );
  }

  const enviando = estado.tipo === "enviando";
  const err = (c: CampoInteresado) =>
    errores[c] ? (
      <p className="campo__error" id={`${c}-error`}>
        {errores[c]}
      </p>
    ) : null;
  const aria = (c: CampoInteresado, ayuda?: string) => ({
    "aria-invalid": errores[c] ? true : undefined,
    "aria-describedby": [errores[c] ? `${c}-error` : null, ayuda].filter(Boolean).join(" ") || undefined,
    onBlur: () => validarCampo(c),
    onChange: () => validarCampo(c),
  });

  return (
    <form ref={form} className="form" noValidate onSubmit={onSubmit} aria-busy={enviando}>
      <p className="form__obligatorios">Todos los campos son obligatorios.</p>

      <div className="form__grilla">
        <div className="campo">
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" name="nombre" type="text" autoComplete="given-name" maxLength={80} required {...aria("nombre")} />
          {err("nombre")}
        </div>
        <div className="campo">
          <label htmlFor="apellido">Apellido</label>
          <input id="apellido" name="apellido" type="text" autoComplete="family-name" maxLength={80} required {...aria("apellido")} />
          {err("apellido")}
        </div>
        <div className="campo">
          <label htmlFor="email">Correo electrónico</label>
          <input id="email" name="email" type="email" inputMode="email" autoComplete="email" maxLength={160} required {...aria("email")} />
          {err("email")}
        </div>
        <div className="campo">
          <label htmlFor="legajo">Legajo UTN</label>
          <input id="legajo" name="legajo" type="text" autoComplete="off" maxLength={20} required {...aria("legajo")} />
          {err("legajo")}
        </div>
        <div className="campo campo--ancho">
          <label htmlFor="telefono">Teléfono / WhatsApp</label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="351 555 1234"
            maxLength={25}
            required
            {...aria("telefono", "telefono-ayuda")}
          />
          <p className="campo__ayuda" id="telefono-ayuda">
            Con código de área, sin 0 ni 15.
          </p>
          {err("telefono")}
        </div>
        <div className="campo">
          <label htmlFor="carrera">Carrera</label>
          <select id="carrera" name="carrera" required defaultValue="" {...aria("carrera")}>
            <option value="" disabled>
              Elegí tu carrera
            </option>
            {CARRERAS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {err("carrera")}
        </div>
        <div className="campo">
          <label htmlFor="anio_cursada">Año de cursada</label>
          <select id="anio_cursada" name="anio_cursada" required defaultValue="" {...aria("anio_cursada")}>
            <option value="" disabled>
              Elegí el año
            </option>
            {ANIOS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {err("anio_cursada")}
        </div>
      </div>

      <fieldset
        className="form__becas"
        aria-invalid={errores.interes_beca ? true : undefined}
        aria-describedby={["becas-ayuda", errores.interes_beca ? "interes_beca-error" : ""].filter(Boolean).join(" ")}
      >
        <legend>¿Te gustaría postularte para una beca?</legend>
        <div className="opciones">
          {BECAS.map((o) => (
            <label key={o.value} className="opcion">
              <input type="radio" name="interes_beca" value={o.value} required onChange={() => validarCampo("interes_beca")} />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
        <p className="campo__ayuda" id="becas-ayuda">
          Esta respuesta nos ayuda a conocer las necesidades de apoyo económico. No constituye una solicitud formal ni garantiza
          la asignación de una beca.
        </p>
        {err("interes_beca")}
      </fieldset>

      {/* Campo trampa para bots: oculto para personas y lectores de pantalla. */}
      <div className="trampa" aria-hidden="true">
        <label htmlFor="sitio_web">Sitio web</label>
        <input id="sitio_web" name="sitio_web" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="campo campo--check">
        <label className="check">
          <input type="checkbox" name="consentimiento_datos" required {...aria("consentimiento_datos")} />
          <span>
            Autorizo el tratamiento de mis datos para gestionar mi manifestación de interés y recibir comunicaciones relacionadas
            con la Misión Académica Brasil 2027. <a href="/privacidad" target="_blank" rel="noopener">Leer el aviso de privacidad</a>
          </span>
        </label>
        {err("consentimiento_datos")}
      </div>

      {TURNSTILE_KEY && (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
          <div className="cf-turnstile" data-sitekey={TURNSTILE_KEY} data-language="es" />
        </>
      )}

      <div className="form__acciones">
        <button type="submit" className="btn btn--primario btn--grande" disabled={enviando} data-cta="formulario">
          {enviando ? (
            <>
              <span className="spinner" aria-hidden="true" /> Enviando…
            </>
          ) : (
            "Quiero ser parte de Brasil 2027"
          )}
        </button>
        <div aria-live="polite" className="form__estado">
          {estado.tipo === "error" && <p className="form__error">{estado.mensaje}</p>}
        </div>
      </div>
    </form>
  );
}
