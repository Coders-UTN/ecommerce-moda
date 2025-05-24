const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const cors = require('cors'); 
const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, '../public')));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

let pool;
async function conectarDB() {
  try {
    pool = mysql.createPool({
      host: 'db',
      user: 'root',
      password: 'root',
      database: 'ecommerce_db'
    }).promise();
    console.log('✅ Conectado a MySQL');

  } catch (error) {
    console.log('Error al conectar a la base de datos:', error);
    process.exit(1);
  }
}
conectarDB();


app.get('/productos', async (req, res) => { // <-- La función de ruta debe ser 'async'
  try {
    const [rows, fields] = await pool.query('SELECT * FROM producto'); // <-- Usar 'await'
    res.json(rows); // 'rows' contendrá los resultados
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).send('Error al obtener productos');
  }
});

// Haz lo mismo para app.get('/categorias')
app.get('/categorias', async (req, res) => {
    try {
        const [rows, fields] = await pool.query('SELECT * FROM categoria');
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener categorías:', err);
        res.status(500).send('Error al obtener categorías');
    }
});

// Y para app.get('/productos/:slug')
app.get('/productos/:slug', async (req, res) => {
    const slug = req.params.slug;
    try {
        const [rows, fields] = await pool.query('SELECT * FROM producto WHERE slug = ?', [slug]);
        if (rows.length === 0) return res.status(404).send("Producto no encontrado");
        res.json(rows[0]);
    } catch (err) {
        console.error('Error al buscar el producto:', err);
        res.status(500).send("Error al buscar el producto");
    }
});

// Y para app.get('/usuarios')
app.get('/usuarios', async (req, res) => { // <-- Cambiado a async
    try {
        const [rows, fields] = await pool.query('SELECT * FROM usuario'); // <-- Usar 'await'
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener usuarios:', err); // <-- Es bueno loguear el error
        res.status(500).send('Error al obtener usuarios');
    }
});

app.post('/ventas', async (req, res) => { // <-- La función de ruta debe ser 'async'
    const { carrito, total } = req.body;
    if (!Array.isArray(carrito) || carrito.length === 0) {
        return res.status(400).send("Carrito vacio");
    }

    try {
        const fecha = new Date();
        const [compraResult] = await pool.query('INSERT INTO compra (id_cliente, fecha, total) VALUES (?, ?, ?)', [1, fecha, total]);

        const id_venta = compraResult.insertId;
        const detalles = carrito.map(p => [id_venta, p.id_producto, p.cantidad, p.precio]);

        // Asegúrate de que los ? se manejen correctamente con `VALUES ?` para arrays de arrays
        // mysql2 suele requerir el array anidado directamente aquí si es para VALUES ?
        await pool.query('INSERT INTO detalle_compra(id_compra, id_producto, cantidad, precio_unitario) VALUES ?', [detalles]);

        res.status(201).send("Venta registrada con exito");

    } catch (err) {
        console.error('Error en el registro de la venta:', err);
        res.status(500).send("Error al registrar la venta");
    }
});


app.post('/usuarios', async (req, res) => { // <-- La función de ruta debe ser 'async'
    const { usuario, password, apellido, nombre, dni, direccion, email, telefono } = req.body;

    if (!usuario || !password || !apellido || !nombre || !dni || !email || !direccion) {
        return res.status(400).send('Faltan datos obligatorios');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // <-- Usar 'await' con bcrypt.hash

        const [clienteResult] = await pool.query(
            'INSERT INTO cliente(dni, apellido, nombre, direccion, email, telefono) VALUES (?, ?, ?, ?, ?, ?)',
            [dni, apellido, nombre, direccion, email, telefono]
        );
        const id_cliente = clienteResult.insertId;

        await pool.query(
            'INSERT INTO usuario(id_cliente, username, hashpass) VALUES (?, ?, ?)',
            [id_cliente, usuario, hashedPassword]
        );

        res.status(201).send("Usuario y cliente registrados con éxito");

    } catch (err) {
        console.error('Error al registrar usuario/cliente:', err);
        if (err.code === 'ER_DUP_ENTRY') {
             return res.status(409).send("El DNI o nombre de usuario ya existen.");
        }
        res.status(500).send("Error al registrar el usuario. Intente de nuevo.");
    }
});

app.post('/login', async (req, res) => {
    const { usuario, password } = req.body;

    try {
        const [rows] = await pool.query(
            'SELECT * FROM usuario WHERE username = ?',
            [usuario]
        );

        if (rows.length === 0) {
            return res.status(401).json({mensaje: "Usuario o contraseña incorrectos"});
        }

        const usuarioBD = rows[0];
        const contraseñaCorrecta = await bcrypt.compare(password, usuarioBD.hashpass);

        if (!contraseñaCorrecta) {
            return res.status(401).json({error: "Usuario o contraseña incorrectos"});
        }

        // Si querés guardar algo como sesión o token, hacelo acá

        res.status(200).json({mensaje:"Login exitoso"});
    } catch (err) {
        console.error('Error al hacer login:', err);
        res.status(500).json({error: "Error al ingresar. Intente de nuevo."});
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
