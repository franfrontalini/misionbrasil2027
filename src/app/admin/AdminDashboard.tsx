"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ANIOS, BECAS_CORTO, CARRERAS, ESTADOS, labelDe, type Estado } from "@/lib/config";
import type { Interesado } from "@/lib/db";

type Props = { filasIniciales: Interesado[]; error: string | null; modo: string };

const ANIO_CORTO: Record<string, string> = { "1": "1.º", "2": "2.º", "3": "3.º", "4": "4.º", "5": "5.º", completo: "Completo" };
const CARRERA_CORTA: Record<string, string> = { industrial: "Industrial", mecanica: "Mecánica" };

// Link de WhatsApp: los números argentinos sin código de país se completan con 54 9.
function whatsapp(tel: string) {
  let d = tel.replace(/\D/g, "").replace(/^0/, "");
  if (!d.startsWith("54")) d = "549" + d;
  return `https://wa.me/${d}`;
}

const fecha = new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Argentina/Cordoba" });

function contar(filas: Interesado[], campo: keyof Interesado, valores: string[]) {
  return valores.map((v) => ({ v, n: filas.filter((f) => f[campo] === v).length }));
}

function Barras({ titulo, datos, etiquetas, total }: { titulo: string; datos: { v: string; n: number }[]; etiquetas: Record<string, string>; total: number }) {
  const max = Math.max(1, ...datos.map((d) => d.n));
  return (
    <figure className="panel-card barras">
      <figcaption>{titulo}</figcaption>
      <ul>
        {datos.map((d) => {
          const pct = total ? Math.round((d.n / total) * 100) : 0;
          return (
            <li key={d.v} title={`${etiquetas[d.v] ?? d.v}: ${d.n} (${pct} %)`}>
              <span className="barras__label">{etiquetas[d.v] ?? d.v}</span>
              <span className="barras__pista">
                <span className="barras__barra" style={{ width: `${(d.n / max) * 100}%` }} />
              </span>
              <span className="barras__valor">
                {d.n}
                <small> · {pct} %</small>
              </span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}

function celdaCsv(v: unknown) {
  let s = String(v ?? "");
  // Evita que Excel interprete el contenido como fórmula.
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function exportarCsv(filas: Interesado[]) {
  const cab = ["Nombre", "Apellido", "Email", "Legajo", "Teléfono", "Carrera", "Año de cursada", "Interés en beca", "Estado", "Fecha de registro", "Fecha de consentimiento", "Última actualización"];
  const lineas = filas.map((f) =>
    [
      f.nombre,
      f.apellido,
      f.email,
      f.legajo,
      f.telefono,
      labelDe(CARRERAS, f.carrera),
      labelDe(ANIOS, f.anio_cursada),
      BECAS_CORTO[f.interes_beca] ?? f.interes_beca,
      labelDe(ESTADOS, f.estado),
      fecha.format(new Date(f.fecha_registro)),
      fecha.format(new Date(f.fecha_consentimiento)),
      fecha.format(new Date(f.fecha_actualizacion)),
    ]
      .map(celdaCsv)
      .join(";"),
  );
  // BOM + separador ";" para que Excel en español lo abra con acentos y columnas correctas.
  const blob = new Blob(["﻿" + [cab.join(";"), ...lineas].join("\r\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `interesados-brasil-2027-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function AdminDashboard({ filasIniciales, error, modo }: Props) {
  const router = useRouter();
  const [filas, setFilas] = useState(filasIniciales);
  const [q, setQ] = useState("");
  const [carrera, setCarrera] = useState("");
  const [anio, setAnio] = useState("");
  const [beca, setBeca] = useState("");
  const [estado, setEstado] = useState("");
  const [guardando, setGuardando] = useState<string | null>(null);
  const [aviso, setAviso] = useState("");

  const filtradas = useMemo(() => {
    const t = q.trim().toLowerCase();
    return filas.filter(
      (f) =>
        (!carrera || f.carrera === carrera) &&
        (!anio || f.anio_cursada === anio) &&
        (!beca || f.interes_beca === beca) &&
        (!estado || f.estado === estado) &&
        (!t || `${f.nombre} ${f.apellido} ${f.email} ${f.legajo} ${f.telefono}`.toLowerCase().includes(t)),
    );
  }, [filas, q, carrera, anio, beca, estado]);

  const total = filas.length;
  const solicitanBeca = filas.filter((f) => f.interes_beca !== "no_necesita").length;
  const hayFiltros = q || carrera || anio || beca || estado;

  async function cambiarEstado(id: string, nuevo: Estado) {
    const previo = filas.find((f) => f.id === id)?.estado;
    setGuardando(id);
    setFilas((fs) => fs.map((f) => (f.id === id ? { ...f, estado: nuevo } : f)));
    const res = await fetch(`/api/admin/interesados/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevo }),
    }).catch(() => null);
    setGuardando(null);
    if (res?.status === 401) return router.replace("/admin/login");
    if (!res?.ok) {
      setFilas((fs) => fs.map((f) => (f.id === id && previo ? { ...f, estado: previo } : f)));
      setAviso("No se pudo guardar el cambio de estado. Probá de nuevo.");
    } else {
      setAviso("Estado actualizado.");
    }
  }

  async function salir() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin/login");
  }

  return (
    <main className="panel">
      <header className="panel__header">
        <div>
          <p className="eyebrow">Misión Académica Brasil 2027</p>
          <h1>Interesados</h1>
        </div>
        <div className="panel__acciones">
          <button type="button" className="btn btn--fantasma btn--chico" onClick={() => router.refresh()}>
            Actualizar
          </button>
          <button type="button" className="btn btn--fantasma btn--chico" onClick={salir}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {modo === "local" && (
        <p className="panel__nota">
          Modo desarrollo: los registros se guardan en <code>.data/interesados.json</code>. Para producción, conectá la hoja de Google con Apps Script.
        </p>
      )}
      {error && <p className="panel__error">{error}</p>}

      <section className="kpis" aria-label="Resumen">
        <div className="panel-card kpi kpi--principal">
          <span className="kpi__valor">{total}</span>
          <span className="kpi__label">Interesados en total</span>
        </div>
        {CARRERAS.map((c) => (
          <div key={c.value} className="panel-card kpi">
            <span className="kpi__valor">{filas.filter((f) => f.carrera === c.value).length}</span>
            <span className="kpi__label">{c.label}</span>
          </div>
        ))}
        <div className="panel-card kpi">
          <span className="kpi__valor">{solicitanBeca}</span>
          <span className="kpi__label">Interesados en beca</span>
        </div>
      </section>

      <section className="graficos" aria-label="Distribuciones">
        <Barras titulo="Año de cursada" datos={contar(filas, "anio_cursada", ANIOS.map((a) => a.value))} etiquetas={ANIO_CORTO} total={total} />
        <Barras titulo="Interés en becas" datos={contar(filas, "interes_beca", Object.keys(BECAS_CORTO))} etiquetas={BECAS_CORTO} total={total} />
        <Barras
          titulo="Estado"
          datos={contar(filas, "estado", ESTADOS.map((e) => e.value))}
          etiquetas={Object.fromEntries(ESTADOS.map((e) => [e.value, e.label]))}
          total={total}
        />
      </section>

      <section className="panel-card listado" aria-labelledby="titulo-listado">
        <div className="listado__cabecera">
          <h2 id="titulo-listado">
            Listado <span className="listado__conteo">{hayFiltros ? `${filtradas.length} de ${total}` : total}</span>
          </h2>
          <button type="button" className="btn btn--primario btn--chico" onClick={() => exportarCsv(filtradas)} disabled={!filtradas.length}>
            Exportar CSV (Excel)
          </button>
        </div>

        <div className="filtros" role="search">
          <label className="filtro filtro--busqueda">
            <span className="sr-only">Buscar</span>
            <input type="search" placeholder="Buscar por nombre, email, legajo o teléfono" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <label className="filtro">
            <span>Carrera</span>
            <select value={carrera} onChange={(e) => setCarrera(e.target.value)}>
              <option value="">Todas</option>
              {CARRERAS.map((o) => (
                <option key={o.value} value={o.value}>
                  {CARRERA_CORTA[o.value]}
                </option>
              ))}
            </select>
          </label>
          <label className="filtro">
            <span>Año</span>
            <select value={anio} onChange={(e) => setAnio(e.target.value)}>
              <option value="">Todos</option>
              {ANIOS.map((o) => (
                <option key={o.value} value={o.value}>
                  {ANIO_CORTO[o.value]}
                </option>
              ))}
            </select>
          </label>
          <label className="filtro">
            <span>Beca</span>
            <select value={beca} onChange={(e) => setBeca(e.target.value)}>
              <option value="">Todas</option>
              {Object.entries(BECAS_CORTO).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <label className="filtro">
            <span>Estado</span>
            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="">Todos</option>
              {ESTADOS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          {hayFiltros && (
            <button
              type="button"
              className="filtros__limpiar"
              onClick={() => {
                setQ("");
                setCarrera("");
                setAnio("");
                setBeca("");
                setEstado("");
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <p className="sr-only" aria-live="polite">
          {aviso}
        </p>

        <div className="tabla-wrap">
          <table className="tabla">
            <thead>
              <tr>
                <th scope="col">Estudiante</th>
                <th scope="col">Legajo</th>
                <th scope="col">Contacto</th>
                <th scope="col">Carrera</th>
                <th scope="col">Año</th>
                <th scope="col">Beca</th>
                <th scope="col">Registro</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((f) => (
                <tr key={f.id}>
                  <td>
                    <strong>
                      {f.apellido}, {f.nombre}
                    </strong>
                  </td>
                  <td className="mono">{f.legajo}</td>
                  <td>
                    <a href={`mailto:${f.email}`}>{f.email}</a>
                    <br />
                    <a href={whatsapp(f.telefono)} target="_blank" rel="noopener noreferrer" className="mono">
                      {f.telefono}
                    </a>
                  </td>
                  <td>{CARRERA_CORTA[f.carrera] ?? f.carrera}</td>
                  <td>{ANIO_CORTO[f.anio_cursada] ?? f.anio_cursada}</td>
                  <td>
                    <span className={`tag tag--${f.interes_beca}`}>{BECAS_CORTO[f.interes_beca] ?? f.interes_beca}</span>
                  </td>
                  <td className="mono nowrap">{fecha.format(new Date(f.fecha_registro))}</td>
                  <td>
                    <select
                      aria-label={`Estado de ${f.nombre} ${f.apellido}`}
                      className={`estado-select estado-select--${f.estado}`}
                      value={f.estado}
                      disabled={guardando === f.id}
                      onChange={(e) => cambiarEstado(f.id, e.target.value as Estado)}
                    >
                      {ESTADOS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtradas.length && <p className="tabla__vacia">{total ? "Ningún registro coincide con los filtros." : "Todavía no hay interesados registrados."}</p>}
        </div>
      </section>
    </main>
  );
}
