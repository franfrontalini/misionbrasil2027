import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import "./privacidad.css";

export const metadata: Metadata = {
  title: "Aviso de privacidad · Misión Académica Brasil 2027",
  description: "Cómo tratamos los datos del registro de interesados de la Misión Académica Brasil 2027.",
  alternates: { canonical: "/privacidad" },
};

function Pendiente({ children }: { children: React.ReactNode }) {
  return <mark className="pendiente">{children}</mark>;
}

export default function Privacidad() {
  const { responsableDatos, contactoEmail, conservacionHasta } = siteConfig;
  return (
    <main className="legal">
      <div className="legal__contenido">
        <Link href="/" className="legal__volver">
          ← Volver a Brasil 2027
        </Link>
        <p className="eyebrow">Protección de datos personales</p>
        <h1>Aviso de privacidad</h1>
        <p className="legal__intro">
          Este aviso explica qué datos pedimos en el registro de interesados de la Misión Académica Brasil 2027, para qué los
          usamos y cómo podés consultarlos, corregirlos o pedir que los eliminemos, de acuerdo con la Ley 25.326 de
          Protección de los Datos Personales.
        </p>

        <h2>Responsable</h2>
        <p>
          {responsableDatos ?? <Pendiente>[Área o persona responsable a completar]</Pendiente>}, Universidad Tecnológica
          Nacional, Facultad Regional Córdoba.
        </p>

        <h2>Qué datos pedimos</h2>
        <p>
          Nombre, apellido, correo electrónico, legajo UTN, teléfono o WhatsApp, carrera, año de cursada y tu interés en
          postularte a una beca. También registramos la fecha en que diste tu consentimiento y la fecha de registro. No
          pedimos datos de ingresos ni documentación económica en esta instancia.
        </p>

        <h2>Para qué los usamos</h2>
        <ul>
          <li>Gestionar tu manifestación de interés en la Misión Académica Brasil 2027.</li>
          <li>Enviarte novedades sobre el programa, los costos, las becas y las próximas etapas.</li>
          <li>Conocer la demanda y las necesidades de apoyo económico para organizar el contingente.</li>
        </ul>
        <p>
          Completar el formulario no implica una inscripción definitiva, una reserva de plaza ni la asignación de una beca.
        </p>

        <h2>Quién accede</h2>
        <p>
          Solo el equipo organizador autorizado de la Misión, mediante un panel protegido con contraseña. La información sobre
          becas es confidencial y nunca se publica. No vendemos ni cedemos tus datos a terceros. Los datos se alojan en un
          proveedor de base de datos en la nube que actúa como encargado del tratamiento.
        </p>

        <h2>Cuánto tiempo los conservamos</h2>
        <p>
          Hasta {conservacionHasta}, o hasta que pidas que los eliminemos si lo hacés antes. Después se eliminan o se
          anonimizan para fines estadísticos.
        </p>

        <h2>Tus derechos</h2>
        <p>
          Podés pedir en cualquier momento el acceso, la rectificación, la actualización o la supresión de tus datos, y
          retirar tu consentimiento. Para hacerlo, escribí a{" "}
          {contactoEmail ? (
            <a href={`mailto:${contactoEmail}`}>{contactoEmail}</a>
          ) : (
            <Pendiente>[correo de contacto a completar]</Pendiente>
          )}{" "}
          desde el correo que registraste. Para actualizar tus datos también podés volver a enviar el formulario con el mismo
          legajo o correo.
        </p>
        <p className="legal__norma">
          El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita
          a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto, conforme lo
          establecido en el artículo 14, inciso 3 de la Ley N.º 25.326. La Agencia de Acceso a la Información Pública, en su
          carácter de Órgano de Control de la Ley N.º 25.326, tiene la atribución de atender las denuncias y reclamos que
          interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de
          protección de datos personales.
        </p>

        <h2 id="analitica">Medición de visitas</h2>
        <p>
          Si lo aceptás, medimos visitas, clics en los botones y envíos del formulario de manera agregada y anónima, sin
          cookies, para mejorar la página. Si no lo aceptás, no se envía ninguna medición. Podés cambiar tu elección borrando
          los datos del sitio en tu navegador.
        </p>

        <h2>Seguridad</h2>
        <p>
          Los datos viajan cifrados (HTTPS) y se guardan en una base con acceso restringido. Las credenciales de acceso nunca
          se exponen en la página.
        </p>
      </div>
    </main>
  );
}
