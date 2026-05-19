/* ============================================================
   CARNAVAL DE BADAJOZ — App JavaScript
   Author: Ángel Galea Anisa | TFG 2025/2026
   Datos: carnavaldebadajoz.org — Edición 2026
   ============================================================ */

// =====================================================================
// DATOS REALES — Carnaval de Badajoz 2026
// Fuente: https://carnavaldebadajoz.org/
// =====================================================================
let EVENTOS = [];

// =====================================================================
// ESCENARIOS CON COORDENADAS REALES DE BADAJOZ
// =====================================================================
// =====================================================================
// ESCENARIOS CON COORDENADAS REALES DE BADAJOZ
// =====================================================================
const ESCENARIO_DATA = {

  'Teatro López de Ayala': {
    title: '🎭 Teatro López de Ayala',
    desc: 'Sede del COMBA, el Concurso Oficial de Murgas.',
    tag: 'Murgas',
    lat: 38.876273,
    lng: -6.972268,
    icon: '🎭'
  },

  'Plaza de Conquistadores': {
    title: '🥁 Plaza de Conquistadores',
    desc: 'Punto de encuentro de comparsas.',
    tag: 'Comparsas',
    lat: 38.872339,
    lng: -6.974782,
    icon: '🥁'
  },

  'Avda. Entrepuentes': {
    title: '⚙️ Avda. Entrepuentes',
    desc: 'Zona de artefactos carnavaleros.',
    tag: 'Artefactos',
    lat: 38.880383,
    lng: -6.976842,
    icon: '⚙️'
  },

  'Plaza de San Atón': {
    title: '🎉 Plaza de San Atón',
    desc: 'Actuaciones y grupos de animación.',
    tag: 'Animación',
    lat: 38.876557,
    lng: -6.971081,
    icon: '🎉'
  },

  'Avda. Santa Marina': {
    title: '👑 Avda. Santa Marina',
    desc: 'Inicio del Gran Desfile.',
    tag: 'Desfiles',
    lat: 38.877506,
    lng: -6.980230,
    icon: '👑'
  },

  'Plaza de España': {
    title: '👧 Plaza de España',
    desc: 'Carnaval Infantil y Mascotas.',
    tag: 'Infantil',
    lat: 38.878141,
    lng: -6.970191,
    icon: '👧'
  },

  'Avda. Ricardo Carapeto': {
    title: '🐟 Avda. Ricardo Carapeto',
    desc: 'Entierro de la Sardina.',
    tag: 'Entierro Sardina',
    lat: 38.878946,
    lng: -6.955701,
    icon: '🐟'
  },

  'Plaza Alta': {
    title: '🏰 Plaza Alta',
    desc: 'Pasacalles Majara.',
    tag: 'Pasacalles',
    lat: 38.881073,
    lng: -6.968276,
    icon: '🏰'
  },

  'Plaza de San Francisco': {
    title: '👋 Plaza de San Francisco',
    desc: 'Desfile de Despedida.',
    tag: 'Despedida',
    lat: 38.876394,
    lng:  -6.973452,
    icon: '👋'
  },

  'Plaza de la Soledad': {
    title: '✨ Plaza de la Soledad',
    desc: 'Zona emblemática del Carnaval.',
    tag: 'Carnaval',
    lat: 38.880502,
    lng: -6.970952,
    icon: '✨'
  },

  'Calle Francisco Pizarro': {
    title: '🎺 Calle Francisco Pizarro',
    desc: 'Zona de agrupaciones.',
    tag: 'Pasacalles',
    lat: 38.879386,
    lng: -6.971912,
    icon: '🎺'
  },

  'Plaza López de Ayala': {
    title: '🌴 Plaza López de Ayala',
    desc: 'Plaza situada junto a San Francisco.',
    tag: 'Centro',
    lat: 38.878690,
    lng: -6.972526,
    icon: '🌴'
  },

  'Recinto Ferial': {
    title: '🎪 Recinto Ferial',
    desc: 'Gran Desfile y Desfile Infantil del Carnaval.',
    tag: 'Desfiles',
    lat: 38.873229,
    lng: -6.992398,
    icon: '🎪'
  },

  'C/ Lady Smith (Cerro Gordo)': {
    title: '🏘️ Cerro Gordo - Lady Smith',
    desc: 'Escenario carnavalesco en Cerro Gordo.',
    tag: 'Barriadas',
    lat: 38.903164,
    lng: -6.905857,
    icon: '🏘️'
  }

};

// =====================================================================
// GOOGLE MAPS API KEY
// =====================================================================
const GOOGLE_MAPS_API_KEY = 'AIzaSyC10qy-WNqjCRyn5633_vbnrnBL5dQiKUc';

// =====================================================================
// ESTADO GLOBAL
// =====================================================================
let favoritos = [];
let currentSection = 'inicio';
let filteredEventos = [];
let map = null;
let markers = {};
let infoWindows = {};
let currentUser = null;

// =====================================================================
// INICIALIZACIÓN
// =====================================================================
document.addEventListener('DOMContentLoaded', async () => {
  // ---- Leer sesión de usuario desde localStorage (cache rápido) ----
  const storedUser = localStorage.getItem('cbdj-user');
  if (!storedUser) {
    // No hay sesión, redirigir al login
    window.location.href = 'auth.html';
    return;
  }
  currentUser = JSON.parse(storedUser);

  // ---- Verificar sesión con Supabase ----
  try {
    const { user, perfil } = await supabaseGetUser();
    if (!user) {
      // Sesión expirada, redirigir
      localStorage.removeItem('cbdj-user');
      window.location.href = 'auth.html';
      return;
    }
    // Actualizar datos del usuario con los de Supabase
    if (perfil) {
      currentUser = {
        id: user.id,
        name: perfil.nombre || currentUser.name,
        email: user.email,
        role: perfil.rol === 'admin' ? 'admin' : 'user'
      };
      localStorage.setItem('cbdj-user', JSON.stringify(currentUser));
    }
  } catch (err) {
    console.warn('No se pudo verificar la sesión con Supabase, usando datos locales:', err);
  }

  // ---- Configurar UI según rol ----
  setupUserUI();

  // ---- Cargar eventos desde Supabase ----
  EVENTOS = await supabaseGetEventos();
  filteredEventos = [...EVENTOS];

  renderUpcomingList();
  renderEventos(EVENTOS);
  renderAdminTable(EVENTOS);
  updateFavBadge();
  updateStatFav();

  // ---- Cargar favoritos desde Supabase ----
  if (currentUser.id) {
    try {
      favoritos = await supabaseGetFavoritos(currentUser.id);
    } catch (err) {
      console.warn('Error cargando favoritos de Supabase:', err);
      favoritos = [];
    }
  }
  renderEventos(filteredEventos.length !== EVENTOS.length ? filteredEventos : EVENTOS);
  renderFavoritos();
  updateFavBadge();
  updateStatFav();

  // Actualizar conteo admin
  const adminTotal = document.getElementById('admin-total-eventos');
  if (adminTotal) adminTotal.textContent = EVENTOS.length;

  // Renderizar panel de moderación si es admin
  if (currentUser.role === 'admin') {
    renderModerationPanel();
  }
});

// =====================================================================
// SETUP UI SEGÚN USUARIO
// =====================================================================
function setupUserUI() {
  const navAdmin = document.getElementById('nav-admin');
  const userAvatar = document.querySelector('.sidebar-user .user-avatar');
  const userName = document.querySelector('.sidebar-user .user-name');
  const userRole = document.querySelector('.sidebar-user .user-role');
  const topbarAvatar = document.querySelector('.topbar-avatar');

  // Mostrar/ocultar admin
  if (navAdmin) {
    if (currentUser.role === 'admin') {
      navAdmin.style.display = '';
    } else {
      navAdmin.style.display = 'none';
    }
  }

  // Actualizar info del sidebar
  const initial = currentUser.name.charAt(0).toUpperCase();
  if (userAvatar) userAvatar.textContent = initial;
  if (userName) userName.textContent = currentUser.name;
  if (userRole) {
    userRole.textContent = currentUser.role === 'admin' ? 'Administrador' : 'Usuario';
    if (currentUser.role === 'admin') {
      userRole.style.color = '#f59e0b';
    }
  }
  if (topbarAvatar) topbarAvatar.textContent = initial;
}

// =====================================================================
// CERRAR SESIÓN
// =====================================================================
async function logout() {
  await supabaseSignOut();
  localStorage.removeItem('cbdj-user');
  window.location.href = 'auth.html';
}

// =====================================================================
// GOOGLE MAPS — INICIALIZACIÓN
// =====================================================================
// =====================================================================
// GOOGLE MAPS — INICIALIZACIÓN
// =====================================================================
function initMap() {

  const badajozCenter = {
    lat: 38.8794,
    lng: -6.9705
  };

  map = new google.maps.Map(document.getElementById('google-map'), {
    zoom: 14,
    center: badajozCenter,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    zoomControl: true,
    styles: [
      { elementType: 'geometry', stylers: [{ color: '#1d1d2e' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#1d1d2e' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#8a8aaa' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2a2a40' }] },
      { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#6a6a8a' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e0e1a' }] },
      { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4a4a6a' }] },
      { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#252540' }] },
      { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#1a2e1a' }] },
      { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#6a6a8a' }] },
      { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    ]
  });

  // Limpiar objetos por si se vuelve a ejecutar
  markers = {};
  infoWindows = {};

  // =================================================================
  // CREAR LOS 13 MARCADORES
  // =================================================================
  Object.keys(ESCENARIO_DATA).forEach((key) => {

    const esc = ESCENARIO_DATA[key];

    // Emoji individual
    const markerEmoji = esc.icon || '📍';

    const position = {
      lat: esc.lat,
      lng: esc.lng
    };

    // ---------------------------------------------------------------
    // MARCADOR
    // ---------------------------------------------------------------
    const marker = new google.maps.Marker({
      position: position,
      map: map,
      title: esc.title.replace(/^[^\s]+\s/, ''),
      animation: google.maps.Animation.DROP,

      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg"
               width="46"
               height="46"
               viewBox="0 0 46 46">

            <circle
              cx="23"
              cy="23"
              r="20"
              fill="#6c3bd1"
              stroke="#a855f7"
              stroke-width="3"
              opacity="0.95"/>

            <text
              x="23"
              y="29"
              text-anchor="middle"
              font-size="18">
              ${markerEmoji}
            </text>

          </svg>
        `)}`,

        scaledSize: new google.maps.Size(46, 46),
        anchor: new google.maps.Point(23, 23)
      }
    });

    // ---------------------------------------------------------------
    // INFOWINDOW
    // ---------------------------------------------------------------
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="
          padding:10px;
          max-width:240px;
          font-family:'Outfit',sans-serif;
          color:#111;
        ">
          <h3 style="
            margin:0 0 8px;
            font-size:16px;
            font-weight:700;
          ">
            ${esc.title}
          </h3>

          <p style="
            margin:0 0 8px;
            font-size:13px;
            color:#555;
            line-height:1.4;
          ">
            ${esc.desc}
          </p>

          <span style="
            display:inline-block;
            padding:4px 10px;
            background:#6c3bd1;
            color:white;
            border-radius:999px;
            font-size:11px;
            font-weight:600;
          ">
            ${esc.tag}
          </span>
        </div>
      `
    });

    // ---------------------------------------------------------------
    // CLICK DEL MARCADOR
    // ---------------------------------------------------------------
    marker.addListener('click', () => {

      // cerrar todos
      Object.values(infoWindows).forEach(iw => iw.close());

      // abrir actual
      infoWindow.open(map, marker);

      // animación rebote
      marker.setAnimation(google.maps.Animation.BOUNCE);

      setTimeout(() => {
        marker.setAnimation(null);
      }, 1400);

      // sincronizar lista lateral
      selectEscenariByKey(key);
    });

    // ---------------------------------------------------------------
    // GUARDAR REFERENCIAS
    // ---------------------------------------------------------------
    markers[key] = marker;
    infoWindows[key] = infoWindow;
  });

  // =================================================================
  // AJUSTAR MAPA PARA QUE SE VEAN LOS 13 PUNTOS
  // =================================================================
  const bounds = new google.maps.LatLngBounds();

  Object.values(markers).forEach(marker => {
    bounds.extend(marker.getPosition());
  });

  map.fitBounds(bounds);

  // evitar zoom exagerado
  google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
    if (map.getZoom() > 15) {
      map.setZoom(15);
    }
  });
}

// =====================================================================
// NAVEGACIÓN ENTRE SECCIONES
// =====================================================================
const SECTION_TITLES = {
  inicio: '🏠 Inicio',
  programa: '🗓️ Programa',
  mapa: '🗺️ Mapa',
  favoritos: '❤️ Favoritos',
  admin: '🛡️ Admin',
};

function showSection(name) {
  // Proteger sección admin
  if (name === 'admin' && (!currentUser || currentUser.role !== 'admin')) {
    showToast('⛔ No tienes permisos de administrador', true);
    return;
  }

  document.querySelectorAll('.app-section').forEach(s => s.classList.add('app-section--hidden'));
  document.getElementById(`section-${name}`).classList.remove('app-section--hidden');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('nav-item--active'));
  const navEl = document.getElementById(`nav-${name}`);
  if (navEl) navEl.classList.add('nav-item--active');

  document.getElementById('topbar-title').textContent = SECTION_TITLES[name] || name;
  currentSection = name;

  // Cerrar sidebar en mobile
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');

  if (name === 'favoritos') renderFavoritos();
  if (name === 'admin' && currentUser && currentUser.role === 'admin') renderModerationPanel();

  // Recentrar mapa cuando se abre la sección de mapa
  if (name === 'mapa' && map) {
    setTimeout(() => {
      google.maps.event.trigger(map, 'resize');
      map.setCenter({ lat: 38.8782, lng: -6.9710 });
    }, 100);
  }
}

// =====================================================================
// SIDEBAR MOBILE
// =====================================================================
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('open');
}

// =====================================================================
// RENDER: UPCOMING LIST (Inicio)
// =====================================================================
function renderUpcomingList() {
  const container = document.getElementById('upcoming-list');
  if (!container) return;
  // Mostrar los desfiles principales
  const items = EVENTOS.filter(e => e.categoria === 'Desfile').slice(0, 5);
  container.innerHTML = items.map(e => `
    <div class="upcoming-item" onclick="openEventoModal(${e.id})">
      <div class="upcoming-time">
        <div class="uh">${e.hora}</div>
        <div class="ud">${e.dia.split(' ').slice(0, 2).join(' ')}</div>
      </div>
      <div class="upcoming-divider"></div>
      <div class="upcoming-info">
        <strong>${e.nombre}</strong>
        <span>📍 ${e.escenario}</span>
      </div>
      <div class="upcoming-cat">
        <span class="evento-tag tag--${e.categoria.replace(/\s/g, '')}">${e.categoria}</span>
      </div>
    </div>
  `).join('');
}

// =====================================================================
// RENDER: EVENTOS GRID
// =====================================================================
function renderEventos(eventos) {
  const container = document.getElementById('eventos-grid');
  const info = document.getElementById('results-count');
  if (!container) return;
  if (info) info.textContent = eventos.length;

  if (eventos.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted);">
        <span style="font-size:2.5rem;display:block;margin-bottom:.75rem">🔍</span>
        <p>No hay eventos con estos filtros.</p>
      </div>`;
    return;
  }

  container.innerHTML = eventos.map(e => buildEventoCard(e)).join('');
}

function buildEventoCard(e) {
  const isFav = favoritos.includes(e.id);
  const catClass = e.categoria.replace(/\s/g, '');
  return `
    <div class="evento-card evento-card--${catClass}" onclick="openEventoModal(${e.id})">
      <div class="evento-card-header">
        <span class="evento-title">${e.nombre}</span>
        <button class="fav-btn ${isFav ? 'active' : ''}" 
                title="${isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}"
                onclick="event.stopPropagation(); toggleFav(${e.id}, this)">
          ${isFav ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="evento-meta">
        <div class="evento-meta-row"><span>📅</span> ${e.dia}</div>
        <div class="evento-meta-row"><span>🕐</span> ${e.hora}</div>
        <div class="evento-meta-row"><span>📍</span> ${e.escenario}</div>
      </div>
      <div class="evento-tags">
        <span class="evento-tag tag--${catClass}">${e.categoria}</span>
      </div>
    </div>`;
}

// =====================================================================
// FILTROS
// =====================================================================
function applyFilters() {
  const cat = document.getElementById('filter-categoria').value;
  const dia = document.getElementById('filter-dia').value;
  const esc = document.getElementById('filter-escenario').value;
  const search = document.getElementById('filter-search').value.toLowerCase().trim();

  filteredEventos = EVENTOS.filter(e => {
    return (!cat || e.categoria === cat)
      && (!dia || e.dia === dia)
      && (!esc || e.escenario === esc)
      && (!search || e.nombre.toLowerCase().includes(search) || e.descripcion.toLowerCase().includes(search));
  });

  renderEventos(filteredEventos);
}

function clearFilters() {
  document.getElementById('filter-categoria').value = '';
  document.getElementById('filter-dia').value = '';
  document.getElementById('filter-escenario').value = '';
  document.getElementById('filter-search').value = '';
  filteredEventos = [...EVENTOS];
  renderEventos(EVENTOS);
}

function filterByCategory(cat) {
  document.getElementById('filter-categoria').value = cat;
  applyFilters();
}

// =====================================================================
// FAVORITOS (Supabase)
// =====================================================================
async function toggleFav(id, btn) {
  if (!currentUser || !currentUser.id) {
    showToast('⚠️ Inicia sesión para guardar favoritos', true);
    return;
  }

  const idx = favoritos.indexOf(id);
  if (idx === -1) {
    // Añadir a favoritos
    btn.textContent = '❤️';
    btn.classList.add('active');
    favoritos.push(id);
    showToast('❤️ Añadido a favoritos');
    await supabaseAddFavorito(currentUser.id, id);
  } else {
    // Quitar de favoritos
    btn.textContent = '🤍';
    btn.classList.remove('active');
    favoritos.splice(idx, 1);
    showToast('💔 Eliminado de favoritos');
    await supabaseRemoveFavorito(currentUser.id, id);
  }
  updateFavBadge();
  updateStatFav();
  if (currentSection === 'favoritos') renderFavoritos();
}

function updateFavBadge() {
  const badge = document.getElementById('fav-badge');
  if (!badge) return;
  badge.textContent = favoritos.length;
  badge.classList.toggle('visible', favoritos.length > 0);
}

function updateStatFav() {
  const el = document.getElementById('stat-fav-num');
  if (el) el.textContent = favoritos.length;
}

function renderFavoritos() {
  const container = document.getElementById('favoritos-grid');
  const empty = document.getElementById('fav-empty');
  if (!container) return;

  const favEventos = EVENTOS.filter(e => favoritos.includes(e.id));
  if (favEventos.length === 0) {
    container.innerHTML = '';
    empty.classList.add('visible');
    return;
  }
  empty.classList.remove('visible');
  container.innerHTML = favEventos.map(e => buildEventoCard(e)).join('');
}

// =====================================================================
// MODAL EVENTO
// =====================================================================
function openEventoModal(id) {
  const e = EVENTOS.find(ev => ev.id === id);
  if (!e) return;
  const isFav = favoritos.includes(e.id);
  const catClass = e.categoria.replace(/\s/g, '');
  const body = document.getElementById('modal-evento-body');
  body.innerHTML = `
    <div class="modal-evento-header">
      <div class="modal-evento-title">${e.nombre}</div>
      <div class="evento-tags" style="margin-bottom:.75rem">
        <span class="evento-tag tag--${catClass}">${e.categoria}</span>
      </div>
      <div class="modal-evento-meta">
        <div class="modal-evento-meta-row"><span>📅</span> ${e.dia}</div>
        <div class="modal-evento-meta-row"><span>🕐</span> ${e.hora}</div>
        <div class="modal-evento-meta-row"><span>📍</span> ${e.escenario}</div>
      </div>
    </div>
    <p class="modal-evento-desc">${e.descripcion}</p>
    <div style="margin-top:1.5rem;display:flex;gap:.75rem;flex-wrap:wrap">
      <button class="btn-primary" onclick="toggleFav(${e.id}, document.getElementById('modal-fav-btn')); updateModalFav(${e.id})" 
              id="modal-fav-btn" style="${isFav ? 'background:linear-gradient(135deg,#991b1b,#ef4444)' : ''}">
        ${isFav ? '❤️ En favoritos' : '🤍 Añadir a favoritos'}
      </button>
      <button class="btn-primary" style="background:rgba(59,130,246,0.2);border:1px solid rgba(59,130,246,0.4);color:#60a5fa" onclick="showSection('mapa');closeModal('modal-evento')">
        📍 Ver en el mapa
      </button>
    </div>

    <!-- SECCIÓN DE COMENTARIOS -->
    <div class="comments-section">
      <div class="comments-header">
        <h3>💬 Comentarios</h3>
        <span class="comments-count" id="comments-count-${e.id}">0</span>
      </div>

      <div class="comment-form">
        <div class="comment-form-avatar">${currentUser ? currentUser.name.charAt(0).toUpperCase() : 'U'}</div>
        <div class="comment-form-input-wrap">
          <textarea id="comment-input-${e.id}" class="comment-textarea" placeholder="Escribe un comentario..." rows="2"></textarea>
          <button class="comment-submit-btn" onclick="addComment(${e.id})">Publicar</button>
        </div>
      </div>

      <div class="comments-list" id="comments-list-${e.id}">
        <!-- JS inserta aquí -->
      </div>
    </div>`;

  renderComments(e.id);
  document.getElementById('modal-evento').classList.add('open');
}

function updateModalFav(id) {
  const btn = document.getElementById('modal-fav-btn');
  const isFav = favoritos.includes(id);
  btn.textContent = isFav ? '❤️ En favoritos' : '🤍 Añadir a favoritos';
  btn.style.background = isFav ? 'linear-gradient(135deg,#991b1b,#ef4444)' : '';
}

// =====================================================================
// SISTEMA DE COMENTARIOS (Supabase)
// =====================================================================

async function addComment(eventoId) {
  const input = document.getElementById(`comment-input-${eventoId}`);
  if (!input) return;
  const text = input.value.trim();
  if (!text) {
    showToast('⚠️ Escribe un comentario antes de publicar', true);
    return;
  }

  if (!currentUser || !currentUser.id) {
    showToast('⚠️ Inicia sesión para comentar', true);
    return;
  }

  // Publicar comentario en Supabase
  const { comment, error } = await supabaseAddComentario(currentUser.id, eventoId, text);

  if (error) {
    showToast('❌ ' + error, true);
    return;
  }

  input.value = '';
  renderComments(eventoId);
  showToast('💬 Comentario publicado');
}

async function deleteComment(eventoId, commentId) {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('⛔ Solo el administrador puede eliminar comentarios', true);
    return;
  }

  const success = await supabaseDeleteComentario(commentId);
  if (success) {
    renderComments(eventoId);
    renderModerationPanel();
    showToast('🗑️ Comentario eliminado');
  } else {
    showToast('❌ Error al eliminar comentario', true);
  }
}

async function renderComments(eventoId) {
  const container = document.getElementById(`comments-list-${eventoId}`);
  const countEl = document.getElementById(`comments-count-${eventoId}`);
  if (!container) return;

  // Cargar comentarios desde Supabase
  const eventComments = await supabaseGetComentarios(eventoId);
  if (countEl) countEl.textContent = eventComments.length;

  if (eventComments.length === 0) {
    container.innerHTML = `
      <div class="comments-empty">
        <span>💭</span>
        <p>No hay comentarios aún. ¡Sé el primero en opinar!</p>
      </div>`;
    return;
  }

  const isAdmin = currentUser && currentUser.role === 'admin';

  container.innerHTML = eventComments.slice().reverse().map(c => {
    const date = new Date(c.fecha);
    const timeStr = date.toLocaleDateString('es-ES', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    const userName = (c.persona && c.persona.nombre) ? c.persona.nombre : 'Anónimo';
    const initial = userName.charAt(0).toUpperCase();
    return `
      <div class="comment-item" id="comment-${c.id_publicacion}">
        <div class="comment-avatar">${initial}</div>
        <div class="comment-body">
          <div class="comment-header">
            <strong class="comment-user">${userName}</strong>
            <span class="comment-date">${timeStr}</span>
          </div>
          <p class="comment-text">${escapeHtml(c.contenido)}</p>
        </div>
        ${isAdmin ? `<button class="comment-delete-btn" onclick="event.stopPropagation(); deleteComment(${eventoId}, ${c.id_publicacion})" title="Eliminar comentario">🗑️</button>` : ''}
      </div>`;
  }).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// =====================================================================
// PANEL DE MODERACIÓN (Admin) — Supabase
// =====================================================================
async function renderModerationPanel() {
  const container = document.getElementById('moderation-list');
  const countEl = document.getElementById('moderation-count');
  if (!container) return;

  // Cargar todos los comentarios desde Supabase
  const allComments = await supabaseGetAllComentarios();

  if (countEl) countEl.textContent = allComments.length;

  if (allComments.length === 0) {
    container.innerHTML = `
      <div class="moderation-empty">
        <span>💬</span>
        <p>No hay comentarios para moderar.</p>
      </div>`;
    return;
  }

  container.innerHTML = allComments.slice(0, 30).map(c => {
    const date = new Date(c.fecha);
    const timeStr = date.toLocaleDateString('es-ES', {
      day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit'
    });
    const userName = (c.persona && c.persona.nombre) ? c.persona.nombre : 'Anónimo';
    const evento = EVENTOS.find(e => e.id === c.id_evento);
    const eventoName = evento ? evento.nombre : 'Evento #' + c.id_evento;
    return `
      <div class="moderation-item">
        <div class="moderation-item-info">
          <div class="moderation-item-top">
            <strong>${userName}</strong>
            <span class="moderation-event-tag">📌 ${eventoName}</span>
          </div>
          <p class="moderation-item-text">${escapeHtml(c.contenido)}</p>
          <span class="moderation-item-date">${timeStr}</span>
        </div>
        <button class="admin-action-btn admin-action-btn--del" onclick="deleteComment(${c.id_evento}, ${c.id_publicacion})">Eliminar</button>
      </div>`;
  }).join('');
}

// =====================================================================
// MODAL: CERRAR
// =====================================================================
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// =====================================================================
// MAPA — Escenarios info
// =====================================================================
function selectEscenario(el, key) {
  document.querySelectorAll('.escenario-item').forEach(li => li.classList.remove('escenario-item--active'));
  el.classList.add('escenario-item--active');
  updateEscenarioInfo(key);
  panToEscenario(key);
}

function selectEscenariByKey(key) {
  updateEscenarioInfo(key);
  const items = document.querySelectorAll('.escenario-item');
  const idx = Object.keys(ESCENARIO_DATA).indexOf(key);
  items.forEach(li => li.classList.remove('escenario-item--active'));
  if (items[idx]) items[idx].classList.add('escenario-item--active');
}

function updateEscenarioInfo(key) {
  const d = ESCENARIO_DATA[key];
  if (!d) return;
  document.getElementById('esc-title').textContent = d.title;
  document.getElementById('esc-desc').textContent = d.desc;
  document.getElementById('esc-tag').textContent = d.tag;
}

function panToEscenario(key) {
  const esc = ESCENARIO_DATA[key];
  if (!esc || !map) return;
  map.panTo({ lat: esc.lat, lng: esc.lng });
  map.setZoom(16);

  // Abrir info window del marcador
  Object.values(infoWindows).forEach(iw => iw.close());
  if (infoWindows[key] && markers[key]) {
    infoWindows[key].open(map, markers[key]);
    markers[key].setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(() => markers[key].setAnimation(null), 1500);
  }
}

// =====================================================================
// ADMIN
// =====================================================================
function renderAdminTable(eventos) {
  const tbody = document.getElementById('admin-table-body');
  if (!tbody) return;
  const catClass = (c) => c.replace(/\s/g, '');
  tbody.innerHTML = eventos.slice(0, 15).map(e => `
    <tr>
      <td><strong>${e.nombre}</strong></td>
      <td><span class="evento-tag tag--${catClass(e.categoria)}">${e.categoria}</span></td>
      <td>${e.dia}</td>
      <td>${e.hora}</td>
      <td>${e.escenario}</td>
      <td>
        <button class="admin-action-btn admin-action-btn--edit" onclick="showToast('✏️ Edición disponible en producción')">Editar</button>
        <button class="admin-action-btn admin-action-btn--del" onclick="deleteEventAdmin(${e.id}, this)">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

async function deleteEventAdmin(id, btn) {
  const exito = await supabaseDeleteEvento(id);
  if (!exito) {
    showToast('⚠️ Error al eliminar evento', true);
    return;
  }

  const row = btn.closest('tr');
  row.style.opacity = '0';
  row.style.transition = 'opacity .3s';
  setTimeout(() => row.remove(), 350);
  showToast('🗑️ Evento eliminado');

  const adminTotal = document.getElementById('admin-total-eventos');
  if (adminTotal) {
    adminTotal.textContent = parseInt(adminTotal.textContent) - 1;
  }

  EVENTOS = EVENTOS.filter(e => e.id !== id);
  filteredEventos = filteredEventos.filter(e => e.id !== id);
  renderEventos(filteredEventos);
}

function openAddEventModal() {
  document.getElementById('modal-add-evento').classList.add('open');
}

async function addEventFromAdmin() {
  const grupo = document.getElementById('new-grupo').value.trim();
  const categoria = document.getElementById('new-categoria').value;
  const dia = document.getElementById('new-dia').value.trim();
  const hora = document.getElementById('new-hora').value;
  const escenario = document.getElementById('new-escenario').value;
  const desc = document.getElementById('new-desc').value.trim();

  if (!grupo || !dia || !hora) {
    showToast('⚠️ Rellena los campos obligatorios', true);
    return;
  }

  const { data: newEvento, error } = await supabaseAddEvento({
    nombre: grupo,
    categoria, dia, hora, escenario,
    descripcion: desc || 'Sin descripción.'
  });

  if (error || !newEvento) {
    showToast('⚠️ Error al crear evento: ' + error, true);
    return;
  }

  EVENTOS.unshift(newEvento);
  filteredEventos = [...EVENTOS];
  renderAdminTable(EVENTOS);
  renderEventos(filteredEventos);

  const num = document.getElementById('admin-total-eventos');
  if (num) num.textContent = parseInt(num.textContent) + 1;

  closeModal('modal-add-evento');
  showToast('✅ Evento añadido correctamente');

  // Limpiar formulario
  ['new-grupo', 'new-dia', 'new-hora', 'new-desc'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

// =====================================================================
// TOAST
// =====================================================================
let toastTimer = null;
function showToast(msg, warn = false) {
  const toast = document.getElementById('toast-app');
  const msgEl = document.getElementById('toast-app-msg');
  const iconEl = document.getElementById('toast-app-icon');
  if (!toast) return;
  msgEl.textContent = msg;
  iconEl.textContent = warn ? '⚠️' : '';
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3000);
}
