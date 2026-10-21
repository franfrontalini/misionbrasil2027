// Sesión del panel de administración: cookie httpOnly firmada con HMAC-SHA256.
// Usa Web Crypto para funcionar tanto en el middleware (edge) como en las rutas de Node.

export const COOKIE_SESION = "mb27_admin";
export const DURACION_SESION_S = 8 * 60 * 60;

const enc = new TextEncoder();

function secreto() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 32) return null;
  return s;
}

export function adminConfigurado() {
  return Boolean(secreto() && process.env.ADMIN_PASSWORD);
}

async function clave(s: string) {
  return crypto.subtle.importKey("raw", enc.encode(s), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

function b64url(buf: ArrayBuffer) {
  let bin = "";
  for (const b of new Uint8Array(buf)) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function desdeB64url(s: string) {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

export async function crearSesion() {
  const s = secreto();
  if (!s) throw new Error("ADMIN_SESSION_SECRET no configurado");
  const vence = Math.floor(Date.now() / 1000) + DURACION_SESION_S;
  const payload = `admin.${vence}`;
  const firma = await crypto.subtle.sign("HMAC", await clave(s), enc.encode(payload));
  return `${payload}.${b64url(firma)}`;
}

export async function sesionValida(token: string | undefined) {
  const s = secreto();
  if (!s || !token) return false;
  const partes = token.split(".");
  if (partes.length !== 3) return false;
  const [sujeto, vence, firma] = partes;
  if (sujeto !== "admin" || !/^\d+$/.test(vence) || Number(vence) < Date.now() / 1000) return false;
  try {
    return await crypto.subtle.verify("HMAC", await clave(s), desdeB64url(firma), enc.encode(`${sujeto}.${vence}`));
  } catch {
    return false;
  }
}

// Comparación de contraseña en tiempo constante (compara los hash, no los textos).
export async function contrasenaCorrecta(intento: string) {
  const real = process.env.ADMIN_PASSWORD;
  if (!real) return false;
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(intento)),
    crypto.subtle.digest("SHA-256", enc.encode(real)),
  ]);
  const x = new Uint8Array(a);
  const y = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}
