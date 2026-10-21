import { z } from "zod";
import { ANIOS, BECAS, CARRERAS } from "./config";

const valores = <T extends readonly { value: string }[]>(l: T) =>
  l.map((o) => o.value) as [T[number]["value"], ...T[number]["value"][]];

const texto = (campo: string, max: number) =>
  z
    .string({ required_error: `Completá ${campo}.` })
    .trim()
    .min(1, `Completá ${campo}.`)
    .max(max, `${campo[0].toUpperCase() + campo.slice(1)} es demasiado largo.`);

export const interesadoSchema = z.object({
  nombre: texto("tu nombre", 80),
  apellido: texto("tu apellido", 80),
  email: z
    .string({ required_error: "Completá tu correo electrónico." })
    .trim()
    .toLowerCase()
    .min(1, "Completá tu correo electrónico.")
    .max(160, "El correo es demasiado largo.")
    .email("Revisá el formato del correo (ej.: nombre@dominio.com)."),
  legajo: texto("tu legajo", 20).regex(/^[A-Za-z0-9.\-/]+$/, "El legajo solo puede tener letras, números, puntos o guiones."),
  telefono: z
    .string({ required_error: "Completá tu teléfono." })
    .trim()
    .min(1, "Completá tu teléfono.")
    .regex(/^\+?[\d\s()-]{8,25}$/, "Ingresá el número con código de área (ej.: 351 555 1234).")
    .refine((v) => v.replace(/\D/g, "").length >= 8, "Ingresá el número con código de área (ej.: 351 555 1234)."),
  carrera: z.enum(valores(CARRERAS), { errorMap: () => ({ message: "Elegí tu carrera." }) }),
  anio_cursada: z.enum(valores(ANIOS), { errorMap: () => ({ message: "Elegí tu año de cursada." }) }),
  interes_beca: z.enum(valores(BECAS), { errorMap: () => ({ message: "Elegí una opción." }) }),
  consentimiento_datos: z.literal(true, {
    errorMap: () => ({ message: "Necesitamos tu autorización para guardar tus datos." }),
  }),
});

export type InteresadoInput = z.infer<typeof interesadoSchema>;

export type CampoInteresado = keyof InteresadoInput;

export function erroresPorCampo(error: z.ZodError) {
  const out: Partial<Record<CampoInteresado, string>> = {};
  for (const issue of error.issues) {
    const campo = issue.path[0] as CampoInteresado;
    if (campo && !out[campo]) out[campo] = issue.message;
  }
  return out;
}
