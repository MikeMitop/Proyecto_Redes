import express from "express";
import cors from "cors";
import { initDB, openDB } from "./database.js";

const app = express();
app.use(cors());
app.use(express.json());

// Inicializar BD
await initDB();

// === 1) Recibir datos del gateway ===
app.post("/api/recibir", async (req, res) => {
  const { nodo, clave, valor, timestamp } = req.body;

  if (!nodo || !clave || !valor || !timestamp) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  const db = await openDB();
  await db.run(
    "INSERT INTO datos (nodo, clave, valor, timestamp) VALUES (?, ?, ?, ?)",
    [nodo, clave, valor, timestamp]
  );

  console.log(`[OK] ${nodo} → ${clave}:${valor}`);
  res.json({ success: true });
});

// === 2) Obtener todos los datos ===
app.get("/api/datos", async (req, res) => {
  const db = await openDB();
  const rows = await db.all("SELECT * FROM datos ORDER BY id DESC");
  res.json(rows);
});

// === 3) Nodos activos (últimos 30s) ===
app.get("/api/activos", async (req, res) => {
  const db = await openDB();
  const now = Math.floor(Date.now() / 1000);

  const rows = await db.all(
    "SELECT DISTINCT nodo FROM datos WHERE timestamp > ?",
    [now - 30]
  );

  res.json(rows.map(r => r.nodo));
});

// === 4) Última lectura de un nodo ===
app.get("/api/ultimo/:nodo", async (req, res) => {
  const nodo = req.params.nodo.toUpperCase();
  const db = await openDB();

  const row = await db.get(
    "SELECT * FROM datos WHERE nodo = ? ORDER BY id DESC LIMIT 1",
    [nodo]
  );

  if (!row) {
    return res.status(404).json({ error: "Nodo no encontrado" });
  }

  res.json(row);
});

// === Puerto ===
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend escuchando en puerto ${PORT}`);
});
