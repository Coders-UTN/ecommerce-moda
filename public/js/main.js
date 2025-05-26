// Variables globales (si son usadas por múltiples funciones no anidadas)
const contenedorProductos = document.querySelector("#contenedor-productos");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = [];
let productosEnCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
let productos = []; // Mantén esta fuera de DOMContentLoaded si fetchProductos se llama de inmediato


// --- Lógica de Manejo de Sesión y Header ---
document.addEventListener('DOMContentLoaded', () => {
  // Elementos de navegación
  const navLogin = document.getElementById('nav-login'); // Asegúrate que tu HTML tiene este ID
  const navProfile = document.getElementById('nav-profile'); // Asegúrate que tu HTML tiene este ID
  const navCerrarSesion = document.getElementById('nav-cerrar-sesion'); // Asegúrate que tu HTML tiene este ID
  const btnCerrarSesion = document.getElementById('btn-cerrar-sesion'); // Asegúrate que tu HTML tiene este ID (cambiado de btn-cerrar-sesion)

  // Función para verificar el estado de la autenticación y actualizar la UI
  function checkAuthStatus() {
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
      navLogin.classList.add('d-none'); // Ocultar Login
      navProfile.classList.remove('d-none'); // Mostrar Mi Cuenta
      navCerrarSesion.classList.remove('d-none'); // Mostrar Cerrar Sesión
    } else {
      navLogin.classList.remove('d-none'); // Mostrar Login
      navProfile.classList.add('d-none'); // Ocultar Mi Cuenta
      navCerrarSesion.classList.add('d-none'); // Ocultar Cerrar Sesión
    }
  }

  // Lógica para cerrar sesión
  if (btnCerrarSesion) { // Usamos 'btnCerrarSesion' para ser consistentes
    btnCerrarSesion.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('authToken');
      localStorage.removeItem('id_cliente');
      alert('Has cerrado sesión correctamente.'); // Considera reemplazar con un mensaje dinámico
      window.location.reload();
    });
  }

  checkAuthStatus();
  fetchProductos();
  funcionBotonesCategoria();
  actualizarCantidad();
  cargarProductos();
});


// --- Funciones de Carrito (Podrían ser parte de un módulo o permanecer aquí) ---
function actualizarCantidad() {
  const totalProductos = document.getElementById("numerito");
  const totalCantidad = productosEnCarrito.reduce((sum, p) => sum + p.cantidad, 0);
  totalProductos.textContent = totalCantidad;
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(productosEnCarrito));
  actualizarCantidad();
}

function agregarAlCarrito(e) {
  const id = e.currentTarget.id;
  const prod = productos.find((p) => p.slug === id);
  const existente = productosEnCarrito.find((p) => p.slug === id);

  if (existente) existente.cantidad++;
  else productosEnCarrito.push({ ...prod, cantidad: 1 });
  alert("Producto agregado"); // Considera reemplazar con un mensaje dinámico

  guardarCarrito();
}

function actualizacionBotonesAgregar() {
  botonesAgregar = document.querySelectorAll(".producto-agregar");
  botonesAgregar.forEach((btn) =>
    btn.addEventListener("click", agregarAlCarrito)
  );
}


// --- Funciones de Carga y Renderizado de Productos ---
function fetchProductos() {
  fetch("http://localhost:3000/productos") // Usar URL absoluta para mayor claridad
    .then((res) => res.json())
    .then((data) => {
      productos = data;
      cargarProductos(productos);
    })
    .catch(error => console.error("Error al cargar productos:", error)); // Manejo de errores
}

function cargarProductos(lista) {
  if (!contenedorProductos) {
      console.error("El elemento #contenedor-productos no fue encontrado.");
      return;
  }
  contenedorProductos.innerHTML = "";
  lista.forEach((item) => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
    <a href="/pages/producto.html?slug=${item.slug}">  
      <img class="producto-imagen" onerror="this.onerror=null; this.src='../img/404.png';" src="${item.imagen}" alt="${item.titulo}">
      <div class="producto-detalles">
        <h3 class="producto-titulo">${item.titulo}</h3>
        <p class="producto-precio">$${item.precio}</p>
      </a>
        <button class="producto-agregar" id="${item.slug}" ${(item.stock == 0) ? 'disabled' : ""}> ${(item.stock != 0) ? "Agregar" : "Sin Stock"}</button>
      </div>
    `;
    contenedorProductos.append(div);
  });
  actualizacionBotonesAgregar();
}

// --- Función de Filtro por Categoría ---
function funcionBotonesCategoria() {
  const botonesCategoria = document.querySelectorAll(".boton-categoria");
  botonesCategoria.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      botonesCategoria.forEach((b) => b.classList.remove("active"));
      e.currentTarget.classList.add("active");
      const categoriaId = e.currentTarget.id;
      if (categoriaId !== "todos") {
        const fil = productos.filter((p) => {
          return p.id_categoria == categoriaId;
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
