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
      alert(data.mensaje || "Inicio de sesión exitoso");
      // Guardar token o redirigir
      // localStorage.setItem('token', data.token);
      window.location.href = '/';
    } else {
      alert(data.error || "Credenciales incorrectas");
    }
  } catch (error) {
    alert("Error al iniciar sesión");
    console.error(error);
  }
});
