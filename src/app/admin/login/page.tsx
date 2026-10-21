"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    setError("");
    const contrasena = String(new FormData(e.currentTarget).get("contrasena") ?? "");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contrasena }),
    }).catch(() => null);
    const json = await res?.json().catch(() => ({}));
    if (res?.ok) {
      router.replace("/admin");
      router.refresh();
      return;
    }
    setError(json?.error ?? "No se pudo iniciar sesión.");
    setEnviando(false);
  }

  return (
    <main className="login">
      <form className="login__caja" onSubmit={onSubmit}>
        <p className="eyebrow">Equipo organizador</p>
        <h1>Panel Brasil 2027</h1>
        <label htmlFor="contrasena">Contraseña</label>
        <input id="contrasena" name="contrasena" type="password" autoComplete="current-password" required autoFocus />
        <div aria-live="polite">{error && <p className="login__error">{error}</p>}</div>
        <button type="submit" className="btn btn--primario" disabled={enviando}>
          {enviando ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </main>
  );
}
