// Iconografía minimalista de trazo: 24×24, trazo 1.75, terminaciones rectas como el lettering.
type P = { className?: string };

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
  "aria-hidden": true,
  focusable: false,
};

export const IconIndustria = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 21V10l5 3V10l5 3V10l5 3V4h3v17Z" />
    <path d="M7 17h2M12 17h2M17 17h1" />
  </svg>
);

export const IconUniversidad = (p: P) => (
  <svg {...base} {...p}>
    <path d="M9 3h6M10 3v6l-5.5 9.5A1.6 1.6 0 0 0 5.9 21h12.2a1.6 1.6 0 0 0 1.4-2.5L14 9V3" />
    <path d="M7.5 15h9" />
  </svg>
);

export const IconConexiones = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="5" cy="12" r="2.2" />
    <circle cx="19" cy="5" r="2.2" />
    <circle cx="19" cy="19" r="2.2" />
    <path d="M7 11l10-5M7 13l10 5M19 7.2v9.6" />
  </svg>
);

export const IconExperiencia = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5l-2 5-5 2 2-5Z" />
  </svg>
);

export const IconCalendario = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 6h16v14H4ZM4 10h16M8 3v4M16 3v4" />
  </svg>
);

export const IconPin = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

export const IconEngranaje = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" />
  </svg>
);

export const IconBirrete = (p: P) => (
  <svg {...base} {...p}>
    <path d="M2 9l10-5 10 5-10 5Z" />
    <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v6" />
  </svg>
);

export const IconCuotas = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 6h18v12H3Z" />
    <path d="M7 14h2M11 14h2M15 14h2M3 10h18" />
  </svg>
);

export const IconBeca = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.8Z" />
  </svg>
);

export const IconFlecha = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const IconMas = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 12.5l5 5L20 6.5" />
  </svg>
);

export const IconMenu = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const IconCerrar = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
