// =====================================================================
// CARNAVAL DE BADAJOZ — Auth JavaScript
// Con login por username y ocultar sidebar en registro
// Author: Ángel Galea Anisa | TFG 2025/2026
// =====================================================================

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

// ---- TABS (modificada para ocultar/mostrar sidebar) ----
function switchTab(tab) {
  const loginForm = document.getElementById('form-login');
  const registerForm = document.getElementById('form-register');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const indicator = document.getElementById('tab-indicator');
  const authMain = document.querySelector('.auth-main');
  const authSide = document.getElementById('auth-side');

  if (tab === 'login') {
    loginForm.classList.remove('auth-form--hidden');
    registerForm.classList.add('auth-form--hidden');
    tabLogin.classList.add('tab--active');
    tabRegister.classList.remove('tab--active');
    indicator.classList.remove('right');
    // Mostrar sidebar (quitar clase)
    if (authMain) authMain.classList.remove('sidebar-hidden');
    if (authSide) authSide.style.display = ''; // Asegurar que se muestre (si no está oculto por media query)
  } else {
    registerForm.classList.remove('auth-form--hidden');
    loginForm.classList.add('auth-form--hidden');
    tabRegister.classList.add('tab--active');
    tabLogin.classList.remove('tab--active');
    indicator.classList.add('right');
    // Ocultar sidebar (añadir clase)
    if (authMain) authMain.classList.add('sidebar-hidden');
    if (authSide) authSide.style.display = 'none'; // Forzamos oculto (por si acaso)
  }
  // Forzar re-animación
  loginForm.style.animation = 'none';
  registerForm.style.animation = 'none';
  requestAnimationFrame(() => {
    loginForm.style.animation = '';
    registerForm.style.animation = '';
  });
}

// Previsualizar avatar en registro
document.getElementById('reg-avatar-input')?.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = document.getElementById('reg-avatar-img');
      const placeholder = document.querySelector('#reg-avatar-preview .avatar-placeholder');
      img.src = event.target.result;
      img.style.display = 'block';
      if (placeholder) placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
});

// ---- TOGGLE CONTRASEÑA ----
function togglePass(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isText = input.type === 'text';
  input.type = isText ? 'password' : 'text';
  const svg = btn.querySelector('svg');
  if (svg) {
    if (isText) {
      svg.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />`;
    } else {
      svg.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />`;
    }
  }
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

// ---- FUNCIÓN PARA RESOLVER EMAIL DESDE USERNAME ----
async function resolveLoginIdentifier(identifier) {
  if (identifier.includes('@')) {
    return identifier;
  }
  const { data, error } = await supabaseClient
    .from('persona')
    .select('email')
    .eq('username', identifier)
    .single();
  if (error || !data) {
    return null;
  }
  return data.email;
}

// ---- HANDLE LOGIN (con soporte username/email) ----
async function handleLogin(e) {
  e.preventDefault();
  clearAllErrors([
    ['login-identifier', 'login-identifier-err'],
    ['login-password', 'login-password-err'],
  ]);

  const identifier = document.getElementById('login-identifier').value.trim();
  const password = document.getElementById('login-password').value;

  let valid = true;
  if (!identifier) {
    setError('login-identifier', 'login-identifier-err', 'Introduce tu nombre de usuario o correo.');
    valid = false;
  } else {
    clearError('login-identifier', 'login-identifier-err');
  }
  if (!password) {
    setError('login-password', 'login-password-err', 'La contraseña es obligatoria.');
    valid = false;
  } else {
    clearError('login-password', 'login-password-err');
  }
  if (!valid) return;

  setLoading('btn-login', 'spinner-login', true);

  const email = await resolveLoginIdentifier(identifier);
  if (!email) {
    setLoading('btn-login', 'spinner-login', false);
    setError('login-identifier', 'login-identifier-err', 'No se encontró ningún usuario con ese nombre de usuario o correo.');
    return;
  }

  const { user, perfil, error } = await supabaseSignIn(email, password);
  setLoading('btn-login', 'spinner-login', false);

  if (error) {
    setError('login-password', 'login-password-err', error);
    return;
  }

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

// ---- HANDLE REGISTER (sin cambios) ----
async function handleRegister(e) {
  e.preventDefault();
  clearAllErrors([
    ['reg-name', 'reg-name-err'],
    ['reg-username', 'reg-username-err'],
    ['reg-email', 'reg-email-err'],
    ['reg-phone', 'reg-phone-err'],
    ['reg-birthdate', 'reg-birthdate-err'],
    ['reg-password', 'reg-password-err'],
    ['reg-confirm', 'reg-confirm-err'],
    ['reg-terms', 'reg-terms-err'],
  ]);

  const name = document.getElementById('reg-name').value.trim();
  const apellidos = document.getElementById('reg-surname').value.trim() || null;
  const username   = document.getElementById('reg-username').value.trim().toLowerCase();
  const email = document.getElementById('reg-email').value.trim();
  const telefono = document.getElementById('reg-phone').value.trim();
  const birthdate = document.getElementById('reg-birthdate').value;
  const password = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm').value;
  const terms = document.getElementById('reg-terms').checked;

  let valid = true;

  if (!name) { setError('reg-name', 'reg-name-err', 'El nombre es obligatorio.'); valid = false; } else { clearError('reg-name', 'reg-name-err'); }
  if (!telefono) { setError('reg-phone', 'reg-phone-err', 'El teléfono es obligatorio.'); valid = false; } else if (!/^\+?[\d\s\-]{7,15}$/.test(telefono)) { setError('reg-phone', 'reg-phone-err', 'Introduce un teléfono válido.'); valid = false; } else { clearError('reg-phone', 'reg-phone-err'); }
  if (!birthdate) { setError('reg-birthdate', 'reg-birthdate-err', 'La fecha de nacimiento es obligatoria.'); valid = false; } else { const hoy = new Date(); const nacimiento = new Date(birthdate); const edad = hoy.getFullYear() - nacimiento.getFullYear() - (hoy < new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate()) ? 1 : 0); if (edad < 14) { setError('reg-birthdate', 'reg-birthdate-err', 'Debes tener al menos 14 años.'); valid = false; } else if (edad > 120) { setError('reg-birthdate', 'reg-birthdate-err', 'Introduce una fecha válida.'); valid = false; } else { clearError('reg-birthdate', 'reg-birthdate-err'); } }
  if (!email) { setError('reg-email', 'reg-email-err', 'El correo es obligatorio.'); valid = false; } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('reg-email', 'reg-email-err', 'Introduce un correo válido.'); valid = false; } else { clearError('reg-email', 'reg-email-err'); }
  if (!password) { setError('reg-password', 'reg-password-err', 'La contraseña es obligatoria.'); valid = false; } else if (password.length < 8) { setError('reg-password', 'reg-password-err', 'Mínimo 8 caracteres.'); valid = false; } else { clearError('reg-password', 'reg-password-err'); }
  if (!confirm) { setError('reg-confirm', 'reg-confirm-err', 'Confirma tu contraseña.'); valid = false; } else if (confirm !== password) { setError('reg-confirm', 'reg-confirm-err', 'Las contraseñas no coinciden.'); valid = false; } else { clearError('reg-confirm', 'reg-confirm-err'); }
  if (!terms) { const err = document.getElementById('reg-terms-err'); if (err) err.textContent = 'Debes aceptar los términos para continuar.'; valid = false; }
  if (!username) { setError('reg-username', 'reg-username-err', 'El nombre de usuario es obligatorio.'); valid = false; } else if (!/^[a-z0-9._]{3,20}$/.test(username)) { setError('reg-username', 'reg-username-err', 'Solo minúsculas, números, puntos y guiones bajos. Entre 3 y 20 caracteres.'); valid = false; } else { clearError('reg-username', 'reg-username-err'); }

  if (!valid) return;

  setLoading('btn-register', 'spinner-register', true);

  const { user, error } = await supabaseSignUp(name, apellidos, email, password, telefono, birthdate, username);
  setLoading('btn-register', 'spinner-register', false);
  if (error) { setError('reg-email', 'reg-email-err', error); return; }

  // Si no hay user, puede ser que Supabase requiera confirmación de email
  if (!user) {
    showToast('¡Cuenta creada! Revisa tu correo para confirmar tu registro 📧');
    return;
  }

  let avatarUrl = null;
  const avatarFile = document.getElementById('reg-avatar-input').files[0];
  if (avatarFile) {
    avatarUrl = await supabaseUploadAvatar(avatarFile, user.id);
    if (avatarUrl) await supabaseUpdatePerfil(user.id, { avatar_url: avatarUrl });
  }

  const userData = { id: user.id, name: name, email: email, role: 'usuario', avatar: avatarUrl };
  localStorage.setItem('cbdj-user', JSON.stringify(userData));

  showToast('¡Cuenta creada! Bienvenido al Carnaval 🎉');
  setTimeout(() => { window.location.href = 'app.html'; }, 1200);
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

// ---- MODAL TÉRMINOS ----
function openTermsModal(e) {
  if (e) e.preventDefault();
  const overlay = document.getElementById('terms-overlay');
  const btnAccept = document.getElementById('btn-accept-terms');
  const body = overlay.querySelector('.terms-modal__body');

  btnAccept.disabled = true;
  body.scrollTop = 0;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  body.onscroll = () => {
    const llegadoAlFinal = body.scrollTop + body.clientHeight >= body.scrollHeight - 10;
    if (llegadoAlFinal) {
      btnAccept.disabled = false;
      body.onscroll = null;
    }
  };
}
function closeTermsModal(e) {
  if (e && e.target !== document.getElementById('terms-overlay')) return;
  document.getElementById('terms-overlay').classList.remove('open');
  document.body.style.overflow = '';
}
function acceptTermsModal() {
  const checkbox = document.getElementById('reg-terms');
  if (checkbox) checkbox.checked = true;
  document.getElementById('terms-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ---- SESIÓN ACTIVA AL CARGAR AUTH ----
(async function checkExistingSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    showSessionActiveWarning(session.user.email);
  }
})();

function showSessionActiveWarning(email) {
  const banner = document.createElement('div');
  banner.id = 'session-warning';
  banner.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
    background: #7c3aed; color: white; text-align: center;
    padding: 14px 20px; font-size: 15px; font-weight: 600;
    display: flex; align-items: center; justify-content: center; gap: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  `;
  banner.innerHTML = `
    <span>⚠️ Ya hay una sesión activa como <strong>${email}</strong></span>
    <button onclick="window.location.href='app.html'" style="
      background: white; color: #7c3aed; border: none; border-radius: 6px;
      padding: 6px 14px; cursor: pointer; font-weight: 700; font-size: 14px;
    ">Ir a la app</button>
    <button onclick="cerrarSesionActiva()" style="
      background: transparent; color: white; border: 2px solid white;
      border-radius: 6px; padding: 6px 14px; cursor: pointer;
      font-weight: 600; font-size: 14px;
    ">Cerrar sesión</button>
  `;
  document.body.prepend(banner);

  ['btn-login', 'btn-register'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.disabled = true;
      btn.title = 'Ya hay una sesión activa';
    }
  });
}

async function cerrarSesionActiva() {
  await supabaseSignOut();
  localStorage.removeItem('cbdj-user');
  document.getElementById('session-warning')?.remove();
  ['btn-login', 'btn-register'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.disabled = false;
  });
  showToast('Sesión cerrada. Ya puedes iniciar sesión con otra cuenta.');
}