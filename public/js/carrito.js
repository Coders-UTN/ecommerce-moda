// js/carrito.js

let productosEnCarrito = JSON.parse(localStorage.getItem("carrito")) || [];

const carritoVacioMsg     = document.querySelector(".carrito-vacio");
const contenedorProductos = document.querySelector(".carrito-productos");
const accionesCarrito     = document.querySelector(".carrito-acciones");
const btnVaciar           = document.querySelector(".carrito-acciones-vaciar");
const totalDisplay        = document.getElementById("total");
const totalProductos = document.getElementById("total-productos");

function actualizarTotal() {
  const total = productosEnCarrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  const totalCantidad = productosEnCarrito.reduce((sum, p) => sum + p.cantidad, 0);
  totalProductos.textContent = totalCantidad;
  totalDisplay.textContent = `$${total}`;
  return total;

}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(productosEnCarrito));
  renderCarrito();
}

function renderCarrito() {
  if (productosEnCarrito.length === 0) {
    carritoVacioMsg.classList.remove("disabled");
    contenedorProductos.classList.add("disabled");
    accionesCarrito.classList.add("disabled");
    return;
  }
  carritoVacioMsg.classList.add("disabled");
  contenedorProductos.classList.remove("disabled");
  accionesCarrito.classList.remove("disabled");

  contenedorProductos.innerHTML = "";
  productosEnCarrito.forEach(item => {
    const div = document.createElement("div");
    div.className = "carrito-producto";
    div.innerHTML = `
      <img class="carrito-producto-imagen" src="${item.imagen}" alt="${item.titulo}">
      <div class="carrito-producto-titulo">
        <small>Título</small><h3>${item.titulo}</h3>
      </div>
      <div class="carrito-producto-cantidad">
        <small>Cantidad</small><p>${item.cantidad}</p>
      </div>
      <div class="carrito-producto-precio">
        <small>Precio</small><p>$${item.precio}</p>
      </div>
      <div class="carrito-producto-subtotal">
        <small>Subtotal</small><p>$${item.precio * item.cantidad}</p>
      </div>
      <button class="carrito-producto-eliminar" data-id="${item.slug}">
        <i class="bi bi-trash-fill"></i>
      </button>
    `;
    contenedorProductos.append(div);
  });

document.querySelectorAll(".carrito-producto-eliminar").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.currentTarget.dataset.id;
      const producto = productosEnCarrito.find(p => p.slug === id);

      if (producto) {
        if (producto.cantidad > 1) {
          producto.cantidad--;
        } else {
          productosEnCarrito = productosEnCarrito.filter(p => p.slug !== id);
        }

        guardarCarrito();
        renderCarrito(); // importante: volver a renderizar para actualizar vista
      }
    });
  });

  actualizarTotal();
}


function registrarCompra() {
  const total = actualizarTotal();
  const carrito = JSON.parse(localStorage.getItem("carrito"))
  console.log(JSON.stringify({carrito, total}))
  fetch('/ventas', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({carrito, total})
  })
  .then(res => res.text())
  .then(msg => {
    alert(msg);
    localStorage.removeItem('carrito');
    alert("Compra registrada")
    window.location.href = '/'
  })
  .catch(err => alert("Error al realizar la compra"))
}

btnVaciar.addEventListener("click", () => {
  productosEnCarrito = [];
  guardarCarrito();
});

/*
btnComprar.addEventListener("click", () => {
  alert("¡Gracias por tu compra!");
  productosEnCarrito = [];
  guardarCarrito();
});
*/

document.addEventListener("DOMContentLoaded", renderCarrito);
actualizarTotal();

function procesarCompra() {
  
}