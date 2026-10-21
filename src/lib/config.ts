// Datos editables de la landing. Lo que todavía no está definido queda en null
// y la interfaz lo oculta o muestra un aviso, en lugar de inventar información.

export const siteConfig = {
  nombre: "Misión Académica Brasil 2027",
  institucion: "UTN Facultad Regional Córdoba",
  carreras: "Ingeniería Industrial e Ingeniería Mecánica",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  // Correo de contacto del equipo organizador (configurable por variable de entorno).
  contactoEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,

  // Área o persona responsable del tratamiento de los datos, tal como figurará en el aviso de privacidad.
  responsableDatos: process.env.NEXT_PUBLIC_RESPONSABLE_DATOS || null,

  // Fecha hasta la que se conservan los datos. Revisar con el área legal antes de publicar.
  conservacionHasta: process.env.NEXT_PUBLIC_CONSERVACION_HASTA || "el 31 de diciembre de 2027",

  // Logos oficiales: copiar los archivos a /public/logos y completar la ruta. Mientras sea null,
  // se muestra un espacio reservado.
  logos: {
    utnFrc: null as string | null, // p. ej. "/logos/utn-frc-blanco.svg"
    misiones: null as string | null, // p. ej. "/logos/misiones-academicas.svg"
  },
};

export const CARRERAS = [
  { value: "industrial", label: "Ingeniería Industrial" },
  { value: "mecanica", label: "Ingeniería Mecánica" },
] as const;

export const ANIOS = [
  { value: "1", label: "1.º año" },
  { value: "2", label: "2.º año" },
  { value: "3", label: "3.º año" },
  { value: "4", label: "4.º año" },
  { value: "5", label: "5.º año" },
  { value: "completo", label: "Cursado completo / finalizando la carrera" },
] as const;

export const BECAS = [
  { value: "completa", label: "Sí, me gustaría postularme a una beca completa." },
  { value: "media", label: "Sí, me gustaría postularme a una media beca." },
  { value: "ambas", label: "Me interesan ambas posibilidades." },
  { value: "no_necesita", label: "No necesito una beca para participar." },
] as const;

export const BECAS_CORTO: Record<string, string> = {
  completa: "Beca completa",
  media: "Media beca",
  ambas: "Ambas",
  no_necesita: "No necesita",
};

export const ESTADOS = [
  { value: "interesado", label: "Interesado" },
  { value: "contactado", label: "Contactado" },
  { value: "preinscripto", label: "Preinscripto" },
  { value: "confirmado", label: "Confirmado" },
  { value: "desistio", label: "Desistió" },
] as const;

export type Carrera = (typeof CARRERAS)[number]["value"];
export type Anio = (typeof ANIOS)[number]["value"];
export type Beca = (typeof BECAS)[number]["value"];
export type Estado = (typeof ESTADOS)[number]["value"];

export function labelDe<T extends { value: string; label: string }>(lista: readonly T[], value: string) {
  return lista.find((o) => o.value === value)?.label ?? value;
}
