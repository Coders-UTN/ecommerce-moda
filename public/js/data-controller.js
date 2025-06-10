//agregar categorias desde base de datos
function cargarCategorias() {
    fetch('/categorias')
    .then(res => res.json())
    .then(data => agregarCategoria(data))
  }
  
  function agregarCategoria(data){
  const listaCategorias = document.getElementById("lista-categorias")
  listaCategorias.innerHTML = "";
  
  encabezado = document.createElement("li")
  encabezado.innerHTML = `<button id="todos" class="boton-menu boton-categoria active">
            <i class="bi bi-hand-index-thumb-fill"></i> Todos los productos
          </button>
  `;
    listaCategorias.appendChild(encabezado)
  
    data.forEach(item => {
    const elemento = document.createElement("li")
    const nombre = item.nombre
    const id = item.id_categoria
    elemento.innerHTML = `
    <button id="${id}" class="boton-menu boton-categoria">
              <i class="bi bi-hand-index-thumb"></i>${nombre}
            </button>
    `;
    listaCategorias.appendChild(elemento)
    
  })
  const carrito = document.createElement("li")
    carrito.innerHTML = `<a class="boton-menu boton-carrito" href="/pages/carrito.html">
    <i class="bi bi-cart-fill"></i> Carrito <span id="numerito">0</span>
  </a>`
  listaCategorias.appendChild(carrito)
    funcionBotonesCategoria();
    actualizarCantidad();
  }
  
  cargarCategorias();
