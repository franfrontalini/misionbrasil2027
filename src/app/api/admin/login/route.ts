import { NextResponse } from "next/server";
import { COOKIE_SESION, DURACION_SESION_S, adminConfigurado, contrasenaCorrecta, crearSesion } from "@/lib/auth";
import { dentroDelLimite, ipDe } from "@/lib/proteccion";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!adminConfigurado()) {
    return NextResponse.json(
      { ok: false, error: "El panel no está configurado. Definí ADMIN_PASSWORD y ADMIN_SESSION_SECRET (32+ caracteres)." },
      { status: 503 },
    );
  }
  if (!dentroDelLimite(`login:${ipDe(req)}`, 6, 15 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "Demasiados intentos. Esperá 15 minutos." }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const contrasena = typeof body.contrasena === "string" ? body.contrasena : "";
  if (!(await contrasenaCorrecta(contrasena))) {
    return NextResponse.json({ ok: false, error: "Contraseña incorrecta." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_SESION, await crearSesion(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: DURACION_SESION_S,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_SESION, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
