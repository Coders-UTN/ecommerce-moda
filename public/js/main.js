// js/main.js

const contenedorProductos = document.querySelector("#contenedor-productos");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = [];
let productosEnCarrito = JSON.parse(localStorage.getItem("carrito")) || [];

function actualizarCantidad() {
  const totalProductos = document.getElementById('numerito');
  const totalCantidad = productosEnCarrito.reduce((sum, p) => sum + p.cantidad, 0);
  totalProductos.textContent = totalCantidad;
}


// Guarda en localStorage y actualiza badge
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(productosEnCarrito));
  actualizarCantidad();
}

// Agrega o incrementa
function agregarAlCarrito(e) {
  const id = e.currentTarget.id;
  const prod = productos.find(p => p.id === id);
  const existente = productosEnCarrito.find(p => p.id === id);

  if (existente) existente.cantidad++;
  else productosEnCarrito.push({ ...prod, cantidad: 1 });

  guardarCarrito();
}

// Vuelve a enlazar click en botones "Agregar"
function actualizacionBotonesAgregar() {
  botonesAgregar = document.querySelectorAll(".producto-agregar");
  botonesAgregar.forEach(btn => btn.addEventListener("click", agregarAlCarrito));
}

let productos = [];
// Render de productos
function fetchProductos() {
  fetch('/productos')
    .then(res => res.json())
    .then(data => {
      productos = data;
      cargarProductos(productos);
    })
}

function cargarProductos(lista) {

  contenedorProductos.innerHTML = "";
  lista.forEach(item => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <img class="producto-imagen" src="${item.imagen}" alt="${item.titulo}">
      <div class="producto-detalles">
        <a href="/pages/producto.html?id=${item.id}">
          <h3 class="producto-titulo">${item.titulo}</h3>
        </a>
        <p class="producto-precio">$${item.precio}</p>
        <button class="producto-agregar" id="${item.id}">Agregar</button>
      </div>
    `;
    contenedorProductos.append(div);
  });
  actualizacionBotonesAgregar();
}

// Filtro por categoría
function funcionBotonesCategoria() {
  const botonesCategoria = document.querySelectorAll(".boton-categoria");
  botonesCategoria.forEach(boton => {
    boton.addEventListener("click", e => {
      botonesCategoria.forEach(b => b.classList.remove("active"));
      e.currentTarget.classList.add("active");
      const categoriaId = e.currentTarget.id;
      console.log("ID de categoría clickeado:", categoriaId);
      if (categoriaId !== "todos") {
        const fil = productos.filter(p => {
          console.log("ID de categoría del producto (p.categoria_id):", p.categoria_id); // <-- COLOCA EL console.log AQUÍ
          console.log(p.categoria_id === categoriaId)
          return p.categoria_id == categoriaId;
        });
        tituloPrincipal.innerText = e.currentTarget.innerText || "Productos";
        cargarProductos(fil);
      } else {
        tituloPrincipal.innerText = "Todos los productos";
        cargarProductos(productos);
      }
    });
  });
}


// Al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  fetchProductos();
  funcionBotonesCategoria();
});
