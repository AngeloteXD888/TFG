/* ============================================================
   CARNAVAL DE BADAJOZ — App JavaScript
   Author: Ángel Galea Anisa | TFG 2025/2026
   Datos: carnavaldebadajoz.org — Edición 2026
   ============================================================ */

// =====================================================================
// DATOS REALES — Carnaval de Badajoz 2026
// Fuente: https://carnavaldebadajoz.org/
// =====================================================================
const EVENTOS = [
  // MURGAS — COMBA 2026 (Concurso Oficial de Murgas de Badajoz)
  // Gran Final celebrada el viernes 13 de febrero en el Teatro López de Ayala
  { id: 1, nombre: 'Los Camballotas', categoria: 'Murga', dia: 'Vie 14 Feb', hora: '21:00', escenario: 'Teatro López de Ayala', descripcion: '1º Premio del COMBA 2026 con 3317.5 puntos. Murga ganadora del Concurso Oficial de Murgas del Carnaval de Badajoz. Su repertorio satírico y su puesta en escena les hizo merecedores del primer puesto.' },
  { id: 2, nombre: 'Gitano y de Badajó', categoria: 'Murga', dia: 'Jue 13 Feb', hora: '21:00', escenario: 'Teatro López de Ayala', descripcion: '2º Premio del COMBA 2026 con 3168.25 puntos. Una de las murgas más destacadas de la edición, con letras cargadas de humor y crítica social que conectaron con el público badajocense.' },
  { id: 3, nombre: 'Los Water Closet', categoria: 'Murga', dia: 'Mié 12 Feb', hora: '21:00', escenario: 'Teatro López de Ayala', descripcion: '3º Premio del COMBA 2026 con 3130.5 puntos. Murga con una temática original y hilarante que les llevó al podio del concurso oficial.' },
  { id: 4, nombre: 'Marwan Chilliqui', categoria: 'Murga', dia: 'Mar 11 Feb', hora: '21:00', escenario: 'Teatro López de Ayala', descripcion: '4º Premio del COMBA 2026 con 3129.75 puntos. Su nombre ya adelanta el tono irreverente de su actuación. Humor, sátira y una crítica afilada.' },
  { id: 5, nombre: 'Valentín, entrenador infantil', categoria: 'Murga', dia: 'Lun 10 Feb', hora: '21:00', escenario: 'Teatro López de Ayala', descripcion: '5º Premio del COMBA 2026 con 3079.75 puntos. Murga con una temática futbolística muy bien desarrollada que atrajo a un público muy amplio.' },
  { id: 6, nombre: 'Al Maridi', categoria: 'Murga', dia: 'Sáb 08 Feb', hora: '21:00', escenario: 'Teatro López de Ayala', descripcion: '6º Premio del COMBA 2026 con 3033 puntos. Murga que demostró su calidad en el concurso oficial con una actuación muy completa.' },

  // COMPARSAS — Gran Desfile 2026 (Premios oficiales)
  { id: 7, nombre: 'Los Lingotes', categoria: 'Comparsa', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: '1º Premio del Gran Desfile del Carnaval de Badajoz 2026. Comparsa ganadora con una espectacular puesta en escena que dejó sin palabras al jurado y al público.' },
  { id: 8, nombre: 'Las Monjas «La Tribu de Nunca Jamás»', categoria: 'Comparsa', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: '2º Premio del Gran Desfile 2026. Una comparsa que arrasó con su originalidad y trabajo en conjunto, recreando un mundo de fantasía.' },
  { id: 9, nombre: 'Moracantana', categoria: 'Comparsa', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: '3º Premio del Gran Desfile 2026. Comparsa con una temática exótica y un vestuario artesanal de altísima calidad que deslumbró en el Carnaval.' },
  { id: 10, nombre: 'Caribe «Los Engendros del Delirio»', categoria: 'Comparsa', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: '4º Premio del Gran Desfile 2026. Pura alegría caribeña con ritmos tropicales, colorido vestuario y una coreografía vibrante.' },
  { id: 11, nombre: 'La Bullanguera «Taurus Elogium»', categoria: 'Comparsa', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: '5º Premio del Gran Desfile 2026. La Bullanguera llenó de bullicio y fiesta el recorrido del Gran Desfile con una actuación apasionante.' },
  // Accésits comparsas
  { id: 12, nombre: 'Cambalada «O Conxuro Cambalada»', categoria: 'Comparsa', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: 'Accésit 1º del Gran Desfile 2026. Comparsa con temática gallega que destacó también en Estandarte Fijo y Estandarte Móvil.' },
  { id: 13, nombre: 'El Vaivén', categoria: 'Comparsa', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: 'Accésit 2º del Gran Desfile 2026. Comparsa con puesta en escena llena de energía y un vestuario muy cuidado.' },
  { id: 14, nombre: 'Los Tukanes «La Mascletá»', categoria: 'Comparsa', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: 'Accésit 3º del Gran Desfile 2026. Temática fallera con colores brillantes y coreografía explosiva.' },
  { id: 15, nombre: 'La Pava and Company', categoria: 'Comparsa', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: 'Accésit 4º del Gran Desfile 2026. Una comparsa con estilo propio que siempre sorprende en el Carnaval de Badajoz.' },
  { id: 16, nombre: 'Dekebais', categoria: 'Comparsa', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: 'Accésit 5º del Gran Desfile 2026. Comparsa participante en el Gran Desfile del Carnaval de Badajoz.' },
  { id: 17, nombre: 'Caretos Salvavidas «Oceanía»', categoria: 'Comparsa', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: 'Accésit 6º del Gran Desfile 2026. Diploma en Estandarte Fijo y Estandarte Móvil. Temática oceánica espectacular.' },
  { id: 18, nombre: 'Umsuka Imbali', categoria: 'Comparsa', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: 'Accésit 7º del Gran Desfile 2026. 1er Premio en Estandarte Móvil. Comparsa de raíz africana con una puesta en escena impresionante.' },
  { id: 19, nombre: 'Los Pirulfos', categoria: 'Comparsa', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: 'Accésit 8º del Gran Desfile 2026. Comparsa veterana del Carnaval de Badajoz con fieles seguidores.' },
  { id: 20, nombre: 'Meraki', categoria: 'Comparsa', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: 'Accésit del Gran Desfile 2026. 2º puesto compartido en Estandarte Móvil. Comparsa con alma y pasión carnavalera.' },
  { id: 21, nombre: 'Vendaval «Heraldos del Sol»', categoria: 'Comparsa', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: 'Accésit del Gran Desfile 2026. Diploma en Estandarte Fijo. Temática solar con vestuario artesanal brillante.' },
  { id: 22, nombre: 'Wailuku «Cyberpunk 35 Aniversario»', categoria: 'Comparsa', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: 'Accésit del Gran Desfile 2026. Comparsa veterana que celebra su 35 aniversario con una temática futurista.' },
  { id: 23, nombre: 'Achiweyba «Los Bridgerton»', categoria: 'Comparsa', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: 'Accésit 20º del Gran Desfile 2026. Temática inspirada en la famosa serie de televisión.' },

  // ARTEFACTOS — Gran Desfile 2026
  { id: 24, nombre: 'El Arte-Facto «Los Hijos del Fuego»', categoria: 'Artefacto', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: '1º Premio en Artefactos del Gran Desfile 2026. Un espectáculo de fuego, luz y movimiento que impresionó a todo el público badajocense.' },
  { id: 25, nombre: 'Pues anda que tú, se endiosa', categoria: 'Artefacto', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: '2º Premio en Artefactos del Gran Desfile 2026. Un nombre tan memorable como su actuación, que arrancó carcajadas y aplausos.' },
  { id: 26, nombre: 'Trimoto «No me toques los elfos»', categoria: 'Artefacto', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: '3º Premio en Artefactos 2026. Un artefacto motorizado con temática fantástica que sorprendió por su originalidad.' },
  { id: 27, nombre: 'Los Curabachas del Nilo', categoria: 'Artefacto', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: 'Diploma en Artefactos del Gran Desfile 2026. Temática egipcia muy llamativa y creativa.' },
  { id: 28, nombre: 'El Gallinero «Birmingham»', categoria: 'Artefacto', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: 'Diploma en Artefactos del Gran Desfile 2026. Propuesta animada e ingeniosa que mezcló lo cotidiano con la fantasía.' },
  { id: 29, nombre: 'Los Ociosos vienen furiosos', categoria: 'Artefacto', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: 'Diploma en Artefactos del Gran Desfile 2026. Artefacto con mucha energía y humor carnavalero.' },

  // GRUPOS DE ANIMACIÓN — Gran Desfile 2026
  { id: 30, nombre: 'Chalchimpapas «El Musical»', categoria: 'Grupo Animación', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: '1º Premio en Grupos de Animación del Gran Desfile 2026. Un espectáculo musical que animó a todo el público del recorrido.' },
  { id: 31, nombre: 'Los Pegabotes', categoria: 'Grupo Animación', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: '2º Premio en Grupos de Animación del Gran Desfile 2026. Grupo con mucha energía y diversión contagiosa.' },
  { id: 32, nombre: 'La Peña de los 3 Cubatas', categoria: 'Grupo Animación', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: '3º Premio en Grupos de Animación del Gran Desfile 2026. Un grupo que derrochó fiesta, humor y compañerismo.' },
  { id: 33, nombre: 'Churrería Los Desastres Extraordinarios', categoria: 'Grupo Animación', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: 'Diploma en Grupos de Animación 2026. Un nombre que lo dice todo: extraordinarios a su manera.' },
  { id: 34, nombre: 'Si se quiere se puede', categoria: 'Grupo Animación', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: 'Diploma en Grupos de Animación del Gran Desfile 2026. Grupo con un mensaje positivo y mucho ánimo carnavalero.' },
  { id: 35, nombre: 'Dekefuistis', categoria: 'Grupo Animación', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: 'Diploma en Grupos de Animación del Gran Desfile 2026. Grupo participante en el Carnaval de Badajoz.' },
  { id: 36, nombre: 'Baluarte Carnavalero', categoria: 'Grupo Animación', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: 'Diploma en Grupos de Animación del Gran Desfile 2026. Grupo con espíritu carnavalero auténtico.' },

  // DESFILES — Carnaval de Badajoz 2026
  { id: 37, nombre: 'Gran Desfile del Carnaval', categoria: 'Desfile', dia: 'Dom 16 Feb', hora: '17:00', escenario: 'Recinto Ferial', descripcion: 'El evento más multitudinario del Carnaval de Badajoz, declarado Fiesta de Interés Turístico Internacional. Más de 30.000 espectadores y decenas de agrupaciones desfilan por el Recinto Ferial.' },
  { id: 38, nombre: 'Desfile Infantil', categoria: 'Desfile', dia: 'Sáb 15 Feb', hora: '11:00', escenario: 'Recinto Ferial', descripcion: 'El desfile de los más pequeños. Los niños de la ciudad lucen sus disfraces en el Gran Desfile Infantil, el más entrañable del Carnaval de Badajoz.' },
  { id: 39, nombre: 'Desfile del Entierro de la Sardina', categoria: 'Desfile', dia: 'Lun 17 Feb', hora: '18:00', escenario: 'Casco Antiguo', descripcion: 'El emotivo y festivo cierre del Carnaval de Badajoz. El Entierro de la Sardina recorre las calles del centro histórico dando el último adiós al Carnaval.' },
  { id: 40, nombre: 'Pasacalles Majara', categoria: 'Desfile', dia: 'Vie 14 Feb', hora: '00:30', escenario: 'Casco Antiguo', descripcion: 'El famoso pasacalles nocturno del Carnaval. Miles de personas recorren disfrazadas las calles del centro histórico en la noche más loca del Carnaval.' },
  { id: 41, nombre: 'Desfile de Despedida', categoria: 'Desfile', dia: 'Lun 17 Feb', hora: '20:00', escenario: 'Casco Antiguo', descripcion: 'El Desfile de Despedida del Carnaval de Badajoz 2026. Las agrupaciones recorren el centro para dar el último adiós a esta edición histórica.' },
];

// =====================================================================
// ESCENARIOS CON COORDENADAS REALES DE BADAJOZ
// =====================================================================
const ESCENARIO_DATA = {
  recinto: {
    title: '🎪 Recinto Ferial',
    desc: 'El mayor escenario del Carnaval. Sede del Gran Desfile del Carnaval y del Desfile Infantil. Capacidad para más de 30.000 espectadores.',
    tag: 'Principal — Gran Desfile',
    lat: 38.8655,
    lng: -6.9825
  },
  teatro: {
    title: '🎭 Teatro López de Ayala',
    desc: 'Sede del COMBA, el Concurso Oficial de Murgas del Carnaval de Badajoz. Aquí se celebran las preliminares, semifinales y la Gran Final del concurso.',
    tag: 'COMBA — Concurso de Murgas',
    lat: 38.8796,
    lng: -6.9708
  },
  casco: {
    title: '🏘️ Casco Antiguo',
    desc: 'Las calles del casco histórico se transforman en escenarios improvisados. Aquí se celebran los pasacalles más populares y el Entierro de la Sardina.',
    tag: 'Pasacalles — Entierro de la Sardina',
    lat: 38.8810,
    lng: -6.9730
  },
};

// =====================================================================
// GOOGLE MAPS API KEY
// =====================================================================
const GOOGLE_MAPS_API_KEY = 'AIzaSyC10qy-WNqjCRyn5633_vbnrnBL5dQiKUc';

// =====================================================================
// ESTADO GLOBAL
// =====================================================================
let favoritos = JSON.parse(localStorage.getItem('cbdj-favoritos') || '[]');
let currentSection = 'inicio';
let filteredEventos = [...EVENTOS];
let map = null;
let markers = {};
let infoWindows = {};
let currentUser = null;
let comments = JSON.parse(localStorage.getItem('cbdj-comments') || '{}');

// =====================================================================
// INICIALIZACIÓN
// =====================================================================
document.addEventListener('DOMContentLoaded', () => {
  // ---- Leer sesión de usuario ----
  const storedUser = localStorage.getItem('cbdj-user');
  if (!storedUser) {
    // No hay sesión, redirigir al login
    window.location.href = 'auth.html';
    return;
  }
  currentUser = JSON.parse(storedUser);

  // ---- Configurar UI según rol ----
  setupUserUI();

  renderUpcomingList();
  renderEventos(EVENTOS);
  renderFavoritos();
  renderAdminTable(EVENTOS);
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
function logout() {
  localStorage.removeItem('cbdj-user');
  window.location.href = 'auth.html';
}

// =====================================================================
// GOOGLE MAPS — INICIALIZACIÓN
// =====================================================================
function initMap() {
  const badajozCenter = { lat: 38.8780, lng: -6.9760 };

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

  // Crear marcadores para cada escenario
  const icons = {
    recinto: '🎪',
    teatro: '🎭',
    casco: '🏘️',
  };

  Object.keys(ESCENARIO_DATA).forEach(key => {
    const esc = ESCENARIO_DATA[key];
    const position = { lat: esc.lat, lng: esc.lng };

    // Marcador
    const marker = new google.maps.Marker({
      position,
      map,
      title: esc.title.replace(/^[^\s]+\s/, ''), // quitar el emoji
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="#6c3bd1" stroke="#a855f7" stroke-width="3" opacity="0.9"/>
            <text x="20" y="26" text-anchor="middle" font-size="16">${icons[key]}</text>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20),
      },
      animation: google.maps.Animation.DROP,
    });

    // InfoWindow
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding:8px;max-width:250px;font-family:'Outfit',sans-serif;color:#1d1d2e">
          <h3 style="margin:0 0 6px;font-size:15px">${esc.title}</h3>
          <p style="margin:0 0 6px;font-size:13px;color:#555">${esc.desc}</p>
          <span style="display:inline-block;padding:3px 8px;background:#6c3bd1;color:white;border-radius:10px;font-size:11px">${esc.tag}</span>
        </div>
      `
    });

    marker.addListener('click', () => {
      // Cerrar todas las ventanas
      Object.values(infoWindows).forEach(iw => iw.close());
      infoWindow.open(map, marker);
      selectEscenariByKey(key);
    });

    markers[key] = marker;
    infoWindows[key] = infoWindow;
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
      map.setCenter({ lat: 38.8780, lng: -6.9760 });
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
// FAVORITOS
// =====================================================================
function toggleFav(id, btn) {
  const idx = favoritos.indexOf(id);
  if (idx === -1) {
    favoritos.push(id);
    btn.textContent = '❤️';
    btn.classList.add('active');
    showToast('❤️ Añadido a favoritos');
  } else {
    favoritos.splice(idx, 1);
    btn.textContent = '🤍';
    btn.classList.remove('active');
    showToast('💔 Eliminado de favoritos');
  }
  localStorage.setItem('cbdj-favoritos', JSON.stringify(favoritos));
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
// SISTEMA DE COMENTARIOS
// =====================================================================
function saveComments() {
  localStorage.setItem('cbdj-comments', JSON.stringify(comments));
}

function addComment(eventoId) {
  const input = document.getElementById(`comment-input-${eventoId}`);
  if (!input) return;
  const text = input.value.trim();
  if (!text) {
    showToast('⚠️ Escribe un comentario antes de publicar', true);
    return;
  }

  if (!comments[eventoId]) comments[eventoId] = [];

  const newComment = {
    id: 'c' + Date.now() + Math.random().toString(36).substr(2, 5),
    user: currentUser ? currentUser.name : 'Anónimo',
    email: currentUser ? currentUser.email : '',
    text: text,
    date: new Date().toISOString()
  };

  comments[eventoId].push(newComment);
  saveComments();
  input.value = '';
  renderComments(eventoId);
  showToast('💬 Comentario publicado');
}

function deleteComment(eventoId, commentId) {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('⛔ Solo el administrador puede eliminar comentarios', true);
    return;
  }

  if (!comments[eventoId]) return;
  comments[eventoId] = comments[eventoId].filter(c => c.id !== commentId);
  if (comments[eventoId].length === 0) delete comments[eventoId];
  saveComments();
  renderComments(eventoId);
  renderModerationPanel();
  showToast('🗑️ Comentario eliminado');
}

function renderComments(eventoId) {
  const container = document.getElementById(`comments-list-${eventoId}`);
  const countEl = document.getElementById(`comments-count-${eventoId}`);
  if (!container) return;

  const eventComments = comments[eventoId] || [];
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
    const date = new Date(c.date);
    const timeStr = date.toLocaleDateString('es-ES', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    const initial = c.user.charAt(0).toUpperCase();
    return `
      <div class="comment-item" id="comment-${c.id}">
        <div class="comment-avatar">${initial}</div>
        <div class="comment-body">
          <div class="comment-header">
            <strong class="comment-user">${c.user}</strong>
            <span class="comment-date">${timeStr}</span>
          </div>
          <p class="comment-text">${escapeHtml(c.text)}</p>
        </div>
        ${isAdmin ? `<button class="comment-delete-btn" onclick="event.stopPropagation(); deleteComment(${eventoId}, '${c.id}')" title="Eliminar comentario">🗑️</button>` : ''}
      </div>`;
  }).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// =====================================================================
// PANEL DE MODERACIÓN (Admin)
// =====================================================================
function renderModerationPanel() {
  const container = document.getElementById('moderation-list');
  const countEl = document.getElementById('moderation-count');
  if (!container) return;

  // Recoger todos los comentarios de todos los eventos
  const allComments = [];
  Object.keys(comments).forEach(eventoId => {
    const evento = EVENTOS.find(e => e.id === parseInt(eventoId));
    (comments[eventoId] || []).forEach(c => {
      allComments.push({ ...c, eventoId: parseInt(eventoId), eventoName: evento ? evento.nombre : 'Evento #' + eventoId });
    });
  });

  // Ordenar por fecha descendente
  allComments.sort((a, b) => new Date(b.date) - new Date(a.date));

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
    const date = new Date(c.date);
    const timeStr = date.toLocaleDateString('es-ES', {
      day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit'
    });
    return `
      <div class="moderation-item">
        <div class="moderation-item-info">
          <div class="moderation-item-top">
            <strong>${c.user}</strong>
            <span class="moderation-event-tag">📌 ${c.eventoName}</span>
          </div>
          <p class="moderation-item-text">${escapeHtml(c.text)}</p>
          <span class="moderation-item-date">${timeStr}</span>
        </div>
        <button class="admin-action-btn admin-action-btn--del" onclick="deleteComment(${c.eventoId}, '${c.id}')">Eliminar</button>
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

function deleteEventAdmin(id, btn) {
  const row = btn.closest('tr');
  row.style.opacity = '0';
  row.style.transition = 'opacity .3s';
  setTimeout(() => row.remove(), 350);
  showToast('🗑️ Evento eliminado');
  document.getElementById('admin-total-eventos').textContent =
    parseInt(document.getElementById('admin-total-eventos').textContent) - 1;
}

function openAddEventModal() {
  document.getElementById('modal-add-evento').classList.add('open');
}

function addEventFromAdmin() {
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

  const newEvento = {
    id: EVENTOS.length + 1,
    nombre: grupo,
    categoria, dia, hora, escenario,
    descripcion: desc || 'Sin descripción.'
  };

  EVENTOS.unshift(newEvento);
  renderAdminTable(EVENTOS);
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
