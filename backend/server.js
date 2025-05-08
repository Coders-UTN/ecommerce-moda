// server.js
const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql2');


// 1) Servir toda la carpeta como estáticos
app.use(express.static(path.join(__dirname, '../public')));

// 2) Para cualquier ruta que no sea archivo (.html, .css, .js, etc),
//    devolvemos index.html (útil si mañana usás SPA o rutas amigables)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../public','index.html'));
});


// 3) Arrancar en el puerto 3000 o el que definas en env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


// Conexión a la base de datos
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,   // db (nombre del servicio de MySQL en docker-compose)
  user: process.env.MYSQL_USER,   // root
  password: process.env.MYSQL_PASSWORD, // rootpassword
  database: process.env.MYSQL_DATABASE, // ecommerce_db
});

connection.connect((err) => {
  if (err) {
    console.error('Error de conexión: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos MySQL con ID ' + connection.threadId);
});