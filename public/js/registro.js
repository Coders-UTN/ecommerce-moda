document.getElementById('formRegistroUsuario').addEventListener('submit', function (e) {
  e.preventDefault(); // Evita que recargue la página
  registrarUsuario(); // Tu función de registro
});

async function registrarUsuario() {
    const usuario = document.getElementById('usuario').value
    const password = document.getElementById('password').value
    const apellido = document.getElementById('apellido').value
    const nombre = document.getElementById('nombre').value
    const dni = document.getElementById('dni').value
    const email = document.getElementById('email').value
    const direccion = document.getElementById('direccion').value
    const telefono = document.getElementById('telefono').value || "Sin telefono"

    console.log(usuario, password, apellido, nombre, dni, email, direccion, telefono);
    try {
        const resCheck = await fetch('/usuarios');
        if (!resCheck.ok) { // Si la respuesta HTTP no es exitosa (ej. 4xx, 5xx)
            throw new Error(`Error HTTP al verificar usuarios: ${resCheck.status}`);
        }
        // Primera petición: Verificar si el usuario ya existe
        const usuariosExistentes = await resCheck.json();

        if (usuariosExistentes.some(u => u.username === usuario)) { // Asumo que el campo es 'username'
            alert("El usuario ya existe");
            return; // Detiene la ejecución si el usuario ya existe
        }

        // Segunda petición: Registrar el nuevo usuario
        const resRegister = await fetch('/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, password, apellido, nombre, dni, email, direccion, telefono })
        });

        // Algunas APIs devuelven texto, otras JSON. Ajusta según lo que tu backend envíe.
        const msg = await resRegister.text(); // O .json() si tu backend devuelve JSON
        alert(msg);
        setTimeout(() => {
        window.location.href = '/pages/login.html'; // Redirige a la página principal
      }, 1500);

        // Si el registro fue exitoso y quieres redirigir:
        // window.location.href = '/pages/login.html';

    } catch (err) {
        console.error("Error en la operación:", err); // Para depuración en la consola del navegador
        alert("Error al registrar el usuario");
    }
}

