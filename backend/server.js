const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json()); // Para parsear JSON

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../public','index.html'));
});

function conectarDB(reintentos = 5) {
  const connection = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'ecommerce_db'
  });

  const intentar = () => {
    connection.connect((err) => {
      if (err) {
        console.error('❌ Error al conectar:', err.code);
        if (reintentos > 0) {
          console.log(`🔁 Reintentando en 3s... (${reintentos} restantes)`);
          setTimeout(intentar, 3000);
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
  // Rutas existentes
  app.get('/productos', (req, res) => {
    connection.query('SELECT * FROM producto', (err, results) => {
      if (err) return res.status(500).send('Error al obtener productos');
      res.json(results);
    });
  });

  app.get('/categorias', (req, res) => {
    connection.query('SELECT * FROM categoria', (err, results) => {
      if (err) return res.status(500).send('Error al obtener categorías');
      res.json(results);
    });
  });

  // Nuevas rutas para autenticación
  app.post('/registro', (req, res) => {
    const { dni, nombre, apellido, email, password } = req.body;
    
    connection.query(
      'INSERT INTO cliente (dni, nombre, apellido, email) VALUES (?, ?, ?, ?)',
      [dni, nombre, apellido, email],
      (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al registrar cliente' });
        
        const idCliente = results.insertId;
        
        connection.query(
          'INSERT INTO usuario (id_cliente, username, hashpass) VALUES (?, ?, ?)',
          [idCliente, email, password],
          (err) => {
            if (err) return res.status(500).json({ error: 'Error al crear usuario' });
            res.json({ success: true });
          }
        );
      }
    );
  });

  app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    connection.query(
      `SELECT c.* FROM usuario u
       JOIN cliente c ON u.id_cliente = c.id_cliente
       WHERE u.username = ? AND u.hashpass = ?`,
      [email, password],
      (err, results) => {
        if (err || results.length === 0) {
          return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        res.json({ success: true, user: results[0] });
      }
    );
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

conectarDB();