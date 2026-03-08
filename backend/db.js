// Import the SQLite3 driver and the SQLite wrapper for cleaner async/await syntax
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
// Opens a connection to the database file and creates all tables if they don't exist yet
async function initDB() {
  // Open (or create) the database file on disk
  const db = await open({
    filename: "./lostandfound.db",
    driver: sqlite3.Database
  });
  // Table to store lost items submitted by users
  // Status defaults to 'pending' until an admin approves it
  await db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      location TEXT,
      photo TEXT,
      status TEXT DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  // Table for admin accounts — kept separate from regular users for security
  await db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    );
  `);
  // Table for regular user accounts
  // Email must be unique so the same address can't register twice
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      password TEXT NOT NULL
    );
  `);
  return db;
}

module.exports = initDB;

