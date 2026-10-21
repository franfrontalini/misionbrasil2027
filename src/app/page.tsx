import Image from "next/image";
import { BrasilTitle } from "@/components/BrasilTitle";
import { ConsentBanner } from "@/components/ConsentBanner";
import { Effects } from "@/components/Effects";
import { Header } from "@/components/Header";
import { InterestForm } from "@/components/InterestForm";
import { LogoSlot } from "@/components/LogoSlot";
import {
  IconBeca,
  IconBirrete,
  IconCalendario,
  IconConexiones,
  IconCuotas,
  IconEngranaje,
  IconExperiencia,
  IconFlecha,
  IconIndustria,
  IconMas,
  IconPin,
  IconUniversidad,
} from "@/components/Icons";
import { siteConfig } from "@/lib/config";

import imgSaoPaulo from "../../public/img/sao-paulo.jpg";
import imgRio from "../../public/img/rio-pan-de-azucar.jpg";
import imgRioCristo from "../../public/img/rio-cristo-bahia.jpg";
import imgAtardecer from "../../public/img/rio-cristo-atardecer.jpg";
import imgEstudiantesLab from "../../public/img/estudiantes-laboratorio.jpg";
import imgRobots from "../../public/img/robots-industriales.jpg";
import imgLaboratorio from "../../public/img/laboratorio.jpg";
import imgGrupo from "../../public/img/grupo-estudiantes.jpg";

type EstadoInfo = "confirmado" | "previsto" | "a-definir";
const ETIQUETA: Record<EstadoInfo, string> = { confirmado: "Confirmado", previsto: "Previsto", "a-definir": "A definir" };

function Estado({ e }: { e: EstadoInfo }) {
  return <span className={`estado estado--${e}`}>{ETIQUETA[e]}</span>;
}

const pilares = [
  {
    icono: IconIndustria,
    color: "naranja",
    titulo: "Industria en acción",
    texto: "Conocé procesos productivos, fabricación, automatización y gestión industrial.",
  },
  {
    icono: IconUniversidad,
    color: "celeste",
    titulo: "Universidades y tecnología",
    texto: "Visitá instituciones académicas, laboratorios y centros de innovación.",
  },
  {
    icono: IconConexiones,
    color: "magenta",
    titulo: "Conexiones internacionales",
    texto: "Compartí experiencias con estudiantes, docentes y profesionales de Brasil.",
  },
  {
    icono: IconExperiencia,
    color: "verde",
    titulo: "Una experiencia inolvidable",
    texto: "Descubrí dos de las ciudades más importantes de Brasil y compartí el viaje con otros estudiantes.",
  },
];

const destinos = [
  {
    id: "sao-paulo",
    ciudad: "São Paulo",
    lema: "Industria, tecnología e innovación",
    bajada: "El corazón industrial y económico de Brasil.",
    img: imgSaoPaulo,
    alt: "Puente Octávio Frias de Oliveira sobre el río Pinheiros, en São Paulo",
    color: "naranja",
    actividades: [
      "Visitas a empresas y plantas industriales.",
      "Encuentros académicos en la Universidad de São Paulo (USP).",
      "Experiencias de automatización e Industria 4.0 en SENAI.",
      "Visita a FuturePrint 2027, feria internacional de tecnologías de producción e impresión.",
      "Recorridos urbanos y culturales.",
    ],
  },
  {
    id: "rio",
    ciudad: "Río de Janeiro",
    lema: "Ciencia, futuro y nuevas perspectivas",
    bajada: "Una ciudad que combina investigación, tecnología y paisajes únicos.",
    img: imgRioCristo,
    alt: "Cristo Redentor con la bahía de Guanabara y el Pan de Azúcar de fondo",
    color: "verde",
    actividades: [
      "Visita académica a COPPE/UFRJ.",
      "Centros de investigación, energía e innovación.",
      "Museu do Amanhã.",
      "Cristo Redentor y Pan de Azúcar.",
      "Experiencias culturales e integración grupal.",
    ],
  },
];

const numeros = [
  { valor: "10", unidad: "días", texto: "De experiencia internacional.", color: "verde" },
  { valor: "2", unidad: "ciudades", texto: "São Paulo y Río de Janeiro.", color: "naranja" },
  { valor: "6+", unidad: "experiencias", texto: "Académicas, industriales y tecnológicas previstas.", color: "celeste" },
  { valor: "1", unidad: "comunidad", texto: "Estudiantes de ingeniería con ganas de ir más allá.", color: "magenta" },
];

const intereses = ["Producción", "Procesos", "Diseño mecánico", "Automatización", "Gestión", "Innovación"];

const estadosInfo: { e: EstadoInfo; items: string[] }[] = [
  { e: "confirmado", items: ["Destino: São Paulo y Río de Janeiro", "Fechas: 9 al 18 de julio de 2027", "Carreras: Ingeniería Industrial y Mecánica", "Registro de interesados abierto"] },
  { e: "previsto", items: ["Visitas industriales y universidades", "Feria FuturePrint 2027 y Museu do Amanhã", "Pago en 6 cuotas", "Becas completas y medias becas"] },
  { e: "a-definir", items: ["Costos", "Cupos definitivos", "Condiciones de pago", "Criterios de selección", "Programa final de visitas"] },
];

const faqs = [
  { p: "¿Cuándo se realiza el viaje?", r: "Del viernes 9 al domingo 18 de julio de 2027." },
  { p: "¿Qué ciudades vamos a visitar?", r: "São Paulo y Río de Janeiro, Brasil." },
  {
    p: "¿Cuánto cuesta participar?",
    r: "El presupuesto definitivo está en elaboración. Las personas registradas recibirán información cuando estén definidos los costos.",
  },
  {
    p: "¿Se puede pagar en cuotas?",
    r: "Está prevista una modalidad de 6 cuotas con inicio en enero o febrero de 2027. Las condiciones se confirmarán próximamente.",
  },
  {
    p: "¿Hay becas disponibles?",
    r: "Se prevé disponer de algunas becas completas y medias becas. La asignación estará sujeta a disponibilidad y criterios que se informarán oportunamente.",
  },
  {
    p: "¿Necesito hablar portugués?",
    r: "No se establece por el momento un requisito de idioma. Algunas actividades podrían desarrollarse en portugués, con el acompañamiento académico correspondiente según disponibilidad.",
  },
  {
    p: "¿Completar el formulario me asegura un lugar?",
    r: "No. El formulario permite manifestar interés. Las condiciones de inscripción definitiva y los cupos se informarán posteriormente.",
  },
  {
    p: "¿Las visitas ya están confirmadas?",
    r: "La agenda está en desarrollo. Las instituciones mencionadas son anfitriones previstos o potenciales, según cada caso.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationEvent",
  name: "Misión Académica Brasil 2027",
  description:
    "Viaje académico de 10 días a São Paulo y Río de Janeiro para estudiantes de Ingeniería Industrial e Ingeniería Mecánica de UTN Facultad Regional Córdoba.",
  startDate: "2027-07-09",
  endDate: "2027-07-18",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: [
    { "@type": "Place", name: "São Paulo", address: { "@type": "PostalAddress", addressLocality: "São Paulo", addressCountry: "BR" } },
    { "@type": "Place", name: "Río de Janeiro", address: { "@type": "PostalAddress", addressLocality: "Rio de Janeiro", addressCountry: "BR" } },
  ],
  organizer: { "@type": "CollegeOrUniversity", name: "UTN Facultad Regional Córdoba" },
};

export default function Home() {
  return (
    <>
      <a href="#contenido" className="saltar">
        Saltar al contenido
      </a>
      <Header />

      <main id="contenido">
        {/* ── 1 · Hero ─────────────────────────────────────────── */}
        <section id="inicio" className="hero" aria-labelledby="titulo-hero">
          <div className="hero__fotos" aria-hidden="true">
            <div className="hero__foto hero__foto--sp">
              <Image src={imgSaoPaulo} alt="" fill priority sizes="(max-width: 800px) 100vw, 60vw" placeholder="blur" />
              <span className="hero__ciudad mono">São Paulo · 23°33′S</span>
            </div>
            <div className="hero__foto hero__foto--rio">
              <Image src={imgRio} alt="" fill priority sizes="(max-width: 800px) 100vw, 60vw" placeholder="blur" />
              <span className="hero__ciudad mono">Rio de Janeiro · 22°54′S</span>
            </div>
          </div>
          <div className="hero__velo" aria-hidden="true" />

          <div className="hero__contenido contenedor">
            <p className="hero__eyebrow mono">
              <span className="punto-vivo" aria-hidden="true" /> Convocatoria de interesados abierta
            </p>
            <h1 id="titulo-hero" className="hero__titulo">
              <span className="sr-only">Brasil 2027. </span>
              <BrasilTitle className="lettering" />
              <span className="hero__lema">La ingeniería no tiene fronteras.</span>
            </h1>
            <p className="hero__bajada">
              10 días para conocer industrias, explorar universidades, descubrir nuevas tecnologías y vivir una experiencia
              internacional junto a estudiantes de Ingeniería Industrial y Mecánica.
            </p>

            <ul className="hero__datos" aria-label="Datos del viaje">
              <li>
                <IconCalendario />
                Del 9 al 18 de julio de 2027
              </li>
              <li>
                <IconPin />
                São Paulo + Río de Janeiro
              </li>
              <li>
                <IconEngranaje />
                Ingeniería Industrial y Mecánica
              </li>
              <li>
                <IconBirrete />
                UTN Córdoba
              </li>
            </ul>

            <div className="hero__ctas">
              <a href="#inscripcion" className="btn btn--primario btn--grande" data-cta="hero-principal">
                Quiero ser parte <IconFlecha />
              </a>
              <a href="#mision" className="btn btn--claro btn--grande" data-cta="hero-secundario">
                Descubrí la misión
              </a>
            </div>
          </div>
        </section>

        {/* ── 2 · No es solamente un viaje ───────────────────── */}
        <section id="mision" className="seccion mision" aria-labelledby="titulo-mision">
          <div className="contenedor mision__grilla">
            <div className="mision__texto" data-reveal>
              <p className="eyebrow">No es solamente un viaje</p>
              <h2 id="titulo-mision">Conocé la ingeniería más allá del aula.</h2>
              <p className="lead">
                Imaginá recorrer una planta industrial, conversar con ingenieros que trabajan en proyectos de escala
                internacional, conocer laboratorios de investigación y compartir experiencias con estudiantes de
                universidades brasileñas.
              </p>
              <p>Eso es lo que buscamos con la Misión Académica Brasil 2027.</p>
              <p>
                Una oportunidad para conectar lo que estudiás con el mundo real, ampliar tu perspectiva profesional y
                conocer uno de los ecosistemas industriales más importantes de Latinoamérica.
              </p>
            </div>
            <div className="mision__collage" data-reveal aria-hidden="true">
              <div className="collage__foto collage__foto--a">
                <Image src={imgRobots} alt="" fill sizes="(max-width: 800px) 60vw, 28vw" placeholder="blur" />
              </div>
              <div className="collage__foto collage__foto--b">
                <Image src={imgEstudiantesLab} alt="" fill sizes="(max-width: 800px) 60vw, 24vw" placeholder="blur" />
              </div>
              <div className="collage__foto collage__foto--c">
                <Image src={imgLaboratorio} alt="" fill sizes="(max-width: 800px) 50vw, 18vw" placeholder="blur" />
              </div>
              <span className="motivo motivo--mas" />
              <span className="motivo motivo--circulo" />
            </div>
          </div>

          <ul className="contenedor pilares">
            {pilares.map(({ icono: Icono, color, titulo, texto }, i) => (
              <li key={titulo} className={`pilar pilar--${color}`} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                <span className="pilar__icono">
                  <Icono />
                </span>
                <h3>{titulo}</h3>
                <p>{texto}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── 3 · Dos ciudades, una experiencia ─────────────── */}
        <section id="destinos" className="seccion destinos" aria-labelledby="titulo-destinos">
          <div className="contenedor">
            <div className="encabezado" data-reveal>
              <p className="eyebrow">Destinos</p>
              <h2 id="titulo-destinos">Dos ciudades, una experiencia.</h2>
            </div>

            <div className="destinos__grilla">
              {destinos.map((d) => (
                <article key={d.id} className={`destino destino--${d.color}`} data-reveal aria-labelledby={`destino-${d.id}`}>
                  <div className="destino__foto">
                    <Image src={d.img} alt={d.alt} fill sizes="(max-width: 900px) 100vw, 50vw" placeholder="blur" />
                    <div className="destino__titulo">
                      <h3 id={`destino-${d.id}`}>{d.ciudad}</h3>
                      <p>{d.lema}</p>
                    </div>
                  </div>
                  <div className="destino__cuerpo">
                    <p className="destino__bajada">{d.bajada}</p>
                    <div className="destino__lista-titulo">
                      <h4>Actividades previstas</h4>
                      <Estado e="previsto" />
                    </div>
                    <ul className="destino__lista">
                      {d.actividades.map((a) => (
                        <li key={a}>
                          <IconMas />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
            <p className="aclaracion" data-reveal>
              Las visitas técnicas y académicas están sujetas a confirmación con las instituciones anfitrionas. El cronograma
              podrá ajustarse.
            </p>
          </div>
        </section>

        {/* ── 4 · La experiencia en números ─────────────────── */}
        <section className="numeros" aria-labelledby="titulo-numeros">
          <div className="contenedor">
            <h2 id="titulo-numeros" className="sr-only">
              La experiencia en números
            </h2>
            <p className="eyebrow eyebrow--claro" data-reveal>
              La experiencia en números
            </p>
            <ul className="numeros__grilla">
              {numeros.map((n, i) => (
                <li key={n.unidad} className={`numero numero--${n.color}`} data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
                  <span className="numero__valor">{n.valor}</span>
                  <span className="numero__unidad">{n.unidad}</span>
                  <span className="numero__texto">{n.texto}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── 5 · Una oportunidad para hacerla posible ──────── */}
        <section id="becas" className="seccion becas" aria-labelledby="titulo-becas">
          <div className="contenedor">
            <div className="encabezado encabezado--centro" data-reveal>
              <p className="eyebrow">Becas y cuotas</p>
              <h2 id="titulo-becas">Queremos que puedas ser parte.</h2>
              <p className="lead">
                Sabemos que participar en una experiencia internacional requiere planificación. Por eso estamos trabajando en
                alternativas para facilitar el acceso a la misión.
              </p>
            </div>

            <div className="becas__grilla">
              <article className="apoyo apoyo--celeste" data-reveal>
                <div className="apoyo__cabecera">
                  <span className="apoyo__icono">
                    <IconCuotas />
                  </span>
                  <Estado e="previsto" />
                </div>
                <h3>Pago en 6 cuotas</h3>
                <p>Está previsto ofrecer la posibilidad de abonar el viaje en 6 cuotas, comenzando en enero o febrero de 2027.</p>
                <p className="apoyo__nota">
                  Los montos, condiciones, vencimientos y modalidad de pago se informarán una vez definido el presupuesto.
                </p>
              </article>
              <article className="apoyo apoyo--magenta" data-reveal style={{ transitionDelay: "90ms" }}>
                <div className="apoyo__cabecera">
                  <span className="apoyo__icono">
                    <IconBeca />
                  </span>
                  <Estado e="previsto" />
                </div>
                <h3>Becas y medias becas</h3>
                <p>
                  Estamos trabajando para disponer de algunas becas completas y medias becas que permitan ampliar las
                  oportunidades de participación.
                </p>
                <p>Si necesitás apoyo económico, vas a poder indicarlo en el formulario de interés.</p>
                <p className="apoyo__nota">
                  La cantidad de becas, los criterios de asignación y sus condiciones serán comunicados oportunamente.
                </p>
              </article>
            </div>

            <div className="centrado" data-reveal>
              <a href="#inscripcion" className="btn btn--primario btn--grande" data-cta="becas">
                Quiero registrarme <IconFlecha />
              </a>
            </div>
          </div>
        </section>

        {/* ── 6 · ¿Quiénes pueden participar? ───────────────── */}
        <section className="seccion participar" aria-labelledby="titulo-participar">
          <div className="contenedor participar__grilla">
            <div className="participar__foto" data-reveal>
              <Image src={imgGrupo} alt="Grupo de estudiantes abrazados mirando el paisaje" fill sizes="(max-width: 900px) 100vw, 45vw" placeholder="blur" />
            </div>
            <div className="participar__texto" data-reveal>
              <p className="eyebrow">¿Quiénes pueden participar?</p>
              <h2 id="titulo-participar">Si estudiás Ingeniería Industrial o Mecánica, esta misión es para vos.</h2>
              <p>La convocatoria de interesados está dirigida a estudiantes de estas carreras de UTN Facultad Regional Córdoba.</p>
              <p>No importa si te interesa más…</p>
              <ul className="chips" aria-label="Áreas de interés">
                {intereses.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <p className="cita">Lo importante es que tengas curiosidad por conocer cómo se hace ingeniería en otros contextos.</p>
              <p className="aclaracion aclaracion--izq">
                Esta primera convocatoria nos ayudará a conocer la demanda y avanzar en la organización. Las condiciones
                definitivas de participación se comunicarán posteriormente.
              </p>
            </div>
          </div>
        </section>

        {/* ── Estado de la información ──────────────────────── */}
        <section className="seccion seccion--compacta info" aria-labelledby="titulo-info">
          <div className="contenedor">
            <div className="encabezado" data-reveal>
              <p className="eyebrow">Transparencia</p>
              <h2 id="titulo-info">Qué está confirmado y qué estamos definiendo.</h2>
            </div>
            <div className="info__grilla">
              {estadosInfo.map(({ e, items }, i) => (
                <div key={e} className={`info__col info__col--${e}`} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                  <Estado e={e} />
                  <ul>
                    {items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7 · Formulario ────────────────────────────────── */}
        <section id="inscripcion" className="seccion inscripcion" aria-labelledby="titulo-form">
          <div className="contenedor inscripcion__grilla">
            <div className="inscripcion__intro" data-reveal>
              <p className="eyebrow eyebrow--claro">Registro de interesados</p>
              <h2 id="titulo-form">Tu próxima experiencia puede empezar acá.</h2>
              <p>
                Dejanos tus datos para recibir novedades sobre la Misión Académica Brasil 2027, el programa de actividades,
                los costos y las posibilidades de becas.
              </p>
              <ul className="inscripcion__claves">
                <li>
                  <IconMas /> No es una inscripción definitiva ni reserva una plaza.
                </li>
                <li>
                  <IconMas /> Si ya te registraste, podés volver a enviarlo para actualizar tus datos.
                </li>
                <li>
                  <IconMas /> Tus datos solo los ve el equipo organizador.
                </li>
              </ul>
            </div>
            <div className="inscripcion__panel">
              <InterestForm />
            </div>
          </div>
        </section>

        {/* ── 8 · Preguntas frecuentes ──────────────────────── */}
        <section id="preguntas" className="seccion faq" aria-labelledby="titulo-faq">
          <div className="contenedor faq__grilla">
            <div className="encabezado" data-reveal>
              <p className="eyebrow">Preguntas frecuentes</p>
              <h2 id="titulo-faq">Lo que más nos preguntan.</h2>
              {siteConfig.contactoEmail && (
                <p>
                  ¿Te queda alguna duda? Escribinos a <a href={`mailto:${siteConfig.contactoEmail}`}>{siteConfig.contactoEmail}</a>.
                </p>
              )}
            </div>
            <div className="acordeon">
              {faqs.map((f) => (
                <details key={f.p} className="acordeon__item">
                  <summary>
                    <span>{f.p}</span>
                    <IconMas className="acordeon__icono" />
                  </summary>
                  <p>{f.r}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── 9 · Cierre ────────────────────────────────────── */}
        <section className="cierre" aria-labelledby="titulo-cierre">
          <Image src={imgAtardecer} alt="" fill sizes="100vw" placeholder="blur" className="cierre__img" />
          <div className="cierre__velo" aria-hidden="true" />
          <div className="contenedor cierre__contenido" data-reveal>
            <h2 id="titulo-cierre">Hay cosas que no se aprenden solamente en el aula.</h2>
            <p>
              Se descubren recorriendo industrias, conociendo personas, explorando nuevas ideas y animándose a vivir
              experiencias diferentes.
            </p>
            <p className="cierre__firma">
              Brasil 2027. <span>Tu ingeniería, otra perspectiva.</span>
            </p>
            <a href="#inscripcion" className="btn btn--primario btn--grande" data-cta="cierre">
              Quiero sumarme <IconFlecha />
            </a>
          </div>
        </section>
      </main>

      {/* ── 10 · Footer ─────────────────────────────────────── */}
      <footer className="footer">
        <div className="contenedor footer__grilla">
          <div className="footer__marca">
            <p className="footer__titulo">Misión Académica Brasil 2027</p>
            <p>UTN Facultad Regional Córdoba</p>
            <p>Ingeniería Industrial e Ingeniería Mecánica</p>
          </div>
          <div className="footer__logos">
            <LogoSlot tipo="utnFrc" />
            <LogoSlot tipo="misiones" />
          </div>
          <div className="footer__links">
            {siteConfig.contactoEmail && (
              <a href={`mailto:${siteConfig.contactoEmail}`}>{siteConfig.contactoEmail}</a>
            )}
            <a href="/privacidad">Aviso de privacidad</a>
            <a href="#inscripcion" data-cta="footer">
              Registrarme como interesado
            </a>
          </div>
        </div>
        <div className="contenedor footer__pie">
          <p>Fotografías: Unsplash. La información del viaje puede ajustarse a medida que avanza la organización.</p>
        </div>
      </footer>

      <a href="#inscripcion" className="cta-fijo btn btn--primario" data-cta="movil-fijo">
        Quiero ser parte <IconFlecha />
      </a>

      <Effects />
      <ConsentBanner />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
