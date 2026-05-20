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
    lng: -6.973452,
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
    lat: 38.889367,
    lng: -6.902655,
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
let ubicacionesList = [];

// Convierte "2026-02-13" a "Jue 13 Feb"
function dateToFechaTexto(fechaISO) {
  if (!fechaISO) return '';
  const fecha = new Date(fechaISO);
  const opciones = { weekday: 'short', day: 'numeric', month: 'short' };
  let fechaTexto = fecha.toLocaleDateString('es-ES', opciones);
  // Eliminar punto después del día y capitalizar primera letra del día
  fechaTexto = fechaTexto.replace('.', '').replace(/^\w/, c => c.toUpperCase());
  return fechaTexto;
}

function populateEscenarioSelect(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;
  select.innerHTML = '';
  ubicacionesList.forEach(ubi => {
    const option = document.createElement('option');
    option.value = ubi.id_ubicacion;
    option.textContent = ubi.nombre;
    select.appendChild(option);
  });
}

// Convierte "Jue 13 Feb" a "2026-02-13" (asume año 2026)
function fechaTextoToDateInput(fechaTexto) {
  if (!fechaTexto) return '';
  const meses = { 'Ene':'01','Feb':'02','Mar':'03','Abr':'04','May':'05','Jun':'06','Jul':'07','Ago':'08','Sep':'09','Oct':'10','Nov':'11','Dic':'12' };
  const partes = fechaTexto.split(' ');
  if (partes.length < 3) return '';
  const dia = partes[1].padStart(2, '0');
  const mes = meses[partes[2]];
  if (!mes) return '';
  return `2026-${mes}-${dia}`;
}

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
  ubicacionesList = await supabaseGetUbicaciones();
  populateEscenarioSelect('new-escenario');
populateEscenarioSelect('edit-escenario');
  filteredEventos = [...EVENTOS];

  renderUpcomingList();
  renderEventos(EVENTOS);
  renderAdminTable(EVENTOS);
  renderEscenariosList();
  updateFavBadge();
  updateStatFav();
  loadUbicacionesSelect()

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

  // ---- Cargar ubicaciones desde Supabase y actualizar datos de escenarios ----
  try {
    const ubicaciones = await supabaseGetUbicaciones();
    if (Array.isArray(ubicaciones) && ubicaciones.length > 0) {
      ubicaciones.forEach(ubi => {
        if (ESCENARIO_DATA[ubi.nombre]) {
          ESCENARIO_DATA[ubi.nombre].lat = ubi.latitud;
          ESCENARIO_DATA[ubi.nombre].lng = ubi.longitud;
        }
      });
    }
  } catch (err) {
    console.warn('Error cargando ubicaciones de Supabase:', err);
  }

  // Renderizar lista dinámica de escenarios en la barra lateral
  renderEscenariosList();

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
        <span>📍 ${e.ubicacion?.nombre || 'Sin ubicación'}</span>
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
        <div class="evento-meta-row"><span>📍</span> ${e.ubicacion?.nombre || 'Sin ubicación'}</div>
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
      && (!esc || e.ubicacion?.nombre === esc)
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
        <div class="modal-evento-meta-row"><span>📍</span> ${e.ubicacion?.nombre || 'Sin ubicación'}</div>
      </div>
    </div>
    <p class="modal-evento-desc">${e.descripcion}</p>
    <div style="margin-top:1.5rem;display:flex;gap:.75rem;flex-wrap:wrap">
      <button class="btn-primary" onclick="toggleFav(${e.id}, document.getElementById('modal-fav-btn')); updateModalFav(${e.id})" 
              id="modal-fav-btn" style="${isFav ? 'background:linear-gradient(135deg,#991b1b,#ef4444)' : ''}">
        ${isFav ? '❤️ En favoritos' : '🤍 Añadir a favoritos'}
      </button>
      <button class="btn-primary" style="background:rgba(59,130,246,0.2);border:1px solid rgba(59,130,246,0.4);color:#60a5fa" onclick="verEnMapa('${e.ubicacion?.nombre || ''}', ${e.id_ubicacion || 0})">
        📍Ver en el mapa
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

async function verEnMapa(nombreUbicacion, idUbicacion) {
  closeModal('modal-evento');
  let ubicacion = null;
  if (idUbicacion) {
    ubicacion = ubicacionesList.find(u => u.id_ubicacion === idUbicacion);
  }
  if (!ubicacion && nombreUbicacion) {
    ubicacion = ubicacionesList.find(u => u.nombre === nombreUbicacion);
  }
  if (!ubicacion) {
    showToast('❌ No se encontró la ubicación en el mapa', true);
    return;
  }
  showSection('mapa');
  setTimeout(() => {
    centrarMapaEnUbicacion(
      ubicacion.id_ubicacion,
      ubicacion.nombre,
      parseFloat(ubicacion.latitud),
      parseFloat(ubicacion.longitud),
      ubicacion.direccion || 'Ubicación carnavalera'
    );
    // Resaltar en la lista lateral
    const items = document.querySelectorAll('.escenario-item');
    items.forEach(item => {
      if (item.getAttribute('data-id') == ubicacion.id_ubicacion) {
        item.classList.add('escenario-item--active');
        const iconSpan = item.querySelector('.esc-icon');
        const icono = iconSpan ? iconSpan.textContent : '📍';
        document.getElementById('esc-title').innerHTML = `${icono} ${ubicacion.nombre}`;
        document.getElementById('esc-desc').innerHTML = ubicacion.direccion || 'Escenario del Carnaval de Badajoz';
        document.getElementById('esc-tag').innerHTML = 'Ubicación';
      } else {
        item.classList.remove('escenario-item--active');
      }
    });
  }, 300);
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

// Renderiza la lista lateral de escenarios usando los datos reales de la BD
function renderEscenariosList() {
  const container = document.getElementById('escenarios-list-container');
  if (!container) return;
  container.innerHTML = '';

  ubicacionesList.forEach(ubi => {
    // Icono según el nombre
    let icono = '📍';
    if (ubi.nombre.includes('Teatro')) icono = '🎭';
    else if (ubi.nombre.includes('Recinto')) icono = '🎪';
    else if (ubi.nombre.includes('Plaza Alta')) icono = '🏰';
    else if (ubi.nombre.includes('Casco')) icono = '🏘️';
    else if (ubi.nombre.includes('Plaza')) icono = '🏛️';
    else if (ubi.nombre.includes('Avda')) icono = '🛣️';
    else if (ubi.nombre.includes('Calle')) icono = '🚶';

    const li = document.createElement('li');
    li.className = 'escenario-item';
    li.setAttribute('data-id', ubi.id_ubicacion);
    li.setAttribute('data-nombre', ubi.nombre);
    li.setAttribute('data-lat', ubi.latitud);
    li.setAttribute('data-lng', ubi.longitud);
    li.setAttribute('data-dir', ubi.direccion || '');

    // Descripción corta para mostrar debajo del nombre
    let descCorta = ubi.direccion ? ubi.direccion.split(',')[0] : '';
    if (ubi.nombre === 'Casco Antiguo') descCorta = 'Pasacalles · Entierro de la Sardina';
    if (ubi.nombre === 'Recinto Ferial') descCorta = 'Gran Desfile · Desfile Infantil';
    if (ubi.nombre === 'Teatro López de Ayala') descCorta = 'COMBA · Concurso de Murgas';

    li.innerHTML = `
      <span class="esc-icon">${icono}</span>
      <div>
        <strong>${ubi.nombre}</strong>
        <span>${descCorta}</span>
      </div>
    `;

    // Evento click en el elemento de la lista
    li.addEventListener('click', () => {
      // Quitar clase activa de todos los elementos
      document.querySelectorAll('.escenario-item').forEach(item => item.classList.remove('escenario-item--active'));
      li.classList.add('escenario-item--active');

      // Centrar mapa y mostrar InfoWindow
      centrarMapaEnUbicacion(
        ubi.id_ubicacion,
        ubi.nombre,
        parseFloat(ubi.latitud),
        parseFloat(ubi.longitud),
        ubi.direccion || 'Ubicación carnavalera'
      );

      // Actualizar el panel de información lateral (escenario-info)
      document.getElementById('esc-title').innerHTML = `${icono} ${ubi.nombre}`;
      document.getElementById('esc-desc').innerHTML = ubi.direccion || 'Escenario del Carnaval de Badajoz';
      document.getElementById('esc-tag').innerHTML = 'Ubicación';
    });

    container.appendChild(li);
  });

  // Seleccionar el primer escenario por defecto
  if (container.firstChild && ubicacionesList.length > 0) {
    const primera = ubicacionesList[0];
    container.firstChild.classList.add('escenario-item--active');
    let icono = '📍';
    if (primera.nombre.includes('Teatro')) icono = '🎭';
    else if (primera.nombre.includes('Recinto')) icono = '🎪';
    centrarMapaEnUbicacion(
      primera.id_ubicacion,
      primera.nombre,
      parseFloat(primera.latitud),
      parseFloat(primera.longitud),
      primera.direccion || 'Ubicación carnavalera'
    );
    document.getElementById('esc-title').innerHTML = `${icono} ${primera.nombre}`;
    document.getElementById('esc-desc').innerHTML = primera.direccion || 'Escenario del Carnaval de Badajoz';
    document.getElementById('esc-tag').innerHTML = 'Ubicación';
  }
}

// Centra el mapa y muestra un InfoWindow con estilo mejorado (fondo oscuro, texto claro)
function centrarMapaEnUbicacion(id, nombre, lat, lng, direccion) {
  if (!map) return;
  map.panTo({ lat, lng });
  map.setZoom(16);

  Object.values(infoWindows).forEach(iw => iw.close());

  // Eliminar marcador anterior si existe (para no acumular)
  if (markers[nombre]) {
    markers[nombre].setMap(null);
  }

  // Crear nuevo marcador
  const marker = new google.maps.Marker({
    position: { lat, lng },
    map: map,
    title: nombre,
    animation: google.maps.Animation.DROP,
    icon: {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 46 46">
          <circle cx="23" cy="23" r="20" fill="#6c3bd1" stroke="#a855f7" stroke-width="3" opacity="0.95"/>
          <text x="23" y="29" text-anchor="middle" font-size="18">📍</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(46, 46),
      anchor: new google.maps.Point(23, 23)
    }
  });

  // InfoWindow con fondo blanco y texto negro
  const info = new google.maps.InfoWindow({
    content: `
    <div style="
      background: white;
      color: black;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      border: 1px solid #ddd;
      max-width: 260px;
      text-align: left;
    ">
      <strong style="color: #6c3bd1; display: block; margin-bottom: 6px; font-size: 1rem;">${nombre}</strong>
      <span style="color: #333; font-size: 12px; line-height: 1.4;">${direccion || ''}</span>
    </div>
  `
  });

  markers[nombre] = marker;
  infoWindows[nombre] = info;

  // Abrir InfoWindow
  info.open(map, marker);
  marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(() => marker.setAnimation(null), 1500);

  // Sincronizar: cuando se haga clic en este marcador, activar el elemento correspondiente en la lista
  marker.addListener('click', () => {
    // Cerrar otros InfoWindows
    Object.values(infoWindows).forEach(iw => iw.close());
    info.open(map, marker);

    // Resaltar en la lista lateral el elemento con el mismo id
    const items = document.querySelectorAll('.escenario-item');
    items.forEach(item => {
      if (item.getAttribute('data-id') == id) {
        item.classList.add('escenario-item--active');
        // Actualizar panel derecho
        const iconSpan = item.querySelector('.esc-icon');
        const icono = iconSpan ? iconSpan.textContent : '📍';
        document.getElementById('esc-title').innerHTML = `${icono} ${nombre}`;
        document.getElementById('esc-desc').innerHTML = direccion || 'Escenario del Carnaval de Badajoz';
        document.getElementById('esc-tag').innerHTML = 'Ubicación';
      } else {
        item.classList.remove('escenario-item--active');
      }
    });

    // Rebote
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(() => marker.setAnimation(null), 1500);
  });
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
      <td>${e.ubicacion?.nombre || '-'}</td>
      <td>
        <button class="admin-action-btn admin-action-btn--edit" onclick="openEditEventModal(${e.id})">Editar</button>
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
  const diaRaw = document.getElementById('new-dia').value;
  if (!diaRaw) { showToast('Selecciona una fecha', true); return; }
  const dia = dateToFechaTexto(diaRaw);
  const hora = document.getElementById('new-hora').value;
  const id_ubicacion = parseInt(document.getElementById('new-escenario').value);
  const desc = document.getElementById('new-desc').value.trim();

  if (!grupo || !dia || !hora) {
    showToast('⚠️ Rellena los campos obligatorios', true);
    return;
  }

  const { data: newEvento, error } = await supabaseAddEvento({
    nombre: grupo,
    categoria, dia, hora, id_ubicacion,
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

// Abrir modal de edición con los datos del evento precargados
function openEditEventModal(id) {
  const e = EVENTOS.find(ev => ev.id === id);
  if (!e) return;
  const fechaDate = fechaTextoToDateInput(e.dia);
  document.getElementById('edit-dia').value = fechaDate;
  document.getElementById('edit-evento-id').value = e.id;
  document.getElementById('edit-grupo').value = e.nombre;
  document.getElementById('edit-categoria').value = e.categoria;
  document.getElementById('edit-dia').value = e.dia;
  document.getElementById('edit-hora').value = e.hora;
  document.getElementById('edit-desc').value = e.descripcion || '';

  // Seleccionar el escenario correcto
  if (e.id_ubicacion) {
    document.getElementById('edit-escenario').value = e.id_ubicacion;
  }

  document.getElementById('modal-edit-evento').classList.add('open');
}

// Guardar cambios del evento editado
async function saveEditEvento() {
  const id = parseInt(document.getElementById('edit-evento-id').value);
  const nombre = document.getElementById('edit-grupo').value.trim();
  const categoria = document.getElementById('edit-categoria').value;
  const diaRaw = document.getElementById('edit-dia').value;
  const dia = dateToFechaTexto(diaRaw);
  const hora = document.getElementById('edit-hora').value;
  const id_ubicacion = parseInt(document.getElementById('edit-escenario').value);
  const descripcion = document.getElementById('edit-desc').value.trim();

  if (!nombre || !dia || !hora) {
    showToast('Rellena los campos obligatorios', true);
    return;
  }

  const { data, error } = await supabaseUpdateEvento(id, {
    nombre, categoria, dia, hora, id_ubicacion,
    descripcion: descripcion || 'Sin descripción.'
  });

  if (error || !data) {
    showToast('Error al guardar cambios: ' + error, true);
    return;
  }

  // Actualizar en el array local
  const idx = EVENTOS.findIndex(ev => ev.id === id);
  if (idx !== -1) EVENTOS[idx] = data;
  filteredEventos = [...EVENTOS];

  renderAdminTable(EVENTOS);
  renderEventos(filteredEventos);

  closeModal('modal-edit-evento');
  showToast('Evento actualizado correctamente');
}

async function loadUbicacionesSelect() {
  const ubicaciones = await supabaseGetUbicaciones();
  const select = document.getElementById('new-escenario');
  if (!select) return;
  select.innerHTML = '';
  ubicaciones.forEach(ubi => {
    const option = document.createElement('option');
    option.value = ubi.id_ubicacion;
    option.textContent = ubi.nombre;
    select.appendChild(option);
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
