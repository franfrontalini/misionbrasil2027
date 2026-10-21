import { NextResponse } from "next/server";
import { DbNoConfigurada, registrarInteresado } from "@/lib/db";
import { dentroDelLimite, ipDe, verificarTurnstile } from "@/lib/proteccion";
import { erroresPorCampo, interesadoSchema } from "@/lib/validation";
import { siteConfig } from "@/lib/config";

export const runtime = "nodejs";

const TIEMPO_MINIMO_MS = 2500;

export async function POST(req: Request) {
  const ip = ipDe(req);

  if (!dentroDelLimite(`form:${ip}`, 8, 10 * 60 * 1000)) {
    return NextResponse.json(
      { ok: false, error: "Recibimos muchos envíos desde tu conexión. Probá de nuevo en unos minutos." },
      { status: 429 },
    );
  }

  if (Number(req.headers.get("content-length") ?? 0) > 10_000) {
    return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
  }

  // Trampas anti-bot: un campo oculto que las personas no completan y un tiempo mínimo de llenado.
  // Ante un bot respondemos "ok" sin guardar, para no darle pistas.
  const tiempo = Number(body._t);
  if ((typeof body.sitio_web === "string" && body.sitio_web.trim() !== "") || !Number.isFinite(tiempo) || tiempo < TIEMPO_MINIMO_MS) {
    return NextResponse.json({ ok: true, resultado: "creado" });
  }

  if (!(await verificarTurnstile(body._turnstile, ip))) {
    return NextResponse.json(
      { ok: false, error: "No pudimos verificar que no seas un robot. Recargá la página y probá de nuevo." },
      { status: 400 },
    );
  }

  const parsed = interesadoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Revisá los campos marcados.", campos: erroresPorCampo(parsed.error) },
      { status: 422 },
    );
  }

  try {
    const resultado = await registrarInteresado(parsed.data);
    if (resultado === "conflicto") {
      return NextResponse.json(
        {
          ok: false,
          error: siteConfig.contactoEmail
            ? `Ese legajo y ese correo figuran en registros distintos. Escribinos a ${siteConfig.contactoEmail} y lo resolvemos.`
            : "Ese legajo y ese correo figuran en registros distintos. Revisá los datos o contactá al equipo organizador.",
        },
        { status: 409 },
      );
    }
    return NextResponse.json({ ok: true, resultado });
  } catch (e) {
    console.error("[interesados] error al guardar", e instanceof DbNoConfigurada ? e.message : e);
    return NextResponse.json(
      { ok: false, error: "No pudimos guardar tus datos en este momento. Probá de nuevo en unos minutos." },
      { status: 503 },
    );
  }
}
