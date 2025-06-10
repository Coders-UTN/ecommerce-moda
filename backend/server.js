const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const app = express();

const CLAVE_SEGURA = 'mi_clave_secreta_segura'

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json()); // Para parsear JSON


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

app.post('/ventas', authenticateToken, async (req, res) => { // <-- La función de ruta debe ser 'async'
    const { carrito, total , id_cliente} = req.body;
    if (!Array.isArray(carrito) || carrito.length === 0) {
        return res.status(400).send("Carrito vacio");
    }

    try {
        const fecha = new Date();
        const [compraResult] = await pool.query('INSERT INTO compra (id_cliente, fecha, total) VALUES (?, ?, ?)', [id_cliente, fecha, total]);

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

    // Validación inicial: Asegurarse de que los datos no estén vacíos
    if (!usuario || !password) {
        return res.status(400).json({ error: "Falta nombre de usuario o contraseña." });
    }

    try {
        const [rows] = await pool.query(
            // Asegúrate de seleccionar id_cliente si lo necesitas para el JWT
            'SELECT id_usuario, id_cliente, username, hashpass FROM usuario WHERE username = ?',
            [usuario]
        );

        if (rows.length === 0) {
            // Usuario no encontrado
            return res.status(401).json({ error: "Usuario o contraseña incorrectos" }); // Mensaje genérico
        }

        const usuarioBD = rows[0];
        // 2. Comparar la contraseña proporcionada con la contraseña hasheada
        const contraseniaCorrecta = await bcrypt.compare(password, usuarioBD.hashpass);

        if (contraseniaCorrecta) {
            // Contraseña coincide: Inicio de sesión exitoso
            const token = jwt.sign(
                { id_usuario: usuarioBD.id_usuario, id_cliente: usuarioBD.id_cliente, username: usuarioBD.username },
                CLAVE_SEGURA,
                { expiresIn: '1h' }
            );
            // Envía la respuesta exitosa con el token y el id_cliente
            res.status(200).json({ message: 'Inicio de sesión exitoso.', token: token, id_cliente: usuarioBD.id_cliente, username: usuarioBD.username });
        } else {
            // Contraseña no coincide
            return res.status(401).json({ error: "Usuario o contraseña incorrectos" }); // Mensaje genérico
        }

    } catch (err) {
        console.error('Error al hacer login:', err);
        res.status(500).json({ error: "Error al ingresar. Intente de nuevo." });
    }
});

function authenticateToken(req, res, next) {
    // El token se envía típicamente en la cabecera 'Authorization' como 'Bearer <token>'
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Obtiene el token después de 'Bearer '

    if (token == null) {
        return res.status(401).send('Acceso denegado. No se proporcionó token.');
    }

    jwt.verify(token, CLAVE_SEGURA, (err, user) => {
        if (err) {
            // Token inválido o expirado
            return res.status(403).send('Token inválido o expirado.');
        }
        req.user = user; // Guarda los datos del usuario (id_usuario, id_cliente, username) en el objeto req
        next(); // Continúa con la siguiente función de middleware o la ruta
    });
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
