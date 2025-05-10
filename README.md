# CoderShop - Proyecto Ecommerce con Docker

Este proyecto es una tienda en línea construida con Node.js (Express), MySQL y Docker. Aquí podrás gestionar productos, categorías y un carrito de compras.

## Requisitos

Para ejecutar este proyecto, asegúrate de tener las siguientes herramientas instaladas:

* [Docker](https://www.docker.com/products/docker-desktop) (incluye Docker Compose)
* [Node.js](https://nodejs.org/) (para desarrollo local, si deseas ejecutar sin Docker)

## Instrucciones de uso

### 1. Clonar el repositorio

Clona este repositorio en tu máquina local:

```bash
git clone https://github.com/Coders-UTN/ecommerce-moda.git
cd ecommerce-moda

```

### 2. Crear y levantar los contenedores con Docker

Para crear los contenedores y levantar el proyecto en Docker, ejecuta:

```bash
docker compose build
docker compose up
```

Esto descargará las imágenes necesarias, creará los contenedores y levantará el servidor.

Atencion: Usualmente falla la conexion a la base de datos al levantar el contenedor la primera vez,
para esto detener el contenedor 
 control+c o docker compose stop y 
 ```bash
 Control+C
 o
 docker compose stop
```
 Volver a ejecutar
```bash
docker compose up
```

### 3. Acceder al proyecto

* La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).
* Puedes ver y administrar la base de datos usando [phpMyAdmin](http://localhost:8080). Las credenciales por defecto son:

  * Usuario: `root`
  * Contraseña: `root`
  * Base de datos: `ecommerce_db`

### 4. Desarrollo en tiempo real

Durante el desarrollo, los archivos de tu proyecto estarán montados dentro del contenedor. Esto significa que cualquier cambio que realices en tu máquina local se reflejará de inmediato en el contenedor.

### 5. Detener los contenedores

Cuando hayas terminado, puedes detener los contenedores con el siguiente comando:

```bash
docker-compose down
```

Si solo deseas detener los contenedores sin eliminar las imágenes o volúmenes, puedes usar:

```bash
docker-compose stop
```

### 6. Limpiar volúmenes (opcional)

Si deseas eliminar todos los volúmenes asociados a los contenedores, ejecuta:

```bash
docker-compose down -v
```

Esto eliminará tanto los contenedores como los volúmenes persistentes (como la base de datos).

## Estructura del Proyecto

La estructura de carpetas es la siguiente:

```
coderShop/
├── backend/
│   ├── controllers/
│   ├── db/
│   └── server.js
├── public/
│   ├── css/
│   ├── js/
│   ├── index.html
├── Dockerfile
├── docker-compose.yml
└── README.md
```

* **backend/**: Contiene el servidor de Express, la lógica de la base de datos y los controladores.
* **public/**: Archivos estáticos (HTML, CSS, JavaScript) que el servidor sirve a los clientes.
* **Dockerfile**: Define la imagen para el contenedor de la aplicación.
* **docker-compose.yml**: Configura los contenedores de la aplicación y la base de datos.
