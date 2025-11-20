// Cambia este valor por la URL REAL de tu backend en Render
// Ejemplo: const API_BASE = "https://backend-mesh.onrender.com";
const API_BASE = "https://backend-mesh.onrender.com";

const NODOS = ["A", "B", "C", "D"];

function formatearFecha(timestampSegundos) {
  if (!timestampSegundos) return "--";
  const d = new Date(timestampSegundos * 1000);
  return d.toLocaleString();
}

function setEstadoActualizacion() {
  const el = document.getElementById("estado-actualizacion");
  const ahora = new Date().toLocaleTimeString();
  el.textContent = "Actualizado: " + ahora;
}

async function fetchJSON(url) {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error("Error HTTP " + resp.status);
  }
  return resp.json();
}

// ============ NODOS ACTIVOS =============
async function cargarNodosActivos() {
  const cont = document.getElementById("nodos-activos");
  cont.innerHTML = "";

  let activos = [];
  try {
    activos = await fetchJSON(`${API_BASE}/api/activos`);
  } catch (e) {
    console.error("Error /api/activos:", e);
  }

  const activosSet = new Set(activos.map(n => n.toUpperCase()));

  NODOS.forEach(nodo => {
    const activo = activosSet.has(nodo);
    const card = document.createElement("div");
    card.className = "node-card";

    const header = document.createElement("div");
    header.className = "node-header";

    const name = document.createElement("div");
    name.className = "node-name";
    name.textContent = "Nodo " + nodo;

    const badge = document.createElement("span");
    badge.className = "badge " + (activo ? "badge-activo" : "badge-inactivo");
    badge.textContent = activo ? "ACTIVO" : "INACTIVO";

    header.appendChild(name);
    header.appendChild(badge);
    card.appendChild(header);

    const info = document.createElement("div");
    info.className = "node-last";
    info.textContent = activo
      ? "Reportando en los últimos 30 s"
      : "Sin datos recientes";
    card.appendChild(info);

    cont.appendChild(card);
  });
}

// ============ ÚLTIMA LECTURA POR NODO ============
async function cargarUltimos() {
  const cont = document.getElementById("ultimos");
  cont.innerHTML = "";

  for (const nodo of NODOS) {
    const card = document.createElement("div");
    card.className = "node-card";

    const header = document.createElement("div");
    header.className = "node-header";

    const name = document.createElement("div");
    name.className = "node-name";
    name.textContent = "Nodo " + nodo;

    header.appendChild(name);
    card.appendChild(header);

    const valueDiv = document.createElement("div");
    valueDiv.className = "node-value";

    const timeDiv = document.createElement("div");
    timeDiv.className = "node-last";

    try {
      const dato = await fetchJSON(`${API_BASE}/api/ultimo/${nodo}`);
      valueDiv.textContent = `${dato.clave}: ${dato.valor}`;
      timeDiv.textContent = "Último envío: " + formatearFecha(dato.timestamp);
    } catch (e) {
      valueDiv.textContent = "Sin datos";
      timeDiv.textContent = "";
    }

    card.appendChild(valueDiv);
    card.appendChild(timeDiv);
    cont.appendChild(card);
  }
}

// ============ TABLA DATOS ============
async function cargarTablaDatos() {
  const tbody = document.getElementById("tabla-datos");
  tbody.innerHTML = "";

  let datos = [];
  try {
    datos = await fetchJSON(`${API_BASE}/api/datos`);
  } catch (e) {
    console.error("Error /api/datos:", e);
    return;
  }

  // Tomamos solo los últimos 50 (ya vienen ordenados DESC por id)
  const ultimos = datos.slice(0, 50);

  ultimos.forEach(row => {
    const tr = document.createElement("tr");

    const tdId = document.createElement("td");
    tdId.textContent = row.id;

    const tdNodo = document.createElement("td");
    tdNodo.textContent = row.nodo;

    const tdClave = document.createElement("td");
    tdClave.textContent = row.clave;

    const tdValor = document.createElement("td");
    tdValor.textContent = row.valor;

    const tdFecha = document.createElement("td");
    tdFecha.textContent = formatearFecha(row.timestamp);

    tr.appendChild(tdId);
    tr.appendChild(tdNodo);
    tr.appendChild(tdClave);
    tr.appendChild(tdValor);
    tr.appendChild(tdFecha);

    tbody.appendChild(tr);
  });
}

// ============ CICLO DE REFRESCO ============
async function refrescarTodo() {
  await Promise.all([
    cargarNodosActivos(),
    cargarUltimos(),
    cargarTablaDatos()
  ]);
  setEstadoActualizacion();
}

document.addEventListener("DOMContentLoaded", () => {
  refrescarTodo();
  // refrescar cada 5 segundos
  setInterval(refrescarTodo, 5000);
});
