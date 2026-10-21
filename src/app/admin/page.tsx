import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_SESION, sesionValida } from "@/lib/auth";
import { listarInteresados, modoBaseDeDatos } from "@/lib/db";
import { AdminDashboard } from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // El middleware ya protege la ruta; se vuelve a verificar por si cambia el matcher.
  const token = (await cookies()).get(COOKIE_SESION)?.value;
  if (!(await sesionValida(token))) redirect("/admin/login");

  let filas: Awaited<ReturnType<typeof listarInteresados>> = [];
  let error: string | null = null;
  try {
    filas = await listarInteresados();
  } catch (e) {
    console.error("[admin] error al listar", e);
    error = "No se pudo leer la hoja de Google. Revisá APPS_SCRIPT_URL, APPS_SCRIPT_SECRET y que el script esté publicado.";
  }

  return <AdminDashboard filasIniciales={filas} error={error} modo={modoBaseDeDatos()} />;
}
