// js/detalleProducto.js

// Leemos carrito existente
let productosEnCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
let productos; // Declaramos la variable productos

const params     = new URLSearchParams(window.location.search);
const idProducto = params.get("id");
const contenedor = document.getElementById("detalle-producto");

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(productosEnCarrito));
}

function agregarDesdeDetalle() {
  // Asegúrate de que 'producto' esté definido aquí (dentro del scope donde 'productos' ya se cargó)
  const existe = productosEnCarrito.find(p => p.id === producto.id);
  if (existe) existe.cantidad++;
  else productosEnCarrito.push({ ...producto, cantidad: 1 });

  guardarCarrito();
  alert("Producto agregado al carrito");
}

fetch('/productos')
  .then(res => res.json())
  .then(data => {
    productos = data;
    console.log("Productos cargados:", productos);

    const producto = productos.find(p => p.id === idProducto);

    if (producto) {
      contenedor.innerHTML =
       `
      <div class="bg-body-secondary p-4 rounded shadow-sm">
          <h1>${producto.titulo}</h1>
          <img src="${producto.imagen}" class="img-fluid rounded" style="max-width: 300px;">
          <p class="fs-3 text-primary mt-3">Precio: $${producto.precio}</p>
          <button id="detalle-agregar" class="btn btn-primary btn-lg mt-3">
            Agregar al carrito
          </button>
          </div>
        `;
      document.getElementById("detalle-agregar").addEventListener("click", agregarDesdeDetalle);
    } else {
      contenedor.innerHTML = `
        <p class="lead">Producto no encontrado</p>
      `;
    }
  })
  .catch(error => {
    console.error("Error al cargar los productos:", error);
    contenedor.innerHTML = `<p class="lead">Error al cargar los productos</p>`; // Muestra un mensaje de error en la página
  });