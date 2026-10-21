import "server-only";

// Límite de envíos por IP en memoria. Alcanza para frenar ráfagas de bots en una instancia;
// para varias instancias, sumar Turnstile (abajo) o un límite en el proxy/CDN.
const ventanas = new Map<string, number[]>();

export function dentroDelLimite(clave: string, maximo: number, ventanaMs: number) {
  const ahora = Date.now();
  const previos = (ventanas.get(clave) ?? []).filter((t) => ahora - t < ventanaMs);
  if (previos.length >= maximo) {
    ventanas.set(clave, previos);
    return false;
  }
  previos.push(ahora);
  ventanas.set(clave, previos);
  if (ventanas.size > 5000) {
    for (const [k, v] of ventanas) if (v.every((t) => ahora - t >= ventanaMs)) ventanas.delete(k);
  }
  return true;
}

export function ipDe(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0].trim() || req.headers.get("x-real-ip") || "desconocida";
}

// Cloudflare Turnstile (opcional): se activa si están las dos claves.
export function turnstileActivo() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}

export async function verificarTurnstile(token: unknown, ip: string) {
  if (!turnstileActivo()) return true;
  if (typeof token !== "string" || !token) return false;
  const body = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY!, response: token, remoteip: ip });
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const d = (await r.json()) as { success?: boolean };
    return d.success === true;
  } catch {
    return false;
  }
}
