const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();

app.use(express.static(path.join(__dirname, '../public')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../public','index.html'));
});


function conectarDB(reintentos = 5) {
  const connection = mysql.createConnection({
    host: 'db',
    user: 'root',
    password:  'root',
    database: 'ecommerce_db'
  });

  const intentar = () => {
    connection.connect((err) => {
      if (err) {
        console.error('❌ Error al conectar:', err.code);
        if (reintentos > 0) {
          console.log(`🔁 Reintentando en 3s... (${reintentos} restantes)`);
          setTimeout( intentar, 3000 );
          reintentos--;
        } else {
          console.error('🚫 No se pudo conectar a la DB.');
          process.exit(1);
        }
      } else {
        console.log('✅ Conectado a MySQL');
        iniciarServidor(connection);
      }
    });
  };

  intentar();
}

function iniciarServidor(connection) {
  app.get('/productos', (req, res) => {
    connection.query('SELECT * FROM productos', (err, results) => {
      if (err) return res.status(500).send('Error al obtener productos');
      res.json(results);
    });
  });

  app.get('/categorias', (req, res) => {
    connection.query('SELECT * FROM categorias', (err, results) => {
      if (err) return res.status(500).send('Error al obtener categorías');
      res.json(results);
    });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

conectarDB();
