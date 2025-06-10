messageContainer = document.getElementById('messageContainer');
document.getElementById('formLogin').addEventListener('submit', async (e) => {
  e.preventDefault();
  const usuario = document.getElementById('usuario').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, password })
    });

    const data = await res.json();
    if (res.ok) {
      messageContainer.textContent = data.message || "Inicio de sesión exitoso";
      messageContainer.style.color = 'green'; // Estilo para éxito
      messageContainer.classList.add('alert', 'alert-success'); // Opcional: Clases de Bootstrap para éxito

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('id_cliente', data.id_cliente); // Útil para pre-cargar datos

      console.log('Token JWT guardado:', data.token);
      console.log('ID Cliente guardado:', data.id_cliente);
      setTimeout(() => {
        window.location.href = '/'; // Redirige a la página principal
      }, 1500); // Espera 1.5 segundos

    } else {
      amessageContainer.textContent = data.error || data.message || "Credenciales incorrectas"; // Prioriza 'error', luego 'message' del backend
      messageContainer.style.color = 'red'; // Estilo para error
      messageContainer.classList.add('alert', 'alert-danger'); // Opcional: Clases de Bootstrap para error
    }
  } catch (error) {
    messageContainer.textContent = "Error de conexión. Intente de nuevo más tarde.";
    messageContainer.style.color = 'red';
    messageContainer.classList.add('alert', 'alert-danger'); // Opcional: Clases de Bootstrap para error
    console.error("Error al iniciar sesión:", error);
  }
});

