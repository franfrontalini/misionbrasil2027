// Lettering "BRASIL 2027".
// Letras dibujadas con un único trazo de 1 módulo sobre una altura de 6 módulos, la misma
// retícula de 6×6 que usa el isologotipo UTN FRC. Las curvas son semicírculos y el "0" es
// un círculo estirado: las formas que el manual identifica en el escudo de la UTN
// (círculo, signo "más", semicírculos). Los dígitos usan los colores complementarios.

export type Trazo = { d: string; color: "base" | "verde" | "naranja" | "celeste" | "magenta" };
type Glifo = { ancho: number; trazos: Trazo[] };

const glifos: Record<string, Glifo> = {
  B: {
    ancho: 4.1,
    trazos: [
      { d: "M0.5 0V6", color: "base" },
      { d: "M0.5 0.5H2.1A1.2 1.2 0 0 1 2.1 2.9H0.5", color: "base" },
      { d: "M0.5 2.9H2.3A1.3 1.3 0 0 1 2.3 5.5H0.5", color: "base" },
    ],
  },
  R: {
    ancho: 4.2,
    trazos: [
      { d: "M0.5 0V6", color: "base" },
      { d: "M0.5 0.5H2.1A1.25 1.25 0 0 1 2.1 3H0.5", color: "base" },
      { d: "M1.9 3L3.75 6.6", color: "base" },
    ],
  },
  A: {
    ancho: 4.5,
    trazos: [
      { d: "M0.5 6V2.25A1.75 1.75 0 0 1 4 2.25V6", color: "base" },
      { d: "M0.5 3.9H4", color: "naranja" },
    ],
  },
  S: {
    ancho: 4.2,
    trazos: [{ d: "M3.9 0.5H1.7A1.2 1.2 0 0 0 1.7 2.9H2.4A1.3 1.3 0 0 1 2.4 5.5H0", color: "base" }],
  },
  I: { ancho: 1, trazos: [{ d: "M0.5 0V6", color: "base" }] },
  L: { ancho: 3.6, trazos: [{ d: "M0.5 0V5.5H3.6", color: "base" }] },
  "2": {
    ancho: 4,
    trazos: [{ d: "M0.5 2A1.5 1.5 0 0 1 3.5 2C3.5 3.3 2.2 4 0.5 5.5H4", color: "verde" }],
  },
  "0": {
    ancho: 4,
    trazos: [{ d: "M2 0.5A1.5 1.5 0 0 1 3.5 2V4A1.5 1.5 0 0 1 0.5 4V2A1.5 1.5 0 0 1 2 0.5Z", color: "celeste" }],
  },
  "7": {
    ancho: 4,
    trazos: [{ d: "M0 0.5H3.6L1.4 6.6", color: "magenta" }],
  },
};

const ESPACIO = 0.95;
const ALTO = 6;
const INTERLINEA = 1.6;

export type Pieza = Trazo & { x: number; y: number; i: number; grosor?: number };

function componer(palabra: string, x0: number, y0: number, colores?: Trazo["color"][]) {
  const piezas: Pieza[] = [];
  let x = x0;
  [...palabra].forEach((ch, idx) => {
    const g = glifos[ch];
    for (const t of g.trazos) {
      piezas.push({ ...t, color: colores?.[idx] ?? t.color, x, y: y0, i: 0 });
    }
    x += g.ancho + ESPACIO;
  });
  return { piezas, ancho: x - x0 - ESPACIO };
}

// Fila 1: BRASIL. Fila 2: motivos del escudo + 2027 alineado a la derecha.
export function construirLettering() {
  const fila1 = componer("BRASIL", 0, 0);
  const ancho = fila1.ancho;
  const y2 = ALTO + INTERLINEA;
  const anio = componer("2027", 0, 0, ["verde", "naranja", "celeste", "magenta"]);
  const x2 = ancho - anio.ancho;
  const fila2 = componer("2027", x2, y2, ["verde", "naranja", "celeste", "magenta"]);

  // En el hueco izquierdo de la segunda fila, una línea fina que remata en el signo "más" del
  // escudo UTN y conduce la lectura hacia el año.
  const motivos: Pieza[] = [
    { d: `M0 ${y2 + 3}H${x2 - 2.6}`, color: "base", x: 0, y: 0, i: 0, grosor: 0.3 },
    { d: `M${x2 - 2.3} ${y2 + 3}H${x2 - 0.9} M${x2 - 1.6} ${y2 + 2.3}V${y2 + 3.7}`, color: "celeste", x: 0, y: 0, i: 0, grosor: 0.45 },
  ];

  const piezas = [...fila1.piezas, ...motivos, ...fila2.piezas].map((p, i) => ({ ...p, i }));
  return { piezas, ancho, alto: y2 + ALTO };
}

export const COLORES_LETTERING = {
  verde: "#6FA958",
  naranja: "#FF8E2C",
  celeste: "#40C5F2",
  magenta: "#D830A0",
};

// SVG como texto (para la imagen Open Graph y el favicon).
export function letteringSvg(base = "#FFFFFF", escala = 40) {
  const { piezas, ancho, alto } = construirLettering();
  const pad = 0.6;
  const w = (ancho + pad * 2) * escala;
  const h = (alto + pad * 2) * escala;
  const paths = piezas
    .map((p) => {
      const color = p.color === "base" ? base : COLORES_LETTERING[p.color];
      const grosor = p.grosor ? ` stroke-width="${p.grosor}"` : "";
      return `<path d="${p.d}" transform="translate(${p.x} ${p.y})" stroke="${color}"${grosor}/>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${-pad} ${-pad} ${ancho + pad * 2} ${alto + pad * 2}"><defs><clipPath id="c"><rect x="-1" y="0" width="${ancho + 2}" height="6"/><rect x="-1" y="${alto - 6}" width="${ancho + 2}" height="6"/></clipPath></defs><g fill="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" clip-path="url(#c)">${paths}</g></svg>`;
}
