const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
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

  // Registro con validaciones y bcrypt
  app.post('/registro', async (req, res) => {
    try {
      const { dni, nombre, apellido, email, password } = req.body;

      // Validaciones básicas
      if (!/^\d{7,}$/.test(dni)) {
        return res.status(400).json({ error: 'DNI inválido. Debe tener al menos 7 dígitos numéricos.' });
      }
      if (!email.includes('@')) {
        return res.status(400).json({ error: 'Email inválido.' });
      }
      if (!password || password.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
      }

      // Hashear la contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insertar cliente
      connection.query(
        'INSERT INTO cliente (dni, nombre, apellido, email) VALUES (?, ?, ?, ?)',
        [dni, nombre, apellido, email],
        (err, results) => {
          if (err) {
            console.error('Error al registrar cliente:', err);
            return res.status(500).json({ error: 'Error al registrar cliente' });
          }

          const idCliente = results.insertId;

          // Insertar usuario con password hasheada
          connection.query(
            'INSERT INTO usuario (id_cliente, username, hashpass) VALUES (?, ?, ?)',
            [idCliente, email, hashedPassword],
            (err) => {
              if (err) {
                console.error('Error al crear usuario:', err);
                return res.status(500).json({ error: 'Error al crear usuario' });
              }
              res.json({ success: true });
            }
          );
        }
      );
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  // Login con comparación bcrypt
  app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios.' });
    }

    connection.query(
      `SELECT u.hashpass, c.* FROM usuario u
       JOIN cliente c ON u.id_cliente = c.id_cliente
       WHERE u.username = ?`,
      [email],
      async (err, results) => {
        if (err) {
          console.error('Error en login:', err);
          return res.status(500).json({ error: 'Error en la autenticación' });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.hashpass);

        if (!passwordMatch) {
          return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Quitar hashpass antes de enviar la info al frontend
        delete user.hashpass;

        res.json({ success: true, user });
      }
    );
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

conectarDB();
