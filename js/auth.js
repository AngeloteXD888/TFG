// ---- CONFETTI ----
(function spawnConfetti() {
  const container = document.getElementById('confetti-container');
  if (!container) return;
  const colors = ['#7c3aed', '#a855f7', '#f59e0b', '#fcd34d', '#ef4444', '#10b981', '#3b82f6'];
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${-Math.random() * 20}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      transform: rotate(${Math.random() * 360}deg);
      animation-duration: ${5 + Math.random() * 8}s;
      animation-delay: ${Math.random() * 8}s;
      opacity: 0;
    `;
    container.appendChild(piece);
  }
})();

// ---- TABS ----
function switchTab(tab) {
  const loginForm = document.getElementById('form-login');
  const registerForm = document.getElementById('form-register');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const indicator = document.getElementById('tab-indicator');

  if (tab === 'login') {
    loginForm.classList.remove('auth-form--hidden');
    registerForm.classList.add('auth-form--hidden');
    tabLogin.classList.add('tab--active');
    tabRegister.classList.remove('tab--active');
    indicator.classList.remove('right');
  } else {
    registerForm.classList.remove('auth-form--hidden');
    loginForm.classList.add('auth-form--hidden');
    tabRegister.classList.add('tab--active');
    tabLogin.classList.remove('tab--active');
    indicator.classList.add('right');
  }
  // Forzar re-animación
  loginForm.style.animation = 'none';
  registerForm.style.animation = 'none';
  requestAnimationFrame(() => {
    loginForm.style.animation = '';
    registerForm.style.animation = '';
  });
}

// ---- TOGGLE CONTRASEÑA ----
function togglePass(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isText = input.type === 'text';
  input.type = isText ? 'password' : 'text';
  btn.textContent = isText ? '👁️' : '🙈';
}

// ---- FUERZA CONTRASEÑA ----
document.getElementById('reg-password')?.addEventListener('input', function () {
  const val = this.value;
  const fill = document.getElementById('strength-fill');
  const label = document.getElementById('strength-label');
  if (!fill || !label) return;

  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const levels = [
    { pct: '0%', color: 'transparent', text: '' },
    { pct: '25%', color: '#ef4444', text: 'Débil' },
    { pct: '50%', color: '#f59e0b', text: 'Regular' },
    { pct: '75%', color: '#3b82f6', text: 'Buena' },
    { pct: '100%', color: '#10b981', text: 'Fuerte' },
  ];

  const lvl = val.length === 0 ? levels[0] : levels[score] || levels[1];
  fill.style.width = lvl.pct;
  fill.style.background = lvl.color;
  label.textContent = lvl.text;
  label.style.color = lvl.color;
});

// ---- VALIDACIÓN ---- 
function setError(inputId, errId, msg) {
  const input = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (input) input.classList.add('input-error');
  if (err) err.textContent = msg;
  return false;
}

function clearError(inputId, errId) {
  const input = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (input) { input.classList.remove('input-error'); input.classList.add('input-ok'); }
  if (err) err.textContent = '';
}

function clearAllErrors(ids) {
  ids.forEach(([inputId, errId]) => {
    const input = document.getElementById(inputId);
    const err = document.getElementById(errId);
    if (input) { input.classList.remove('input-error', 'input-ok'); }
    if (err) err.textContent = '';
  });
}

// ---- El rol de admin se determina desde la tabla 'persona' en Supabase ----

// ---- LOGIN ----
async function handleLogin(e) {
  e.preventDefault();
  clearAllErrors([
    ['login-email', 'login-email-err'],
    ['login-password', 'login-password-err'],
  ]);

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  let valid = true;
  if (!email) {
    setError('login-email', 'login-email-err', 'El correo es obligatorio.');
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError('login-email', 'login-email-err', 'Introduce un correo válido.');
    valid = false;
  } else {
    clearError('login-email', 'login-email-err');
  }

  if (!password) {
    setError('login-password', 'login-password-err', 'La contraseña es obligatoria.');
    valid = false;
  } else {
    clearError('login-password', 'login-password-err');
  }

  if (!valid) return;

  setLoading('btn-login', 'spinner-login', true);

  // Autenticación real con Supabase
  const { user, perfil, error } = await supabaseSignIn(email, password);

  setLoading('btn-login', 'spinner-login', false);

  if (error) {
    setError('login-password', 'login-password-err', error);
    return;
  }

  // Guardar datos de sesión en localStorage para acceso rápido en la app
  const isAdmin = perfil && perfil.rol === 'admin';
  const userData = {
    id: user.id,
    name: perfil ? perfil.nombre : email.split('@')[0],
    email: user.email,
    role: isAdmin ? 'admin' : 'user'
  };
  localStorage.setItem('cbdj-user', JSON.stringify(userData));

  if (isAdmin) {
    showToast('¡Bienvenido, Administrador! 🛡️');
  } else {
    showToast('¡Bienvenido de vuelta al Carnaval! 🎉');
  }
  setTimeout(() => { window.location.href = 'app.html'; }, 1000);
}

// ---- REGISTRO ----
async function handleRegister(e) {
  e.preventDefault();
  clearAllErrors([
    ['reg-name', 'reg-name-err'],
    ['reg-email', 'reg-email-err'],
    ['reg-password', 'reg-password-err'],
    ['reg-confirm', 'reg-confirm-err'],
    ['reg-terms', 'reg-terms-err'],
  ]);

  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm').value;
  const terms = document.getElementById('reg-terms').checked;

  let valid = true;

  if (!name) {
    setError('reg-name', 'reg-name-err', 'El nombre es obligatorio.');
    valid = false;
  } else {
    clearError('reg-name', 'reg-name-err');
  }

  if (!email) {
    setError('reg-email', 'reg-email-err', 'El correo es obligatorio.');
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError('reg-email', 'reg-email-err', 'Introduce un correo válido.');
    valid = false;
  } else {
    clearError('reg-email', 'reg-email-err');
  }

  if (!password) {
    setError('reg-password', 'reg-password-err', 'La contraseña es obligatoria.');
    valid = false;
  } else if (password.length < 8) {
    setError('reg-password', 'reg-password-err', 'Mínimo 8 caracteres.');
    valid = false;
  } else {
    clearError('reg-password', 'reg-password-err');
  }

  if (!confirm) {
    setError('reg-confirm', 'reg-confirm-err', 'Confirma tu contraseña.');
    valid = false;
  } else if (confirm !== password) {
    setError('reg-confirm', 'reg-confirm-err', 'Las contraseñas no coinciden.');
    valid = false;
  } else {
    clearError('reg-confirm', 'reg-confirm-err');
  }

  if (!terms) {
    const err = document.getElementById('reg-terms-err');
    if (err) err.textContent = 'Debes aceptar los términos para continuar.';
    valid = false;
  }

  if (!valid) return;

  setLoading('btn-register', 'spinner-register', true);

  // Registro real con Supabase
  const { user, error } = await supabaseSignUp(name, email, password);

  setLoading('btn-register', 'spinner-register', false);

  if (error) {
    setError('reg-email', 'reg-email-err', error);
    return;
  }

  // Guardar sesión activa en localStorage
  const userData = {
    id: user.id,
    name: name,
    email: email,
    role: 'user'
  };
  localStorage.setItem('cbdj-user', JSON.stringify(userData));

  showToast('¡Cuenta creada! Bienvenido al Carnaval 🎊');
  setTimeout(() => { window.location.href = 'app.html'; }, 1000);
}

// ---- GOOGLE OAuth ----
async function handleGoogle() {
  const { error } = await supabaseSignInWithGoogle();
  if (error) {
    showToast('Error al conectar con Google: ' + error);
  }
}

// ---- HELPERS ----
function setLoading(btnId, spinnerId, loading) {
  const btn = document.getElementById(btnId);
  const spinner = document.getElementById(spinnerId);
  const icon = btn?.querySelector('.btn-icon');
  if (!btn) return;
  if (loading) {
    btn.disabled = true;
    if (icon) icon.style.display = 'none';
    if (spinner) spinner.classList.add('visible');
  } else {
    btn.disabled = false;
    if (icon) icon.style.display = '';
    if (spinner) spinner.classList.remove('visible');
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  if (!toast) return;
  toastMsg.textContent = msg;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 3500);
}
