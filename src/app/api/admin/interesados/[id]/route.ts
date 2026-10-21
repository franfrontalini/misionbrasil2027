import { NextResponse } from "next/server";
import { z } from "zod";
import { actualizarEstado } from "@/lib/db";
import { ESTADOS } from "@/lib/config";

export const runtime = "nodejs";

const cuerpo = z.object({ estado: z.enum(ESTADOS.map((e) => e.value) as [string, ...string[]]) });

// El middleware ya exige sesión de administración para /api/admin/*.
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ ok: false, error: "Id inválido." }, { status: 400 });

  const parsed = cuerpo.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Estado inválido." }, { status: 400 });

  try {
    const ok = await actualizarEstado(id, parsed.data.estado as (typeof ESTADOS)[number]["value"]);
    if (!ok) return NextResponse.json({ ok: false, error: "No encontrado." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin] error al actualizar estado", e);
    return NextResponse.json({ ok: false, error: "No se pudo guardar." }, { status: 500 });
  }
}
