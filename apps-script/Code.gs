/**
 * Misión Académica Brasil 2027 — registro de interesados en Google Sheets.
 *
 * Este script vive dentro de la hoja de cálculo (Extensiones → Apps Script) y se publica
 * como aplicación web. Solo el servidor de la landing lo llama, enviando una clave secreta
 * que nunca llega al navegador. Ver README.md, sección "Google Sheets + Apps Script".
 *
 * Acciones (POST con cuerpo JSON):
 *   { secret, accion: "registrar", datos: {...} }          → { ok, resultado: "creado" | "actualizado" | "conflicto" }
 *   { secret, accion: "listar" }                            → { ok, filas: [...] }
 *   { secret, accion: "actualizarEstado", id, estado }      → { ok }
 */

var HOJA = 'Interesados';

var COLUMNAS = [
  'id', 'nombre', 'apellido', 'email', 'legajo', 'telefono', 'carrera', 'anio_cursada',
  'interes_beca', 'consentimiento_datos', 'fecha_consentimiento', 'fecha_registro',
  'fecha_actualizacion', 'estado',
];

var VALORES = {
  carrera: ['industrial', 'mecanica'],
  anio_cursada: ['1', '2', '3', '4', '5', 'completo'],
  interes_beca: ['completa', 'media', 'ambas', 'no_necesita'],
  estado: ['interesado', 'contactado', 'preinscripto', 'confirmado', 'desistio'],
};

var COLUMNAS_FECHA = ['fecha_consentimiento', 'fecha_registro', 'fecha_actualizacion'];

// ── Configuración inicial: ejecutar UNA vez desde el editor (botón ▶ con "configurar") ──
function configurar() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = libro.getSheetByName(HOJA) || libro.insertSheet(HOJA);

  hoja.getRange(1, 1, 1, COLUMNAS.length).setValues([COLUMNAS])
    .setFontWeight('bold').setBackground('#0B2986').setFontColor('#FFFFFF');
  hoja.setFrozenRows(1);

  // Texto plano en las columnas de datos (legajos y teléfonos no se convierten en números).
  var filas = hoja.getMaxRows() - 1;
  COLUMNAS.forEach(function (c, i) {
    var rango = hoja.getRange(2, i + 1, filas, 1);
    if (COLUMNAS_FECHA.indexOf(c) >= 0) rango.setNumberFormat('dd/mm/yyyy hh:mm');
    else if (c !== 'consentimiento_datos') rango.setNumberFormat('@');
  });

  // Desplegable de estado, para poder cambiarlo también desde la hoja.
  var colEstado = COLUMNAS.indexOf('estado') + 1;
  hoja.getRange(2, colEstado, filas, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(VALORES.estado, true).setAllowInvalid(false).build()
  );

  var props = PropertiesService.getScriptProperties();
  if (!props.getProperty('SECRET')) {
    props.setProperty('SECRET', Utilities.getUuid() + Utilities.getUuid().replace(/-/g, ''));
  }
  Logger.log('Hoja lista. Copiá esta clave en la variable APPS_SCRIPT_SECRET de Vercel:\n' + props.getProperty('SECRET'));
}

// ── Aplicación web ────────────────────────────────────────────────────────────
function doGet() {
  return json({ ok: true, servicio: 'Misión Académica Brasil 2027' });
}

function doPost(e) {
  var cuerpo;
  try {
    cuerpo = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, error: 'json_invalido' });
  }

  var secreto = PropertiesService.getScriptProperties().getProperty('SECRET');
  if (!secreto || cuerpo.secret !== secreto) return json({ ok: false, error: 'no_autorizado' });

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (err) {
    return json({ ok: false, error: 'ocupado' });
  }

  try {
    var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA);
    if (!hoja) return json({ ok: false, error: 'falta_configurar' });

    switch (cuerpo.accion) {
      case 'registrar':
        return json(registrar(hoja, cuerpo.datos || {}));
      case 'listar':
        return json({ ok: true, filas: leerFilas(hoja).map(function (f) { return f.datos; }) });
      case 'actualizarEstado':
        return json(actualizarEstado(hoja, cuerpo.id, cuerpo.estado));
      default:
        return json({ ok: false, error: 'accion_desconocida' });
    }
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: 'error_interno' });
  } finally {
    lock.releaseLock();
  }
}

// ── Acciones ──────────────────────────────────────────────────────────────────
function registrar(hoja, d) {
  var error = validar(d);
  if (error) return { ok: false, error: 'invalido', campo: error };

  var email = String(d.email).trim().toLowerCase();
  var legajo = String(d.legajo).trim();
  var filas = leerFilas(hoja);

  var porEmail = null, porLegajo = null;
  filas.forEach(function (f) {
    if (String(f.datos.email).toLowerCase() === email) porEmail = f;
    if (String(f.datos.legajo).toUpperCase() === legajo.toUpperCase()) porLegajo = f;
  });
  if (porEmail && porLegajo && porEmail.fila !== porLegajo.fila) return { ok: true, resultado: 'conflicto' };

  var ahora = new Date();
  var nuevos = {
    nombre: limpiar(d.nombre), apellido: limpiar(d.apellido), email: email, legajo: legajo,
    telefono: limpiar(d.telefono), carrera: d.carrera, anio_cursada: d.anio_cursada,
    interes_beca: d.interes_beca, consentimiento_datos: true, fecha_consentimiento: ahora,
    fecha_actualizacion: ahora,
  };

  var existente = porEmail || porLegajo;
  if (existente) {
    // Conserva id, fecha de registro y estado.
    var fila = COLUMNAS.map(function (c) { return c in nuevos ? nuevos[c] : existente.crudo[COLUMNAS.indexOf(c)]; });
    hoja.getRange(existente.fila, 1, 1, COLUMNAS.length).setValues([fila.map(celda)]);
    return { ok: true, resultado: 'actualizado' };
  }

  nuevos.id = Utilities.getUuid();
  nuevos.fecha_registro = ahora;
  nuevos.estado = 'interesado';
  hoja.appendRow(COLUMNAS.map(function (c) { return celda(nuevos[c]); }));
  return { ok: true, resultado: 'creado' };
}

function actualizarEstado(hoja, id, estado) {
  if (VALORES.estado.indexOf(estado) < 0) return { ok: false, error: 'estado_invalido' };
  var filas = leerFilas(hoja);
  for (var i = 0; i < filas.length; i++) {
    if (filas[i].datos.id === id) {
      hoja.getRange(filas[i].fila, COLUMNAS.indexOf('estado') + 1).setValue(estado);
      hoja.getRange(filas[i].fila, COLUMNAS.indexOf('fecha_actualizacion') + 1).setValue(new Date());
      return { ok: true };
    }
  }
  return { ok: false, error: 'no_encontrado' };
}

// ── Utilidades ────────────────────────────────────────────────────────────────
function leerFilas(hoja) {
  var ultima = hoja.getLastRow();
  if (ultima < 2) return [];
  var valores = hoja.getRange(2, 1, ultima - 1, COLUMNAS.length).getValues();
  var out = [];
  valores.forEach(function (v, i) {
    if (!v[0]) return; // fila vacía
    var datos = {};
    COLUMNAS.forEach(function (c, j) {
      var x = v[j];
      if (x instanceof Date) x = x.toISOString();
      else if (c === 'consentimiento_datos') x = x === true || String(x).toUpperCase() === 'TRUE';
      else x = String(x);
      datos[c] = x;
    });
    out.push({ fila: i + 2, datos: datos, crudo: v });
  });
  return out;
}

function validar(d) {
  var texto = { nombre: 80, apellido: 80, email: 160, legajo: 20, telefono: 30 };
  for (var c in texto) {
    var v = d[c] == null ? '' : String(d[c]).trim();
    if (!v || v.length > texto[c]) return c;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(d.email).trim())) return 'email';
  for (var k in VALORES) {
    if (k !== 'estado' && VALORES[k].indexOf(d[k]) < 0) return k;
  }
  if (d.consentimiento_datos !== true) return 'consentimiento_datos';
  return null;
}

function limpiar(v) {
  return String(v).trim();
}

// Evita que un texto que empieza con = + - @ se interprete como fórmula.
function celda(v) {
  if (typeof v === 'string' && /^[=+\-@]/.test(v)) return "'" + v;
  return v;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
