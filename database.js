const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite');

const POSTS_SCHEMA = `
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo VARCHAR(50) NOT NULL,
    conteudo VARCHAR(140)
  )
  `;

const USUARIOS_SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(40) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL
  )
  `;

db.serialize(() => {
  db.run('PRAGMA foreign_keys=ON');
  db.run(POSTS_SCHEMA);
  db.run(USUARIOS_SCHEMA);

  db.each('SELECT * FROM users', (err, usuario) => {
    console.log('Users: ');
    console.log(usuario);
  });
});

process.on('SIGINT', () =>
  db.close(() => {
    process.exit(0);
  })
);

module.exports = db;
