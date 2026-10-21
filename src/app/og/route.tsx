/* eslint-disable @next/next/no-img-element -- ImageResponse (Satori) solo admite <img>. */
import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";
import { letteringSvg } from "@/lib/lettering";

export const runtime = "nodejs";

// Generador de la imagen para compartir (WhatsApp, Instagram, redes).
// La landing usa la versión estática /og-brasil-2027.jpg, más liviana. Si cambia el diseño:
//   npm run og
// (regenera public/og-brasil-2027.jpg a partir de esta ruta con el servidor de desarrollo corriendo).
export async function GET() {
  const foto = await readFile(path.join(process.cwd(), "public/img/rio-pan-de-azucar.jpg"));
  const fotoSrc = `data:image/jpeg;base64,${foto.toString("base64")}`;
  const titulo = `data:image/svg+xml;base64,${Buffer.from(letteringSvg("#FFFFFF", 26)).toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#0B2986" }}>
        <img src={fotoSrc} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage: "linear-gradient(90deg, rgba(8,26,84,0.97) 0%, rgba(11,41,134,0.88) 48%, rgba(11,41,134,0.25) 78%, rgba(11,41,134,0.05) 100%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 72px", gap: 22 }}>
          <div style={{ display: "flex", color: "#40C5F2", fontSize: 24, letterSpacing: 4, textTransform: "uppercase", fontWeight: 700 }}>
            Misión Académica · UTN FRC
          </div>
          <img src={titulo} alt="" width={600} height={341} />
          <div style={{ display: "flex", color: "#fff", fontSize: 44, fontWeight: 800 }}>La ingeniería no tiene fronteras.</div>
          <div style={{ display: "flex", color: "rgba(255,255,255,0.88)", fontSize: 26 }}>
            9 al 18 de julio de 2027 · São Paulo + Río de Janeiro
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
