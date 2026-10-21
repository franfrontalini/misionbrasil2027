import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Estado } from "./config";
import type { InteresadoInput } from "./validation";

export type Interesado = {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  legajo: string;
  telefono: string;
  carrera: string;
  anio_cursada: string;
  interes_beca: string;
  consentimiento_datos: boolean;
  fecha_consentimiento: string;
  fecha_registro: string;
  fecha_actualizacion: string;
  estado: Estado;
};

export type ResultadoRegistro = "creado" | "actualizado" | "conflicto";

export class DbNoConfigurada extends Error {}

// ── Google Sheets vía Apps Script (producción) ────────────────────────────────
// El script (apps-script/Code.gs) se publica como aplicación web. Solo este servidor lo llama,
// con una clave secreta que nunca llega al navegador. La hoja queda compartida únicamente con
// el equipo organizador.

function appsScript() {
  const url = process.env.APPS_SCRIPT_URL;
  const secret = process.env.APPS_SCRIPT_SECRET;
  if (!url || !secret) return null;
  return { url, secret };
}

async function llamar<T>(accion: string, extra: Record<string, unknown> = {}): Promise<T> {
  const cfg = appsScript()!;
  const res = await fetch(cfg.url, {
    method: "POST",
    // text/plain evita el preflight y Apps Script lo lee igual desde e.postData.contents.
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ secret: cfg.secret, accion, ...extra }),
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
  const texto = await res.text();
  let json: { ok?: boolean; error?: string } & T;
  try {
    json = JSON.parse(texto);
  } catch {
    throw new Error(`Apps Script respondió algo que no es JSON (HTTP ${res.status}). ¿Está publicado con acceso "Cualquier persona"?`);
  }
  if (!json.ok) throw new Error(`Apps Script: ${json.error ?? "error desconocido"}`);
  return json;
}

// ── Archivo local (solo desarrollo) ────────────────────────────────────────────
// Permite probar la landing sin la hoja. En producción nunca se usa.

const ARCHIVO_LOCAL = path.join(process.cwd(), ".data", "interesados.json");

function localPermitido() {
  return process.env.NODE_ENV !== "production";
}

async function leerLocal(): Promise<Interesado[]> {
  try {
    return JSON.parse(await fs.readFile(ARCHIVO_LOCAL, "utf8"));
  } catch {
    return [];
  }
}

async function escribirLocal(filas: Interesado[]) {
  await fs.mkdir(path.dirname(ARCHIVO_LOCAL), { recursive: true });
  await fs.writeFile(ARCHIVO_LOCAL, JSON.stringify(filas, null, 2));
}

function backend() {
  if (appsScript()) return "sheets" as const;
  if (localPermitido()) return "local" as const;
  throw new DbNoConfigurada("Faltan APPS_SCRIPT_URL y APPS_SCRIPT_SECRET.");
}

export function modoBaseDeDatos() {
  return appsScript() ? "sheets" : localPermitido() ? "local" : "sin-configurar";
}

// ── Operaciones ────────────────────────────────────────────────────────────────

export async function registrarInteresado(d: InteresadoInput): Promise<ResultadoRegistro> {
  if (backend() === "sheets") {
    const r = await llamar<{ resultado: ResultadoRegistro }>("registrar", { datos: d });
    return r.resultado;
  }

  const filas = await leerLocal();
  const porEmail = filas.find((f) => f.email.toLowerCase() === d.email.toLowerCase());
  const porLegajo = filas.find((f) => f.legajo.toUpperCase() === d.legajo.toUpperCase());
  if (porEmail && porLegajo && porEmail.id !== porLegajo.id) return "conflicto";

  const ahora = new Date().toISOString();
  const existente = porEmail ?? porLegajo;
  if (existente) {
    Object.assign(existente, d, { fecha_consentimiento: ahora, fecha_actualizacion: ahora });
    await escribirLocal(filas);
    return "actualizado";
  }
  filas.push({
    id: randomUUID(),
    ...d,
    fecha_consentimiento: ahora,
    fecha_registro: ahora,
    fecha_actualizacion: ahora,
    estado: "interesado",
  });
  await escribirLocal(filas);
  return "creado";
}

export async function listarInteresados(): Promise<Interesado[]> {
  const filas =
    backend() === "sheets" ? (await llamar<{ filas: Interesado[] }>("listar")).filas : await leerLocal();
  return filas.sort((a, b) => b.fecha_registro.localeCompare(a.fecha_registro));
}

export async function actualizarEstado(id: string, estado: Estado) {
  if (backend() === "sheets") {
    try {
      await llamar("actualizarEstado", { id, estado });
      return true;
    } catch (e) {
      if (e instanceof Error && e.message.includes("no_encontrado")) return false;
      throw e;
    }
  }
  const filas = await leerLocal();
  const fila = filas.find((f) => f.id === id);
  if (!fila) return false;
  fila.estado = estado;
  fila.fecha_actualizacion = new Date().toISOString();
  await escribirLocal(filas);
  return true;
}
