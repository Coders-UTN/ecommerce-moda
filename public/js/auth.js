document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const showRegister = document.getElementById('show-register');
  const showLogin = document.getElementById('show-login');

  // Alternar entre formularios
  showRegister?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('auth-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
  });

  showLogin?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('auth-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
  });

  // Manejar login
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target[0].value.trim();
    const password = e.target[1].value.trim();

    if (!email.includes('@')) {
      return alert('Email inválido');
    }
    if (password.length < 6) {
      return alert('La contraseña debe tener al menos 6 caracteres');
    }

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return alert(data.error || 'Error al iniciar sesión');
      }

      alert(`Bienvenido ${data.user.nombre}`);
      localStorage.setItem('user', JSON.stringify(data.user));
      updateAuthUI(data.user);

    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    }
  });

  // Manejar registro
  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const dni = e.target[0].value.trim();
    const nombre = e.target[1].value.trim();
    const apellido = e.target[2].value.trim();
    const email = e.target[3].value.trim();
    const password = e.target[4].value.trim();

    if (!/^\d{7,}$/.test(dni)) {
      return alert('DNI inválido. Debe contener al menos 7 dígitos numéricos.');
    }
    if (!email.includes('@')) {
      return alert('Email inválido.');
    }
    if (password.length < 6) {
      return alert('La contraseña debe tener al menos 6 caracteres.');
    }

    try {
      const response = await fetch('/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni, nombre, apellido, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return alert(data.error || 'Error al registrarse');
      }

      alert('Registro exitoso. Por favor inicia sesión.');
      document.getElementById('auth-form').style.display = 'block';
      document.getElementById('register-form').style.display = 'none';
      registerForm.reset();

    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    }
  });

  // Verificar si ya está logueado al cargar
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) updateAuthUI(user);
});

function updateAuthUI(user) {
  const authSection = document.querySelector('.auth-section');
  if (!authSection) return;

  authSection.innerHTML = `
    <div class="user-info">
      <p>Bienvenido, <strong>${user.nombre}</strong></p>
      <button id="logout-btn" class="boton-menu">Cerrar Sesión</button>
    </div>
  `;

  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('user');
    location.reload();
  });
}
