# Brasil 2027 · Misión Académica UTN FRC

Landing de la Misión Académica Brasil 2027 para estudiantes de Ingeniería Industrial e Ingeniería Mecánica de UTN Facultad Regional Córdoba, con su registro de interesados y un panel para el equipo organizador.

- **Landing** (`/`): las 10 secciones, el formulario de interesados y las preguntas frecuentes.
- **Aviso de privacidad** (`/privacidad`): redactado según la Ley 25.326.
- **Panel** (`/admin`): protegido con contraseña. Muestra totales, distribuciones, filtros y búsqueda, el cambio de estado de cada interesado y la exportación a CSV para Excel.

Stack: Next.js 15 (App Router) + Supabase (PostgreSQL). Sin pasarela de pagos.

## Identidad visual

Sigue el *Manual de Identidad Visual UTN FRC* (versión reducida, mayo 2026). Los tokens están en `src/app/globals.css`:

- **Colores principales:** Azul UTN FRC `#1538B8`, sus variantes oscura y clara, y Celeste Asento `#40C5F2`.
- **Complementarios:** Verde Vital `#6FA958`, Naranja Energía `#FF8E2C` y Magenta Visión `#D830A0`. Se usan para dar dinamismo (dígitos del título, íconos, números, etiquetas de estado). Cuando se usan como texto sobre blanco, se oscurecen para cumplir el contraste mínimo de 4.5:1.
- **Tipografías:** Barlow (textos), Noto Sans (títulos), JetBrains Mono (datos) y Crimson Pro (citas).
- **Lettering “BRASIL 2027”** (`src/lib/lettering.ts`): diseñado para este viaje, con letras de un único trazo sobre la retícula de 6 módulos del isologotipo. Las curvas son los semicírculos del escudo; la línea de la segunda fila remata en su signo “más”. Se dibuja trazo por trazo al cargar la página.
- **Logos oficiales:** no se dibuja ningún logo. Copiá los archivos a `public/logos/` y completá las rutas en `siteConfig.logos` (`src/lib/config.ts`). Mientras tanto se muestran espacios reservados en el footer.

## Puesta en marcha local

```bash
npm install
cp .env.example .env.local   # completar ADMIN_PASSWORD y ADMIN_SESSION_SECRET
npm run dev
```

Sin Supabase configurado, en desarrollo los registros se guardan en `.data/interesados.json`, que git ignora. En producción el formulario no guarda nada hasta que se configure la base.

## Base de datos (Supabase)

1. Crear un proyecto en Supabase.
2. En **SQL Editor**, ejecutar `supabase/schema.sql`. El script:
   - crea la tabla `interesados_mision_brasil_2027`;
   - agrega índices únicos por email y por legajo;
   - activa RLS sin políticas, así que nadie puede leer la tabla con la clave pública;
   - crea la función `registrar_interesado`, que inserta o actualiza en una sola operación.
3. Cargar `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` como variables de entorno del servidor. **Nunca** con prefijo `NEXT_PUBLIC_`.

### Duplicados

- Si el legajo **o** el email ya existen, se actualizan los datos de ese registro. Se conservan el estado y la fecha de registro.
- Si el legajo pertenece a un registro y el email a otro, no se guarda nada y se le pide al estudiante que contacte al equipo.

## Variables de entorno

Ver `.env.example`. Las mínimas para producción:

| Variable | Para qué |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL pública (Open Graph, sitemap) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Correo de contacto. Sin él, se oculta en la página |
| `NEXT_PUBLIC_RESPONSABLE_DATOS` | Responsable del tratamiento, para el aviso de privacidad |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Base de datos |
| `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` | Acceso al panel |

Opcionales:

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` y `TURNSTILE_SECRET_KEY`: activan el captcha de Cloudflare Turnstile.
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`: activa la analítica, que solo se carga si la persona acepta.
- `NEXT_PUBLIC_CONSERVACION_HASTA`: plazo de conservación de los datos.

## Seguridad y anti-spam

- **Formulario:**
  - la validación se hace en el navegador y se repite en el servidor (zod);
  - tiene un campo trampa oculto y exige un tiempo mínimo de llenado;
  - admite 8 envíos cada 10 minutos por IP;
  - puede sumar Cloudflare Turnstile.
- **Panel:**
  - la sesión se guarda en una cookie `httpOnly` firmada con HMAC y dura 8 horas;
  - el login admite 6 intentos cada 15 minutos;
  - el middleware protege `/admin` y `/api/admin`, y los datos se leen solo desde el servidor;
  - el panel no se indexa ni se guarda en caché.
- **Exportación CSV:** se neutralizan las celdas que Excel podría interpretar como fórmulas.

> El panel usa una única contraseña compartida. Si el equipo crece, conviene pasar a cuentas individuales (por ejemplo, Supabase Auth con una lista de correos autorizados).

## Analítica

Si `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` está definido, aparece un aviso de consentimiento. Solo si la persona acepta, se cargan Plausible (no usa cookies) y estos eventos:

- **Visitas.**
- **`Clic CTA`**, con la ubicación del botón.
- **`Formulario enviado`.**

## Compartir (Open Graph)

La imagen de portada es `public/og-brasil-2027.jpg` (1200×630). Si cambia el título o la foto, regenerala con el servidor de desarrollo corriendo:

```bash
npm run og
```

## Contenido pendiente de completar

- Logos oficiales de UTN FRC y del programa de Misiones Académicas.
- Correo de contacto y responsable del tratamiento de datos.
- Plazo de conservación de los datos, a confirmar con el área legal.
- Fotografías: hoy se usan fotos de Unsplash (licencia libre). Se pueden reemplazar por fotos propias en `public/img/` con el mismo nombre de archivo.
