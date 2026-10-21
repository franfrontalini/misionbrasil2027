import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Estado } from "./config";
import type { InteresadoInput } from "./validation";

export const TABLA = "interesados_mision_brasil_2027";

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

// ── Supabase (producción) ──────────────────────────────────────────────────────
// Usa la clave service_role, que solo vive en el servidor. La tabla tiene RLS sin políticas,
// así que la clave pública (anon) no puede leerla ni escribirla.

let cliente: SupabaseClient | null = null;

function supabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  cliente ??= createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return cliente;
}

// ── Archivo local (solo desarrollo) ────────────────────────────────────────────
// Permite probar la landing sin Supabase. En producción nunca se usa.

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
  const sb = supabase();
  if (sb) return { tipo: "supabase" as const, sb };
  if (localPermitido()) return { tipo: "local" as const };
  throw new DbNoConfigurada("Faltan SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.");
}

export function modoBaseDeDatos() {
  return supabase() ? "supabase" : localPermitido() ? "local" : "sin-configurar";
}

// ── Operaciones ────────────────────────────────────────────────────────────────

export async function registrarInteresado(d: InteresadoInput): Promise<ResultadoRegistro> {
  const b = backend();

  if (b.tipo === "supabase") {
    const args = {
      p_nombre: d.nombre,
      p_apellido: d.apellido,
      p_email: d.email,
      p_legajo: d.legajo,
      p_telefono: d.telefono,
      p_carrera: d.carrera,
      p_anio_cursada: d.anio_cursada,
      p_interes_beca: d.interes_beca,
    };
    for (let intento = 0; intento < 2; intento++) {
      const { data, error } = await b.sb.rpc("registrar_interesado", args);
      if (error) throw error;
      if (data !== "reintentar") return data as ResultadoRegistro;
    }
    return "actualizado";
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
  const b = backend();
  if (b.tipo === "supabase") {
    const filas: Interesado[] = [];
    const lote = 1000;
    for (let desde = 0; ; desde += lote) {
      const { data, error } = await b.sb
        .from(TABLA)
        .select("*")
        .order("fecha_registro", { ascending: false })
        .range(desde, desde + lote - 1);
      if (error) throw error;
      filas.push(...(data as Interesado[]));
      if (!data || data.length < lote) break;
    }
    return filas;
  }
  const filas = await leerLocal();
  return filas.sort((a, b) => b.fecha_registro.localeCompare(a.fecha_registro));
}

export async function actualizarEstado(id: string, estado: Estado) {
  const b = backend();
  const ahora = new Date().toISOString();
  if (b.tipo === "supabase") {
    const { data, error } = await b.sb
      .from(TABLA)
      .update({ estado, fecha_actualizacion: ahora })
      .eq("id", id)
      .select("id");
    if (error) throw error;
    return (data?.length ?? 0) > 0;
  }
  const filas = await leerLocal();
  const fila = filas.find((f) => f.id === id);
  if (!fila) return false;
  fila.estado = estado;
  fila.fecha_actualizacion = ahora;
  await escribirLocal(filas);
  return true;
}
