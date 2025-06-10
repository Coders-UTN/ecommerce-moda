USE ecommerce_db;

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categoria (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE NOT NULL
);

-- Tabla de productos
CREATE TABLE producto (
  id_producto INTEGER PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(100),
  titulo VARCHAR(100) NOT NULL,
  imagen VARCHAR(255) NOT NULL,
  precio INT NOT NULL,
  descripcion TEXT,
  id_categoria INT,
  stock INTEGER,
  FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);
-- Tabla de clientes
CREATE TABLE cliente (
  id_cliente INTEGER PRIMARY KEY AUTO_INCREMENT,
  dni VARCHAR(50) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  direccion VARCHAR(255),
  email VARCHAR(255),
  telefono VARCHAR(255)
);

CREATE TABLE compra (
  id_compra INTEGER PRIMARY KEY AUTO_INCREMENT,
  id_cliente INTEGER,
  fecha DATETIME,
  total INTEGER,
  FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE detalle_compra (
  id_compra INTEGER,
  id_producto INTEGER,
  cantidad INTEGER,
  precio_unitario DECIMAL,
  FOREIGN KEY (id_compra) REFERENCES compra(id_compra),
  FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
  PRIMARY KEY (id_compra, id_producto)
);

CREATE TABLE usuario (
  id_usuario INTEGER PRIMARY key AUTO_INCREMENT,
  id_cliente INTEGER,
  username VARCHAR(255),
  hashpass VARCHAR(255),
  FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

-- Insertar categorías
INSERT INTO categoria (nombre) VALUES 
  ('Buzos'),
  ('Camperas'),
  ('Pantalones'),
  ('Remeras');

-- Insertar productos
INSERT INTO producto (slug, titulo, imagen, precio, descripcion, id_categoria) VALUES
-- Abrigos
('buzo-01', 'Buzo negro con tigre', '/img/buzos/buzo01.jpg', 5000, 'Buzo comodo con estampado de tigre.', 1),
('campera-01', 'Campera azul Adidas', '/img/camperas/campera01.jpg', 10000, 'Campera deportiva con diseno clasico Adidas.', 2),
('buzo-02', 'Buzo negro Adidas', '/img/buzos/buzo02.jpg', 10000, 'Buzo negro con logo Adidas.', 1),
('buzo-03', 'Buzo blanco New York City', '/img/buzos/buzo03.jpg', 8000, 'Buzo blanco con diseno urbano.', 1),

-- Pantalones
('pantalon-01', 'Pantalón negro', '/img/pantalones/pantalon01.jpg', 12000, 'Pantalon clasico color negro.', 3),
('pantalon-02', 'Pantalón de Jean', '/img/pantalones/pantalon02.jpg', 8000, 'Jean azul oscuro de corte recto.', 3),
('pantalon-03', 'Pantalón gabardina mostaza', '/img/pantalones/pantalon03.jpg', 5000, 'Pantalon comodo de gabardina en color mostaza.', 3),
('pantalon-04', 'Pantalón de jean rotos', '/img/pantalones/pantalon04.jpg', 8000, 'Jean azul con estilo desgastado y roturas.', 3),
('pantalon-05', 'Pantalón de vestir gris', '/img/pantalones/pantalon05.jpg', 8000, 'Pantalon formal gris para vestir.', 3),

-- Remeras
('remera-01', 'Remera Vue', '/img/remeras/remera01.jpg', 12000, 'Remera con logo de Vue.js.', 4),
('remera-02', 'Remera Angular', '/img/remeras/remera02.jpg', 12000, 'Remera roja con logo de Angular.', 4),
('remera-03', 'Remera React', '/img/remeras/remera03.jpg', 12000, 'Remera con diseño de React.', 4),
('remera-04', 'Remera Redux', '/img/remeras/remera04.jpg', 12000, 'Remera con logo de Redux.', 4),
('remera-05', 'Remera Node', '/img/remeras/remera05.jpg', 12000, 'Remera verde con logo de Node.js.', 4),
('remera-06', 'Remera Sass', '/img/remeras/remera06.jpg', 12000, 'Remera con logo rosa de Sass.', 4),
('remera-07', 'Remera HTML', '/img/remeras/remera07.jpg', 12000, 'Remera con logo HTML5.', 4),
('remera-08', 'Remera GitHub', '/img/remeras/remera08.jpg', 12000, 'Remera con el logo del gato Octocat.', 4),
('remera-09', 'Remera Bulma', '/img/remeras/remera09.jpg', 12000, 'Remera con el logo de Bulma CSS.', 4),
('remera-10', 'Remera TypeScript', '/img/remeras/remera10.jpg', 12000, 'Remera azul con logo de TypeScript.', 4),
('remera-11', 'Remera Drupla', '/img/remeras/remera11.jpg', 12000, 'Remera con diseno de Drupal.', 4),
('remera-12', 'Remera JavaScript', '/img/remeras/remera12.jpg', 12000, 'Remera con logo JS amarillo.', 4),
('remera-13', 'Remera GraphQL', '/img/remeras/remera13.jpg', 12000, 'Remera rosa con simbolo de GraphQL.', 4),
('remera-14', 'Remera WordPress', '/img/remeras/remera14.jpg', 12000, 'Remera con diseno de WordPress.', 4);
