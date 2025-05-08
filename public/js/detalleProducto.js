// js/detalleProducto.js

// Leemos carrito existente
let productosEnCarrito = JSON.parse(localStorage.getItem("carrito")) || [];

const params     = new URLSearchParams(window.location.search);
const idProducto = params.get("id");
const producto   = productos.find(p => p.id === idProducto);
const contenedor = document.getElementById("detalle-producto");

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(productosEnCarrito));
}

function agregarDesdeDetalle() {
  const existe = productosEnCarrito.find(p => p.id === producto.id);
  if (existe) existe.cantidad++;
  else productosEnCarrito.push({ ...producto, cantidad: 1 });

  guardarCarrito();
  alert("Producto agregado al carrito");
}

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