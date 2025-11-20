import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function openDB() {
  return open({
    filename: "./sensors.db",
    driver: sqlite3.Database
  });
}

// Inicializar tabla si no existe
export async function initDB() {
  const db = await openDB();
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS datos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nodo TEXT,
      clave TEXT,
      valor TEXT,
      timestamp INTEGER
    );
  `);

  return db;
}
