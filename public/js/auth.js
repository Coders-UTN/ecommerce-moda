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
    const email = e.target[0].value;
    const password = e.target[1].value;
    
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`Bienvenido ${data.user.nombre}`);
        localStorage.setItem('user', JSON.stringify(data.user));
        updateAuthUI(data.user);
      } else {
        alert(data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    }
  });
  
  // Manejar registro
  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const dni = e.target[0].value;
    const nombre = e.target[1].value;
    const apellido = e.target[2].value;
    const email = e.target[3].value;
    const password = e.target[4].value;
    
    try {
      const response = await fetch('/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni, nombre, apellido, email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Registro exitoso. Por favor inicia sesión.');
        document.getElementById('auth-form').style.display = 'block';
        document.getElementById('register-form').style.display = 'none';
        registerForm.reset();
      } else {
        alert(data.error || 'Error al registrarse');
      }
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