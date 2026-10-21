import { construirLettering } from "@/lib/lettering";

const { piezas, ancho, alto } = construirLettering();
const PAD = 0.6;

export function BrasilTitle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox={`${-PAD} ${-PAD} ${ancho + PAD * 2} ${alto + PAD * 2}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id="lettering-filas">
          <rect x={-1} y={0} width={ancho + 2} height={6} />
          <rect x={-1} y={alto - 6} width={ancho + 2} height={6} />
        </clipPath>
      </defs>
      <g fill="none" strokeWidth={1} strokeLinecap="butt" strokeLinejoin="miter" clipPath="url(#lettering-filas)">
        {piezas.map((p) => (
          <path
            key={p.i}
            d={p.d}
            transform={`translate(${p.x} ${p.y})`}
            pathLength={1}
            strokeWidth={p.grosor}
            className={`trazo trazo--${p.color}`}
            style={{ animationDelay: `${120 + p.i * 70}ms` }}
          />
        ))}
      </g>
    </svg>
  );
}
