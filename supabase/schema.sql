-- Misión Académica Brasil 2027 — registro de interesados
-- Ejecutar en el SQL Editor de Supabase (o en cualquier PostgreSQL 14+).
--
-- Seguridad:
--   * RLS activado y SIN políticas: los roles anon/authenticated no pueden leer ni escribir.
--   * Solo el servidor de la landing (service_role, nunca expuesto al navegador) accede a la tabla.
--   * La función registrar_interesado solo puede ejecutarla service_role.

create extension if not exists pgcrypto;

do $$ begin
  create type estado_interesado as enum ('interesado', 'contactado', 'preinscripto', 'confirmado', 'desistio');
exception when duplicate_object then null; end $$;

create table if not exists public.interesados_mision_brasil_2027 (
  id                    uuid primary key default gen_random_uuid(),
  nombre                text not null check (char_length(nombre) between 1 and 80),
  apellido              text not null check (char_length(apellido) between 1 and 80),
  email                 text not null check (char_length(email) <= 160),
  legajo                text not null check (char_length(legajo) between 1 and 20),
  telefono              text not null check (char_length(telefono) between 6 and 30),
  carrera               text not null check (carrera in ('industrial', 'mecanica')),
  anio_cursada          text not null check (anio_cursada in ('1', '2', '3', '4', '5', 'completo')),
  interes_beca          text not null check (interes_beca in ('completa', 'media', 'ambas', 'no_necesita')),
  consentimiento_datos  boolean not null check (consentimiento_datos = true),
  fecha_consentimiento  timestamptz not null,
  fecha_registro        timestamptz not null default now(),
  fecha_actualizacion   timestamptz not null default now(),
  estado                estado_interesado not null default 'interesado'
);

-- Evita duplicados por email (sin distinguir mayúsculas) o por legajo.
create unique index if not exists interesados_email_unico  on public.interesados_mision_brasil_2027 (lower(email));
create unique index if not exists interesados_legajo_unico on public.interesados_mision_brasil_2027 (upper(legajo));
create index if not exists interesados_fecha_registro_idx on public.interesados_mision_brasil_2027 (fecha_registro desc);

alter table public.interesados_mision_brasil_2027 enable row level security;
alter table public.interesados_mision_brasil_2027 force row level security;
revoke all on public.interesados_mision_brasil_2027 from anon, authenticated;

-- Alta o actualización atómica. Si el legajo o el email ya existen, actualiza ese registro
-- (conserva estado y fecha_registro). Si legajo y email pertenecen a registros distintos, devuelve 'conflicto'.
create or replace function public.registrar_interesado(
  p_nombre text, p_apellido text, p_email text, p_legajo text, p_telefono text,
  p_carrera text, p_anio_cursada text, p_interes_beca text
) returns text
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_por_email  uuid;
  v_por_legajo uuid;
  v_id         uuid;
begin
  select id into v_por_email  from interesados_mision_brasil_2027 where lower(email)  = lower(p_email)  for update;
  select id into v_por_legajo from interesados_mision_brasil_2027 where upper(legajo) = upper(p_legajo) for update;

  if v_por_email is not null and v_por_legajo is not null and v_por_email <> v_por_legajo then
    return 'conflicto';
  end if;

  v_id := coalesce(v_por_email, v_por_legajo);

  if v_id is null then
    insert into interesados_mision_brasil_2027
      (nombre, apellido, email, legajo, telefono, carrera, anio_cursada, interes_beca,
       consentimiento_datos, fecha_consentimiento)
    values
      (p_nombre, p_apellido, lower(p_email), p_legajo, p_telefono, p_carrera, p_anio_cursada, p_interes_beca,
       true, now());
    return 'creado';
  end if;

  update interesados_mision_brasil_2027 set
    nombre = p_nombre, apellido = p_apellido, email = lower(p_email), legajo = p_legajo,
    telefono = p_telefono, carrera = p_carrera, anio_cursada = p_anio_cursada,
    interes_beca = p_interes_beca, consentimiento_datos = true, fecha_consentimiento = now(),
    fecha_actualizacion = now()
  where id = v_id;
  return 'actualizado';
exception when unique_violation then
  -- Dos envíos simultáneos con los mismos datos: el segundo se trata como actualización.
  return 'reintentar';
end;
$$;

revoke all on function public.registrar_interesado(text, text, text, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.registrar_interesado(text, text, text, text, text, text, text, text) to service_role;
