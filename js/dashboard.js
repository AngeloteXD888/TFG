/* ============================================================
   CARNAVAL DE BADAJOZ — App JavaScript
   Author: Ángel Galea Anisa | TFG 2025/2026
   Datos: carnavaldebadajoz.org — Edición 2026
   ============================================================ */

// =====================================================================
// DATOS REALES — Carnaval de Badajoz 2026
// =====================================================================
let EVENTOS = [];

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

// Evita errores por ESCENARIO_DATA no definido
const ESCENARIO_DATA = {};

// =====================================================================
// FUNCIÓN PARA GENERAR SVG
// =====================================================================
function getSvgIcon(tipo, className = 'icon-svg') {
  const baseClass = className;
  switch (tipo) {
    case 'chat':
      return `<svg class="${baseClass}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>`;
    case 'map':
      return `<svg class="${baseClass}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" /></svg>`;
    case 'calendar':
      return `<svg class="${baseClass}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>`;
    case 'trash':
      return `<svg class="${baseClass}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>`;
    case 'home':
      return `<svg class="${baseClass}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>`;
    case 'shield':
      return `<svg class="${baseClass}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>`;
    case 'pin':
      return `<svg class="${baseClass}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>`;
    case 'logout':
      return `<svg class="${baseClass}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>`;
    case 'users':
      return `<svg class="${baseClass}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>`;
    case 'heart-outline':
      return `<svg class="${baseClass}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>`;
    case 'heart-solid':
      return `<svg class="${baseClass}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" /></svg>`;
    case 'calendar-alt':
      return `<svg class="${baseClass}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" /></svg>`;
    case 'pencil':
      return `<svg class="${baseClass}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>`;
    case 'check':
      return `<svg class="${baseClass}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>`;
    default:
      return '';
  }
}

// =====================================================================
// FILTRO DE PALABRAS PROHIBIDAS
// =====================================================================
const PALABRAS_PROHIBIDAS = [
  // Insultos graves y groserías comunes
  'puta', 'puto', 'putamadre', 'puta madre', 'joder', 'cojones', 'coño', 'cabrón', 'cabrona',
  'gilipollas', 'capullo', 'mierda', 'cagar', 'cagada', 'cagaste', 'cagado', 'cagona', 'cagon',
  'subnormal', 'idiota', 'imbécil', 'estúpido', 'tarado', 'retrasado', 'tontolaba', 'tonto del culo',
  'hijo de puta', 'hija de puta', 'zorra', 'perra', 'maricón', 'marica', 'bollera', 'tortillera',
  'follame', 'chinga', 'verga', 'carajo', 'pendejo', 'wey', 'guey', 'culiao', 'conchetumare',
  'mongolo', 'mongólica', 'mongolico', 'mongolito', 'disminuido', 'deficiente', 'enfermo mental',
  'enferma mental', 'psiquiátrico', 'loquito', 'loquita', 'basura', 'escoria', 'malparido',
  'malparida', 'soplapollas', 'pringao', 'pringado', 'pelele', 'inútil', 'incompetente',
  'fracasado', 'fracasada', 'cabronazo', 'cabroncete', 'gilipuertas', 'gilipollín', 'capullín',
  'capullito', 'cojonudo', 'cojonuda', 'cojonazos', 'mamada', 'mamadas', 'chupapollas', 'chupapija',
  'chupar polla', 'chupar pija', 'comepollas', 'concha tu madre', 'conchatumadre', 'la reputa madre',
  'reputa', 'reputísima', 'putísima', 'puto amo', 'puta amo', 'sudaca', 'panchito', 'negro de mierda',
  'indio', 'moro', 'morito', 'moraco', 'fascista', 'nazi', 'facha', 'progre de mierda', 'rojo',
  'comunista de mierda', 'marimacho', 'marimacha', 'camionera', 'bujarra', 'bujarrón', 'analfabeto',
  'analfabeta', 'zopenco', 'zopenca', 'zoquete', 'botarate', 'memo', 'mema', 'lelo', 'lela', 'simple',
  'soplagaitas', 'papanatas', 'cenutrio', 'cenutria', 'cara culo', 'cara de verga', 'cara de pija',
  'huevón', 'huevona', 'güevón', 'güevona', 'boludo', 'boluda', 'pelotudo', 'pelotuda', 'choto',
  'chota', 'pedazo de mierda', 'pedazo de gilipollas', 'pedazo de cabrón', 'hijo de la gran puta',
  'me cago en', 'cago en', 'caguen en', 'cagüen', 'recontra', 'requete', 'imbecil', 'imbećil',
  'estupido', 'estupida', 'retrasado', 'retrasada', 'tarada', 'idiotizado', 'pendejada', 'gilipollez',
  'cojonudo', 'puñeta', 'ostia', 'hostia', 'me cago en dios', 'me cago en la hostia', 'la hostia',
  'puto amo', 'puta vida', 'puta mierda', 'hijueputa', 'hijueputas', 'mariconazo', 'maricona',
  'mariquita', 'mariquita', 'bollera', 'bujarra', 'camionero', 'camionera', 'cazurro', 'cazurra',
  'necio', 'necia', 'bruto', 'bruta', 'bestia', 'bestia', 'cerdo', 'cerda', 'chancho', 'chancha',
  'culear', 'culeado', 'culeada', 'chingar', 'chingado', 'chingada', 'follar', 'follado', 'follada',
  'coger', 'cogido', 'cogida', 'cojer', 'cojido', 'cojida', 'pito', 'pija', 'teta', 'tetas', 'culo',
  'nalgas', 'culo sucio', 'muerde almohada', 'come mierda', 'comepollas', 'chupamedias', 'lamebotas',
  'lameculos', 'soplaculos', 'tragasables', 'tragaleches', 'saca leche', 'saca mierda', 'tonto', 'tonta', 'tontos', 'tontas', 'gilipichis'
];

function contienePalabrotas(texto) {
  // Normalizar: minúsculas, eliminar tildes, convertir números comunes a letras
  let textoLower = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // Reemplazar caracteres comunes de evasión
  textoLower = textoLower
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/@/g, 'a')
    .replace(/[$]/g, 's')
    .replace(/[+]/g, 't')
    .replace(/[#]/g, 'h');
  
  return PALABRAS_PROHIBIDAS.some(palabra => {
    const palabraLower = palabra.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    // Detectar palabra completa o con espacios/separadores
    return textoLower.includes(palabraLower);
  });
}
// Convierte "2026-02-13" a "Jue 13 Feb"
function dateToFechaTexto(fechaISO) {
  if (!fechaISO) return '';
  const fecha = new Date(fechaISO);
  const opciones = { weekday: 'short', day: 'numeric', month: 'short' };
  let fechaTexto = fecha.toLocaleDateString('es-ES', opciones);
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
  // ---- Verificar sesión con Supabase ----
  try {
    const { user, perfil } = await supabaseGetUser();

    if (!user) {
      currentUser = null;
      setupUserUI();
    } else {
      let userPerfil = perfil;
      if (user && !userPerfil) {
        const isAnonymous = user.app_metadata?.provider === 'anon';
        const nombre = isAnonymous ? 'Invitado' : (user.user_metadata?.full_name || user.email.split('@')[0]);
        const rol = isAnonymous ? 'anonimo' : 'usuario';
        const { error: insertError } = await supabaseClient
          .from('persona')
          .insert([{
            id_persona: user.id,
            nombre: nombre,
            email: isAnonymous ? null : user.email,
            contrasena: isAnonymous ? 'anonimo' : 'oauth',
            fecha_registro: new Date().toISOString(),
            rol: rol
          }]);

        if (!insertError) {
          const { data: nuevoPerfil } = await supabaseClient
            .from('persona')
            .select('*')
            .eq('id_persona', user.id)
            .single();
          userPerfil = nuevoPerfil;
        }
      }

    if (userPerfil) {
      currentUser = {
        id: user.id,
        name: userPerfil.nombre,
        email: user.email,
        role: userPerfil.rol,
        avatar: userPerfil.avatar_url || null
      };
      localStorage.setItem('cbdj-user', JSON.stringify(currentUser));
    } else {
        currentUser = null;
      }
      setupUserUI();
    }
  } catch (err) {
    console.warn('Error al verificar sesión con Supabase:', err);
    currentUser = null;
    setupUserUI();
  }

  // ---- Cargar datos iniciales ----
  EVENTOS = await supabaseGetEventos();
  ubicacionesList = await supabaseGetUbicaciones();
  filteredEventos = [...EVENTOS];
  const totalAgrupaciones = await supabaseGetTotalAgrupaciones();
  const totalDias = 10;
  const totalEscenarios = await supabaseGetTotalEscenarios();
  document.getElementById('stat-agrupaciones').textContent = totalAgrupaciones;
  document.getElementById('stat-dias').textContent = totalDias;
  document.getElementById('stat-escenarios').textContent = totalEscenarios;

  renderUpcomingList();
  renderEventos(EVENTOS);
  renderAdminTable(EVENTOS);
  updateFavBadge();
  updateStatFav();
  loadUbicacionesSelect();

  // ---- Cargar favoritos solo si está autenticado ----
  if (currentUser && currentUser.id && currentUser.role !== 'anonimo') {
    try {
      favoritos = await supabaseGetFavoritos(currentUser.id);
    } catch (err) {
      console.warn('Error cargando favoritos de Supabase:', err);
      favoritos = [];
    }
  } else {
    favoritos = [];
  }
  renderFavoritos();
  updateFavBadge();
  updateStatFav();

  // ---- Configurar mapa ----
  if (typeof map !== 'undefined' && map) {
    crearTodosLosMarcadores();
  } else {
    const checkMap = setInterval(() => {
      if (map) {
        clearInterval(checkMap);
        crearTodosLosMarcadores();
      }
    }, 100);
  }
  renderEscenariosList();

  // ---- Poblar filtro de escenarios en sección Programa ----
  loadFilterEscenarioSelect();

  // ---- Actualizar panel de administración ----
  const adminTotalEventos = document.getElementById('admin-total-eventos');
  if (adminTotalEventos) adminTotalEventos.textContent = EVENTOS.length;

  const totalUsuarios = await supabaseGetTotalUsuarios();
  const adminTotalUsuarios = document.getElementById('admin-total-usuarios');
  if (adminTotalUsuarios) adminTotalUsuarios.textContent = totalUsuarios;

  const adminTotalAgrupaciones = document.getElementById('admin-total-agrupaciones');
  if (adminTotalAgrupaciones) adminTotalAgrupaciones.textContent = totalAgrupaciones;

  if (currentUser && currentUser.role === 'admin') renderModerationPanel();
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
  const logoutBtn = document.querySelector('.logout-btn');

  if (!currentUser) {
    if (navAdmin) navAdmin.style.display = 'none';
    if (userAvatar) {
      userAvatar.textContent = '?';
      userAvatar.style.backgroundImage = '';
      userAvatar.style.background = 'rgba(255,255,255,0.1)';
    }
    if (userName) userName.textContent = 'Invitado';
    if (userRole) {
      userRole.textContent = 'Sin registro';
      userRole.style.color = 'var(--text-muted)';
    }
    if (topbarAvatar) topbarAvatar.textContent = '?';
    if (logoutBtn) {
      logoutBtn.classList.add('login-btn');
      logoutBtn.title = 'Iniciar sesión';
      logoutBtn.onclick = () => window.location.href = 'auth.html';
      logoutBtn.innerHTML = `<svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H3.75" /></svg>`;
    }
    return;
  }

  if (navAdmin) {
    if (currentUser.role === 'admin') navAdmin.style.display = '';
    else navAdmin.style.display = 'none';
  }

  const initial = currentUser.name.charAt(0).toUpperCase();
  if (userName) userName.textContent = currentUser.name;
  if (userRole) {
    if (currentUser.role === 'admin') {
      userRole.textContent = 'Administrador';
      userRole.style.color = '#f59e0b';
    } else if (currentUser.role === 'anonimo') {
      userRole.textContent = 'Invitado';
      userRole.style.color = 'var(--text-muted)';
    } else {
      userRole.textContent = 'Usuario';
      userRole.style.color = '';
    }
  }

  // Avatar: imagen o inicial
  if (userAvatar) {
    if (currentUser.avatar) {
      userAvatar.style.backgroundImage = `url(${currentUser.avatar})`;
      userAvatar.style.backgroundSize = 'cover';
      userAvatar.style.backgroundPosition = 'center';
      userAvatar.textContent = '';
    } else {
      userAvatar.style.backgroundImage = '';
      userAvatar.textContent = initial;
    }
  }

  if (topbarAvatar) {
    if (currentUser.avatar) {
      topbarAvatar.style.backgroundImage = `url(${currentUser.avatar})`;
      topbarAvatar.style.backgroundSize = 'cover';
      topbarAvatar.style.backgroundPosition = 'center';
      topbarAvatar.textContent = '';
    } else {
      topbarAvatar.style.backgroundImage = '';
      topbarAvatar.textContent = initial;
    }
  }

  // Si el usuario es anónimo, el botón de logout se convierte en botón de login
  if (currentUser.role === 'anonimo') {
    if (logoutBtn) {
      logoutBtn.classList.add('login-btn');
      logoutBtn.title = 'Iniciar sesión';
      logoutBtn.onclick = () => window.location.href = 'auth.html';
      logoutBtn.innerHTML = `<svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H3.75" /></svg>`;
    }
  } else {
    if (logoutBtn) logoutBtn.classList.remove('login-btn');
  }
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
// MODO ANÓNIMO — Protección de funciones de registro
// =====================================================================
function requireAuth(featureMsg = 'Esta función') {
  if (currentUser && currentUser.id && currentUser.role !== 'anonimo') return true;
  if (currentUser && currentUser.role === 'anonimo') {
    showToast(`🔒 ${featureMsg} solo para usuarios registrados. ¡Crea una cuenta gratis!`, true);
    const modal = document.getElementById('modal-require-auth');
    const msgEl = document.getElementById('require-auth-feature');
    if (msgEl) msgEl.textContent = featureMsg;
    if (modal) modal.classList.add('open');
    return false;
  }
  // Sin ningún tipo de usuario
  const modal = document.getElementById('modal-require-auth');
  const msgEl = document.getElementById('require-auth-feature');
  if (msgEl) msgEl.textContent = featureMsg;
  if (modal) modal.classList.add('open');
  return false;
}

// =====================================================================
// GOOGLE MAPS — INICIALIZACIÓN
// =====================================================================
function initMap() {
  const badajozCenter = { lat: 38.8794, lng: -6.9705 };
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
      { featureType: 'transit', stylers: [{ visibility: 'off' }] }
    ]
  });
  markers = {};
  infoWindows = {};
}

function crearTodosLosMarcadores() {
  if (!map || !ubicacionesList.length) return;
  Object.values(markers).forEach(m => m.setMap(null));
  markers = {};
  infoWindows = {};

  ubicacionesList.forEach(ubi => {
    const lat = parseFloat(ubi.latitud);
    const lng = parseFloat(ubi.longitud);
    if (isNaN(lat) || isNaN(lng)) return;

    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: map,
      title: ubi.nombre,
      animation: google.maps.Animation.DROP,
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><defs><filter id="shadow"><feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.5"/></filter></defs><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#7c3aed" stroke="#a855f7" stroke-width="1.5" filter="url(#shadow)"/><circle cx="12" cy="9" r="3" fill="white"/></svg>`)}`,
        scaledSize: new google.maps.Size(48, 48),
        anchor: new google.maps.Point(24, 48)
      }
    });

    const info = new google.maps.InfoWindow({
      content: `<div style="background: white; color: black; padding: 12px 16px; border-radius: 8px; font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 500; box-shadow: 0 2px 8px rgba(0,0,0,0.15); border: 1px solid #ddd; max-width: 260px; text-align: left;"><strong style="color: #6c3bd1; display: block; margin-bottom: 6px; font-size: 1rem;">${ubi.nombre}</strong><span style="color: #333; font-size: 12px; line-height: 1.4;">${ubi.direccion || ''}</span></div>`
    });

    markers[ubi.nombre] = marker;
    infoWindows[ubi.nombre] = info;

    marker.addListener('click', () => {
      Object.values(infoWindows).forEach(iw => iw.close());
      info.open(map, marker);
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => marker.setAnimation(null), 1500);
      const items = document.querySelectorAll('.escenario-item');
      items.forEach(item => {
        if (item.getAttribute('data-id') == ubi.id_ubicacion) {
          item.classList.add('escenario-item--active');
          document.getElementById('esc-title').innerHTML = `${getSvgIcon('pin')} ${ubi.nombre}`;
          document.getElementById('esc-desc').innerHTML = ubi.direccion || 'Escenario del Carnaval de Badajoz';
          document.getElementById('esc-tag').innerHTML = 'Ubicación';
        } else {
          item.classList.remove('escenario-item--active');
        }
      });
    });
  });

  const bounds = new google.maps.LatLngBounds();
  Object.values(markers).forEach(m => bounds.extend(m.getPosition()));
  map.fitBounds(bounds);
  if (map.getZoom() > 15) map.setZoom(15);
}

// =====================================================================
// MAPA — RECORRIDOS DE DESFILES
// =====================================================================
let polylinesDesfile = [];
let markersDesfile = [];

const RECORRIDOS = {
  granDesfile: { nombre: 'Gran Desfile del Carnaval', color: '#3b82f6', puntos: [ { lat: 38.877820, lng: -6.980364 }, { lat: 38.877125, lng: -6.980139 }, { lat: 38.876416, lng: -6.979994 }, { lat: 38.876044, lng: -6.979760 }, { lat: 38.875916, lng: -6.979631 }, { lat: 38.875698, lng: -6.979406 }, { lat: 38.875442, lng: -6.979141 }, { lat: 38.875145, lng: -6.978807 }, { lat: 38.874965, lng: -6.978580 }, { lat: 38.874678, lng: -6.978250 }, { lat: 38.874469, lng: -6.977804 }, { lat: 38.874318, lng: -6.977492 }, { lat: 38.874104, lng: -6.976998 }, { lat: 38.873805, lng: -6.976281 }, { lat: 38.873274, lng: -6.975034 }, { lat: 38.873212, lng: -6.974366 }, { lat: 38.873159, lng: -6.973454 }, { lat: 38.873126, lng: -6.972998 }, { lat: 38.873055, lng: -6.972933 }, { lat: 38.872998, lng: -6.972830 }, { lat: 38.873060, lng: -6.972711 }, { lat: 38.873114, lng: -6.972688 }, { lat: 38.873193, lng: -6.972726 }, { lat: 38.873241, lng: -6.972794 }, { lat: 38.873316, lng: -6.972800 }, { lat: 38.873397, lng: -6.972800 }, { lat: 38.873639, lng: -6.972788 }, { lat: 38.873864, lng: -6.972784 }, { lat: 38.874089, lng: -6.972775 }, { lat: 38.874474, lng: -6.972766 }, { lat: 38.874623, lng: -6.972763 }, { lat: 38.874848, lng: -6.972743 }, { lat: 38.875193, lng: -6.972716 }, { lat: 38.875256, lng: -6.972690 }, { lat: 38.875343, lng: -6.972640 }, { lat: 38.875491, lng: -6.972544 }, { lat: 38.876019, lng: -6.972191 } ] },
  desfileInfantil: { nombre: 'Desfile Infantil de Comparsas', color: '#ef4444', puntos: [ { lat: 38.873267, lng: -6.972799 }, { lat: 38.873431, lng: -6.972798 }, { lat: 38.873653, lng: -6.972785 }, { lat: 38.873897, lng: -6.972781 }, { lat: 38.874085, lng: -6.972776 }, { lat: 38.874361, lng: -6.972769 }, { lat: 38.874588, lng: -6.972762 }, { lat: 38.874845, lng: -6.972741 }, { lat: 38.875137, lng: -6.972727 }, { lat: 38.875247, lng: -6.972692 }, { lat: 38.875345, lng: -6.972626 }, { lat: 38.875535, lng: -6.972515 }, { lat: 38.875646, lng: -6.972453 }, { lat: 38.875892, lng: -6.972286 }, { lat: 38.876096, lng: -6.972135 }, { lat: 38.876371, lng: -6.971968 }, { lat: 38.876621, lng: -6.971818 }, { lat: 38.876778, lng: -6.971635 } ] },
  entierroSardina: { nombre: 'Entierro de la Sardina', color: '#f97316', puntos: [ { lat: 38.879144, lng: -6.958951 }, { lat: 38.879118, lng: -6.958400 }, { lat: 38.879097, lng: -6.957755 }, { lat: 38.879018, lng: -6.956964 }, { lat: 38.878945, lng: -6.956321 }, { lat: 38.878871, lng: -6.955830 }, { lat: 38.878801, lng: -6.955420 }, { lat: 38.878738, lng: -6.955025 }, { lat: 38.878687, lng: -6.954660 }, { lat: 38.878624, lng: -6.954093 }, { lat: 38.878592, lng: -6.953763 }, { lat: 38.878556, lng: -6.953355 }, { lat: 38.878526, lng: -6.952908 }, { lat: 38.878487, lng: -6.952384 }, { lat: 38.878455, lng: -6.951935 }, { lat: 38.878403, lng: -6.951217 }, { lat: 38.878365, lng: -6.950802 } ] },
  despedida: { nombre: 'Despedida del Carnaval', color: '#a855f7', puntos: [ { lat: 38.870142, lng: -6.981643 }, { lat: 38.870113, lng: -6.981695 }, { lat: 38.870080, lng: -6.981720 }, { lat: 38.869999, lng: -6.981769 }, { lat: 38.869920, lng: -6.981840 }, { lat: 38.869861, lng: -6.981902 }, { lat: 38.869802, lng: -6.981996 }, { lat: 38.869702, lng: -6.982185 }, { lat: 38.869667, lng: -6.982256 }, { lat: 38.869612, lng: -6.982366 }, { lat: 38.869594, lng: -6.982400 }, { lat: 38.869521, lng: -6.982550 }, { lat: 38.869465, lng: -6.982660 }, { lat: 38.869413, lng: -6.982759 }, { lat: 38.869337, lng: -6.982898 }, { lat: 38.869261, lng: -6.983036 }, { lat: 38.869245, lng: -6.983063 }, { lat: 38.869163, lng: -6.983191 }, { lat: 38.869107, lng: -6.983270 }, { lat: 38.869045, lng: -6.983348 }, { lat: 38.868987, lng: -6.983425 }, { lat: 38.868906, lng: -6.983526 }, { lat: 38.868785, lng: -6.983683 }, { lat: 38.868621, lng: -6.983892 }, { lat: 38.868567, lng: -6.983962 }, { lat: 38.868433, lng: -6.984133 }, { lat: 38.868303, lng: -6.984297 }, { lat: 38.868241, lng: -6.984378 }, { lat: 38.868137, lng: -6.984510 }, { lat: 38.868029, lng: -6.984652 }, { lat: 38.867987, lng: -6.984704 }, { lat: 38.867888, lng: -6.984837 }, { lat: 38.867870, lng: -6.984871 }, { lat: 38.867892, lng: -6.984899 }, { lat: 38.868040, lng: -6.985046 }, { lat: 38.868141, lng: -6.985144 }, { lat: 38.868249, lng: -6.985246 }, { lat: 38.868368, lng: -6.985366 }, { lat: 38.868485, lng: -6.985461 }, { lat: 38.868587, lng: -6.985544 }, { lat: 38.868730, lng: -6.985665 }, { lat: 38.868848, lng: -6.985771 }, { lat: 38.868969, lng: -6.985873 } ] }
};

function toggleRecorridoDesfile(tipo) {
  const btnActivo = document.getElementById(`btn-recorrido-${tipo}`);
  const yaActivo = btnActivo.dataset.active === 'true';
  polylinesDesfile.forEach(p => p.setMap(null));
  markersDesfile.forEach(m => m.setMap(null));
  polylinesDesfile = [];
  markersDesfile = [];
  document.querySelectorAll('.btn-recorrido').forEach(b => {
    b.dataset.active = 'false';
    b.style.opacity = '1';
  });
  if (yaActivo) return;
  const recorrido = RECORRIDOS[tipo];
  btnActivo.dataset.active = 'true';
  btnActivo.style.opacity = '0.7';
  const polyline = new google.maps.Polyline({ path: recorrido.puntos, geodesic: true, strokeColor: recorrido.color, strokeOpacity: 0.9, strokeWeight: 6, map: map });
  polylinesDesfile.push(polyline);
  recorrido.puntos.forEach((punto, i) => {
    if (i !== 0 && i !== recorrido.puntos.length - 1) return;
    const esInicio = i === 0;
    const marker = new google.maps.Marker({
      position: punto, map: map,
      icon: { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36"><circle cx="12" cy="12" r="10" fill="${esInicio ? '#22c55e' : recorrido.color}" stroke="white" stroke-width="2.5"/></svg>`)}`, scaledSize: new google.maps.Size(36, 36), anchor: new google.maps.Point(18, 18) }
    });
    const info = new google.maps.InfoWindow({ content: `<div style="font-family:'Outfit',sans-serif;padding:6px 10px;font-weight:600;color:#333;">${esInicio ? '🟢 Salida' : '🏁 Llegada'} — ${recorrido.nombre}</div>` });
    marker.addListener('click', () => info.open(map, marker));
    markersDesfile.push(marker);
  });
  const bounds = new google.maps.LatLngBounds();
  recorrido.puntos.forEach(p => bounds.extend(p));
  map.fitBounds(bounds);
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
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
  if (name === 'favoritos') renderFavoritos();
  if (name === 'admin' && currentUser && currentUser.role === 'admin') renderModerationPanel();
  if (name === 'mapa' && map) {
    setTimeout(() => {
      google.maps.event.trigger(map, 'resize');
      map.setCenter({ lat: 38.8782, lng: -6.9710 });
    }, 100);
  }
}

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
  const items = EVENTOS.filter(e => e.categoria === 'Desfile').slice(0, 5);
  container.innerHTML = items.map(e => `
    <div class="upcoming-item" onclick="openEventoModal(${e.id})">
      <div class="upcoming-time"><div class="uh">${e.hora}</div><div class="ud">${e.dia.split(' ').slice(0, 2).join(' ')}</div></div>
      <div class="upcoming-divider"></div>
      <div class="upcoming-info"><strong>${e.nombre}</strong><span>${getSvgIcon('pin')} ${e.ubicacion?.nombre || 'Sin ubicación'}</span></div>
      <div class="upcoming-cat"><span class="evento-tag tag--${e.categoria.replace(/\s/g, '')}">${e.categoria}</span></div>
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
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted);"><span style="font-size:2.5rem;display:block;margin-bottom:.75rem">🔍</span><p>No hay eventos con estos filtros.</p></div>`;
    return;
  }
  container.innerHTML = eventos.map(e => buildEventoCard(e)).join('');
}

function buildEventoCard(e) {
  const isFav = (currentUser && currentUser.id && currentUser.role !== 'anonimo') ? favoritos.includes(e.id) : false;
  const catClass = e.categoria.replace(/\s/g, '');
  return `
    <div class="evento-card evento-card--${catClass}" onclick="openEventoModal(${e.id})">
      <div class="evento-card-header">
        <span class="evento-title">${e.nombre}</span>
        <button class="fav-btn ${isFav ? 'active' : ''}" title="${isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}" onclick="event.stopPropagation(); toggleFav(${e.id}, this)">${isFav ? getSvgIcon('heart-solid') : getSvgIcon('heart-outline')}</button>
      </div>
      <div class="evento-meta">
        <div class="evento-meta-row">${getSvgIcon('calendar')} ${e.dia}</div>
        <div class="evento-meta-row">${getSvgIcon('pin')} ${e.hora}</div>
        <div class="evento-meta-row">${getSvgIcon('map')} ${e.ubicacion?.nombre || 'Sin ubicación'}</div>
      </div>
      <div class="evento-tags"><span class="evento-tag tag--${catClass}">${e.categoria}</span></div>
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
    return (!cat || e.categoria === cat) && (!dia || e.dia === dia) && (!esc || e.ubicacion?.nombre === esc) && (!search || e.nombre.toLowerCase().includes(search) || e.descripcion.toLowerCase().includes(search));
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
// FAVORITOS (Supabase) — solo usuarios registrados
// =====================================================================
async function toggleFav(id, btn) {
  if (!requireAuth('Guardar favoritos')) return;
  const idx = favoritos.indexOf(id);
  if (idx === -1) {
    favoritos.push(id);
    showToast('Añadido a favoritos');
    await supabaseAddFavorito(currentUser.id, id);
    btn.innerHTML = getSvgIcon('heart-solid');
    btn.classList.add('active');
  } else {
    favoritos.splice(idx, 1);
    showToast('Eliminado de favoritos');
    await supabaseRemoveFavorito(currentUser.id, id);
    btn.innerHTML = getSvgIcon('heart-outline');
    btn.classList.remove('active');
  }
  updateFavBadge();
  updateStatFav();
  if (currentSection === 'favoritos') renderFavoritos();
}

function updateFavBadge() {
  const badge = document.getElementById('fav-badge');
  if (!badge) return;
  let count = 0;
  if (currentUser && currentUser.id && currentUser.role !== 'anonimo') count = favoritos.length;
  badge.textContent = count;
  badge.classList.toggle('visible', count > 0);
}

function updateStatFav() {
  const el = document.getElementById('stat-fav-num');
  if (!el) return;
  let count = 0;
  if (currentUser && currentUser.id && currentUser.role !== 'anonimo') count = favoritos.length;
  el.textContent = count;
}

function renderFavoritos() {
  const container = document.getElementById('favoritos-grid');
  const empty = document.getElementById('fav-empty');
  if (!container) return;
  if (!currentUser || currentUser.id === undefined || currentUser.role === 'anonimo') {
    container.innerHTML = '';
    empty.innerHTML = `
      <h2>Acceso restringido</h2>
      <p>Para usar favoritos, necesitas <strong>registrarte o iniciar sesión</strong>.</p>
      <button class="btn-primary" onclick="window.location.href='auth.html'">Crear cuenta gratis →</button>
    `;
    empty.classList.add('visible');
    return;
  }
  const favEventos = EVENTOS.filter(e => favoritos.includes(e.id));
  if (favEventos.length === 0) {
    container.innerHTML = '';
    empty.innerHTML = `
      <span class="empty-icon">💔</span>
      <h2>No tienes favoritos aún</h2>
      <p>Explora el programa y guarda los eventos que más te interesen.</p>
      <button class="btn-primary" onclick="showSection('programa')">Ver Programa →</button>
    `;
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

  const isFav = (currentUser && currentUser.id && currentUser.role !== 'anonimo') ? favoritos.includes(e.id) : false;
  const catClass = e.categoria.replace(/\s/g, '');
  
  // Calcular avatar del usuario actual para el formulario
  let currentUserAvatarHtml = '';
  if (currentUser) {
    if (currentUser.avatar && currentUser.avatar.trim() !== '') {
      currentUserAvatarHtml = `<div class="comment-form-avatar" style="background-image: url(${currentUser.avatar}); background-size: cover; background-position: center;"></div>`;
    } else {
      const initial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U';
      currentUserAvatarHtml = `<div class="comment-form-avatar">${initial}</div>`;
    }
  } else {
    currentUserAvatarHtml = `<div class="comment-form-avatar">U</div>`;
  }

  const body = document.getElementById('modal-evento-body');
  body.innerHTML = `
    <div class="modal-evento-header">
      <div class="modal-evento-title">${e.nombre}</div>
      <div class="evento-tags" style="margin-bottom:.75rem"><span class="evento-tag tag--${catClass}">${e.categoria}</span></div>
      <div class="modal-evento-meta">
        <div class="modal-evento-meta-row">${getSvgIcon('calendar')} ${e.dia}</div>
        <div class="modal-evento-meta-row">${getSvgIcon('pin')} ${e.hora}</div>
        <div class="modal-evento-meta-row">${getSvgIcon('map')} ${e.ubicacion?.nombre || 'Sin ubicación'}</div>
      </div>
    </div>
    <p class="modal-evento-desc">${e.descripcion}</p>
    <div style="margin-top:1.25rem;">
      <h4 style="font-size:.85rem;font-weight:600;color:var(--text-secondary);margin-bottom:.75rem;text-transform:uppercase;letter-spacing:.05em;">🎭 Agrupaciones participantes</h4>
      <div id="participaciones-list-${e.id}"><p style="color:var(--text-muted);font-size:.85rem">Cargando...</p></div>
    </div>
    <div style="margin-top:1.5rem;display:flex;gap:.75rem;flex-wrap:wrap">
      <button class="btn-primary" onclick="toggleFav(${e.id}, document.getElementById('modal-fav-btn')); updateModalFav(${e.id})" id="modal-fav-btn" style="${isFav ? 'background:linear-gradient(135deg,#991b1b,#ef4444)' : ''}">${isFav ? getSvgIcon('heart-solid') : getSvgIcon('heart-outline')} ${isFav ? 'En favoritos' : 'Añadir a favoritos'}</button>
      <button class="btn-primary" style="background:rgba(59,130,246,0.2);border:1px solid rgba(59,130,246,0.4);color:#60a5fa" onclick="verEnMapa('${e.ubicacion?.nombre || ''}', ${e.id_ubicacion || 0})">${getSvgIcon('map')} Ver en el mapa</button>
    </div>
    <div class="comments-section">
      <div class="comments-header"><h3>${getSvgIcon('chat')} Comentarios</h3><span class="comments-count" id="comments-count-${e.id}">0</span></div>
      <div class="comment-form">
        ${currentUserAvatarHtml}
        <div class="comment-form-input-wrap">
          <textarea id="comment-input-${e.id}" class="comment-textarea" placeholder="Escribe un comentario..." rows="2"></textarea>
          <button class="comment-submit-btn" onclick="addComment(${e.id})">${getSvgIcon('chat')} Publicar</button>
        </div>
      </div>
      <div class="comments-list" id="comments-list-${e.id}"></div>
    </div>
  `;
  renderComments(e.id);
  renderParticipaciones(e.id);
  document.getElementById('modal-evento').classList.add('open');
}

async function verEnMapa(nombreUbicacion, idUbicacion) {
  closeModal('modal-evento');
  let ubicacion = null;
  if (idUbicacion) ubicacion = ubicacionesList.find(u => u.id_ubicacion === idUbicacion);
  if (!ubicacion && nombreUbicacion) ubicacion = ubicacionesList.find(u => u.nombre === nombreUbicacion);
  if (!ubicacion) { showToast('❌ No se encontró la ubicación en el mapa', true); return; }
  showSection('mapa');
  setTimeout(() => {
    if (!map) { showToast('El mapa aún no está listo, inténtalo de nuevo', true); return; }
    google.maps.event.trigger(map, 'resize');
    setTimeout(() => {
      centrarMapaEnUbicacion(ubicacion.id_ubicacion, ubicacion.nombre, parseFloat(ubicacion.latitud), parseFloat(ubicacion.longitud), ubicacion.direccion || 'Ubicación carnavalera');
      const items = document.querySelectorAll('.escenario-item');
      items.forEach(item => {
        if (item.getAttribute('data-id') == ubicacion.id_ubicacion) {
          item.classList.add('escenario-item--active');
          const iconSpan = item.querySelector('.esc-icon');
          const icono = iconSpan ? iconSpan.textContent : '📍';
          document.getElementById('esc-title').innerHTML = `${icono} ${ubicacion.nombre}`;
          document.getElementById('esc-desc').innerHTML = ubicacion.direccion || 'Escenario del Carnaval de Badajoz';
          document.getElementById('esc-tag').innerHTML = 'Ubicación';
        } else item.classList.remove('escenario-item--active');
      });
      if (window.innerWidth <= 768) document.getElementById('google-map')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }, 150);
}

function updateModalFav(id) {
  const btn = document.getElementById('modal-fav-btn');
  const isFav = favoritos.includes(id);
  btn.textContent = isFav ? '❤️ En favoritos' : '🤍 Añadir a favoritos';
  btn.style.background = isFav ? 'linear-gradient(135deg,#991b1b,#ef4444)' : '';
}

// =====================================================================
// PARTICIPACIONES — MODAL PÚBLICO
// =====================================================================
async function renderParticipaciones(eventoId) {
  const container = document.getElementById(`participaciones-list-${eventoId}`);
  if (!container) return;
  container.innerHTML = `<div class="part-skeleton-wrap">${[1,2,3].map(() => `<div class="part-skeleton"><div class="part-skeleton-icon"></div><div class="part-skeleton-lines"><div class="part-skeleton-line part-skeleton-line--name"></div><div class="part-skeleton-line part-skeleton-line--cat"></div></div></div>`).join('')}</div>`;
  const participaciones = await supabaseGetParticipaciones(eventoId);
  if (participaciones.length === 0) { container.innerHTML = `<div class="part-empty"><span class="part-empty-icon">🎭</span><p>No hay agrupaciones registradas para este evento.</p></div>`; return; }
  const grupos = {};
  participaciones.forEach(p => { const cat = p.agrupacion?.categoria || 'Otras'; if (!grupos[cat]) grupos[cat] = []; grupos[cat].push(p); });
  const catConfig = { 'Murgas': { emoji: '🎵', tagClass: 'Murga' }, 'Comparsas': { emoji: '🎭', tagClass: 'Comparsa' }, 'Artefactos': { emoji: '🏗️', tagClass: 'Artefacto' }, 'Grupos Animación': { emoji: '🎪', tagClass: 'GrupoAnimación' }, 'Otras': { emoji: '🎶', tagClass: 'Desfile' } };
  container.innerHTML = Object.entries(grupos).map(([cat, items]) => { const cfg = catConfig[cat] || { emoji: '🎶', tagClass: 'Desfile' }; return `<div class="part-grupo"><div class="part-grupo-header"><span class="part-grupo-emoji">${cfg.emoji}</span><span class="part-grupo-nombre">${cat}</span><span class="part-grupo-count">${items.length}</span></div><div class="part-chips">${items.map(p => `<div class="part-chip part-chip--${cfg.tagClass}" title="${p.agrupacion?.descripcion || ''}"><span class="part-chip-name">${p.agrupacion?.nombre || 'Sin nombre'}</span></div>`).join('')}</div></div>`; }).join('');
}

function getCategoriaEmoji(categoria) {
  const emojis = { 'Murgas': '🎵', 'Comparsas': '🎭', 'Artefactos': '🏗️', 'Grupos Animación': '🎪', 'Desfiles': '🎠' };
  return emojis[categoria] || '🎶';
}

// =====================================================================
// PARTICIPACIONES — PANEL ADMIN
// =====================================================================
let agrupacionesList = [];
let currentEventoParticipaciones = null;

async function openParticipacionesModal(eventoId) {
  const evento = EVENTOS.find(e => e.id === eventoId);
  if (!evento) return;
  currentEventoParticipaciones = eventoId;
  document.getElementById('modal-part-evento-nombre').textContent = evento.nombre;
  if (!agrupacionesList.length) agrupacionesList = await supabaseGetAgrupaciones();
  const select = document.getElementById('part-select-agrupacion');
  select.innerHTML = agrupacionesList.map(a => `<option value="${a.id_agrupacion}">${a.nombre} (${a.categoria})</option>`).join('');
  await renderParticipacionesAdmin(eventoId);
  document.getElementById('modal-participaciones').classList.add('open');
}

async function renderParticipacionesAdmin(eventoId) {
  const container = document.getElementById('modal-part-lista');
  if (!container) return;
  const participaciones = await supabaseGetParticipaciones(eventoId);
  if (participaciones.length === 0) { container.innerHTML = '<p style="color:var(--text-muted);font-size:.85rem">Sin agrupaciones asignadas.</p>'; return; }
  container.innerHTML = participaciones.map(p => `<div style="display:flex;align-items:center;justify-content:space-between;padding:.5rem .75rem;background:rgba(255,255,255,0.04);border-radius:8px;margin-bottom:.4rem;"><span style="font-size:.9rem;">${getCategoriaEmoji(p.agrupacion?.categoria)} <strong>${p.agrupacion?.nombre}</strong> · ${p.anio}</span><button onclick="removeParticipacion(${p.id_participacion})" style="background:rgba(239,68,68,0.2);border:none;color:#f87171;padding:.3rem .6rem;border-radius:6px;cursor:pointer;font-size:.8rem;">Quitar</button></div>`).join('');
}

async function addParticipacion() {
  const idAgrupacion = parseInt(document.getElementById('part-select-agrupacion').value);
  const anio = parseInt(document.getElementById('part-input-anio').value);
  if (!idAgrupacion || !anio) { showToast('Selecciona agrupación y año', true); return; }
  const ok = await supabaseAddParticipacion(currentEventoParticipaciones, idAgrupacion, anio);
  if (ok) { showToast('Agrupación añadida'); await renderParticipacionesAdmin(currentEventoParticipaciones); }
  else showToast('Error al añadir agrupación', true);
}

async function removeParticipacion(idParticipacion) {
  const ok = await supabaseDeleteParticipacion(idParticipacion);
  if (ok) { showToast('Agrupación eliminada'); await renderParticipacionesAdmin(currentEventoParticipaciones); }
  else showToast('Error al eliminar', true);
}

// =====================================================================
// SISTEMA DE COMENTARIOS (Supabase) — solo usuarios registrados
// =====================================================================
async function addComment(eventoId) {
  if (!requireAuth('Publicar comentarios')) return;
  const input = document.getElementById(`comment-input-${eventoId}`);
  if (!input) return;
  let text = input.value.trim();
  if (!text) { showToast('Escribe un comentario antes de publicar', true); return; }
  
  // Verificar palabras prohibidas
  if (contienePalabrotas(text)) {
    showToast('El comentario contiene lenguaje inapropiado. Por favor, edítalo.', true);
    return;
  }
  
  const { comment, error } = await supabaseAddComentario(currentUser.id, eventoId, text);
  if (error) { showToast('❌ ' + error, true); return; }
  input.value = '';
  renderComments(eventoId);
  showToast('Comentario publicado');
}

async function deleteComment(eventoId, commentId) {
  if (!currentUser || currentUser.role !== 'admin') { showToast('Solo el administrador puede eliminar comentarios', true); return; }
  const success = await supabaseDeleteComentario(commentId);
  if (success) { renderComments(eventoId); renderModerationPanel(); showToast('Comentario eliminado'); }
  else showToast('Error al eliminar comentario', true);
}

async function renderComments(eventoId) {
  const container = document.getElementById(`comments-list-${eventoId}`);
  const countEl = document.getElementById(`comments-count-${eventoId}`);
  
  if (!container) return;

  const eventComments = await supabaseGetComentarios(eventoId);
  if (countEl) countEl.textContent = eventComments.length;

  if (eventComments.length === 0) {
    container.innerHTML = `<div class="comments-empty"><span>💭</span><p>No hay comentarios aún. ¡Sé el primero en opinar!</p></div>`;
    return;
  }

  const isAdmin = currentUser && currentUser.role === 'admin';

  container.innerHTML = eventComments.slice().reverse().map(c => {
    const date = new Date(c.fecha);
    const timeStr = date.toLocaleDateString('es-ES', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    const displayName = c.persona?.nombre || 'Anónimo';
    const username    = c.persona?.username ? `@${c.persona.username}` : '';
    const avatarUrl = c.persona?.avatar_url;

    // Si tiene avatar_url válido, mostramos imagen; si no, la inicial
    let avatarHtml;
    if (avatarUrl && avatarUrl.trim() !== '') {
      avatarHtml = `<div class="comment-avatar" style="background-image: url(${avatarUrl}); background-size: cover; background-position: center; background-repeat: no-repeat;"></div>`;
    } else {
      const initial = userName.charAt(0).toUpperCase();
      avatarHtml = `<div class="comment-avatar">${initial}</div>`;
    }

    return `
      <div class="comment-item" id="comment-${c.id_publicacion}">
        ${avatarHtml}
        <div class="comment-body">
          <div class="comment-header">
            <strong class="comment-user">${escapeHtml(displayName)}</strong>
            ${username ? `<span class="comment-username">${escapeHtml(username)}</span>` : ''}
            <span class="comment-date">${timeStr}</span>
          </div>
          <p class="comment-text">${escapeHtml(c.contenido)}</p>
        </div>
        ${isAdmin ? `<button class="comment-delete-btn" onclick="event.stopPropagation(); deleteComment(${eventoId}, ${c.id_publicacion})" title="Eliminar comentario">🗑️</button>` : ''}
      </div>
    `;
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
  const allComments = await supabaseGetAllComentarios();
  if (countEl) countEl.textContent = allComments.length;
  if (allComments.length === 0) { container.innerHTML = `<div class="moderation-empty"><span>${getSvgIcon('chat')}</span><p>No hay comentarios para moderar.</p></div>`; return; }
  container.innerHTML = allComments.slice(0, 30).map(c => {
    const date = new Date(c.fecha);
    const timeStr = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    const userName = (c.persona && c.persona.nombre) ? c.persona.nombre : 'Anónimo';
    const evento = EVENTOS.find(e => e.id === c.id_evento);
    const eventoName = evento ? evento.nombre : 'Evento #' + c.id_evento;
    const hasBadWords = contienePalabrotas(c.contenido);
    return `<div class="moderation-item ${hasBadWords ? 'moderation-item--warning' : ''}">
      <div class="moderation-item-info">
        <div class="moderation-item-top">
          <strong>${userName}</strong>
          <span class="moderation-event-tag"> ${eventoName}</span>
          ${hasBadWords ? '<span class="bad-word-badge">Contiene insultos</span>' : ''}
        </div>
        <p class="moderation-item-text">${escapeHtml(c.contenido)}</p>
        <span class="moderation-item-date">${timeStr}</span>
      </div>
      <button class="admin-action-btn admin-action-btn--del" onclick="deleteComment(${c.id_evento}, ${c.id_publicacion})">${getSvgIcon('trash')} Eliminar</button>
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

function renderEscenariosList() {
  const container = document.getElementById('escenarios-list-container');
  if (!container) return;
  container.innerHTML = '';
  ubicacionesList.forEach(ubi => {
    let iconoSvg = getSvgIcon('pin');
    if (ubi.nombre.includes('Teatro')) iconoSvg = getSvgIcon('map');
    else if (ubi.nombre.includes('Recinto')) iconoSvg = getSvgIcon('home');
    else if (ubi.nombre.includes('Plaza Alta')) iconoSvg = getSvgIcon('map');
    else if (ubi.nombre.includes('Casco')) iconoSvg = getSvgIcon('home');
    const li = document.createElement('li');
    li.className = 'escenario-item';
    li.setAttribute('data-id', ubi.id_ubicacion);
    li.setAttribute('data-nombre', ubi.nombre);
    li.setAttribute('data-lat', ubi.latitud);
    li.setAttribute('data-lng', ubi.longitud);
    li.setAttribute('data-dir', ubi.direccion || '');
    let descCorta = ubi.direccion ? ubi.direccion.split(',')[0] : '';
    if (ubi.nombre === 'Casco Antiguo') descCorta = 'Pasacalles · Entierro de la Sardina';
    if (ubi.nombre === 'Recinto Ferial') descCorta = 'Gran Desfile · Desfile Infantil';
    if (ubi.nombre === 'Teatro López de Ayala') descCorta = 'COMBA · Concurso de Murgas';
    li.innerHTML = `<span class="esc-icon">${iconoSvg}</span><div><strong>${ubi.nombre}</strong><span>${descCorta}</span></div>`;
    li.addEventListener('click', () => {
      document.querySelectorAll('.escenario-item').forEach(item => item.classList.remove('escenario-item--active'));
      li.classList.add('escenario-item--active');
      centrarMapaEnUbicacion(ubi.id_ubicacion, ubi.nombre, parseFloat(ubi.latitud), parseFloat(ubi.longitud), ubi.direccion || 'Ubicación carnavalera');
      document.getElementById('esc-title').innerHTML = `${iconoSvg} ${ubi.nombre}`;
      document.getElementById('esc-desc').innerHTML = ubi.direccion || 'Escenario del Carnaval de Badajoz';
      document.getElementById('esc-tag').innerHTML = 'Ubicación';
    });
    container.appendChild(li);
  });
  if (container.firstChild && ubicacionesList.length > 0) {
    const primera = ubicacionesList[0];
    container.firstChild.classList.add('escenario-item--active');
    let iconoSvg = getSvgIcon('pin');
    if (primera.nombre.includes('Teatro')) iconoSvg = getSvgIcon('map');
    else if (primera.nombre.includes('Recinto')) iconoSvg = getSvgIcon('home');
    centrarMapaEnUbicacion(primera.id_ubicacion, primera.nombre, parseFloat(primera.latitud), parseFloat(primera.longitud), primera.direccion || 'Ubicación carnavalera');
    document.getElementById('esc-title').innerHTML = `${iconoSvg} ${primera.nombre}`;
    document.getElementById('esc-desc').innerHTML = primera.direccion || 'Escenario del Carnaval de Badajoz';
    document.getElementById('esc-tag').innerHTML = 'Ubicación';
  }
}

function centrarMapaEnUbicacion(id, nombre, lat, lng, direccion) {
  if (!map) return;
  google.maps.event.trigger(map, 'resize');
  map.panTo({ lat, lng });
  map.setZoom(17);
  Object.values(infoWindows).forEach(iw => iw.close());
  let marker = markers[nombre];
  if (marker) { marker.setPosition({ lat, lng }); marker.setMap(map); marker.setAnimation(google.maps.Animation.BOUNCE); setTimeout(() => marker.setAnimation(null), 1500); }
  else {
    marker = new google.maps.Marker({ position: { lat, lng }, map: map, title: nombre, animation: google.maps.Animation.DROP, icon: { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><defs><filter id="shadow"><feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.5"/></filter></defs><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#7c3aed" stroke="#a855f7" stroke-width="1.5" filter="url(#shadow)"/><circle cx="12" cy="9" r="3" fill="white"/></svg>`)}`, scaledSize: new google.maps.Size(48, 48), anchor: new google.maps.Point(24, 48) } });
    markers[nombre] = marker;
  }
  let info = infoWindows[nombre];
  if (!info) { info = new google.maps.InfoWindow({ content: `<div style="background: white; color: black; padding: 12px 16px; border-radius: 8px; font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 500; box-shadow: 0 2px 8px rgba(0,0,0,0.15); border: 1px solid #ddd; max-width: 260px; text-align: left;"><strong style="color: #6c3bd1; display: block; margin-bottom: 6px; font-size: 1rem;">${nombre}</strong><span style="color: #333; font-size: 12px; line-height: 1.4;">${direccion || ''}</span></div>` }); infoWindows[nombre] = info; }
  info.open(map, marker);
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
  Object.values(infoWindows).forEach(iw => iw.close());
  if (infoWindows[key] && markers[key]) { infoWindows[key].open(map, markers[key]); markers[key].setAnimation(google.maps.Animation.BOUNCE); setTimeout(() => markers[key].setAnimation(null), 1500); }
}

// =====================================================================
// ADMIN
// =====================================================================
function renderAdminTable(eventos) {
  const tbody = document.getElementById('admin-table-body');
  if (!tbody) return;
  const catClass = (c) => c.replace(/\s/g, '');
  tbody.innerHTML = eventos.map(e => `
    <tr>
      <td><strong>${e.nombre}</strong></td>
      <td><span class="evento-tag tag--${catClass(e.categoria)}">${e.categoria}</span></td>
      <td>${e.dia}</td>
      <td>${e.hora}</td>
      <td>${e.ubicacion?.nombre || '-'}</td>
      <td>
        <button class="admin-action-btn admin-action-btn--edit" onclick="openEditEventModal(${e.id})">${getSvgIcon('pencil')} Editar</button>
        <button class="admin-action-btn" style="background:rgba(124,58,237,0.2);border:1px solid rgba(124,58,237,0.4);color:#a78bfa;" onclick="openParticipacionesModal(${e.id})"><svg xmlns="http://www.w3.org/2000/svg" viewBox="110 30 465 340" width="14" height="14" fill="currentColor">
  <path d="M301.385651,43.315445 C304.552521,41.423615 307.354828,39.604538 310.316345,38.098610 C319.995605,33.176723 328.855774,36.390541 333.130219,46.478577 C337.224152,56.140472 340.408508,66.123787 343.359283,76.196808 C347.327728,89.743675 350.636627,103.496353 355.713959,117.402245 C358.810760,113.402702 359.717499,108.983635 361.595703,105.070930 C363.971527,100.121536 365.939667,94.977875 368.256195,89.998283 C373.665680,78.370018 383.561005,75.769020 394.006409,83.238838 C398.205353,86.241592 402.288177,89.412018 406.349945,92.600281 C428.467743,109.961502 453.926239,120.421112 480.473175,128.705078 C501.099976,135.141663 522.095032,139.032486 543.783569,138.671906 C547.755920,138.605865 551.665527,137.906723 555.719238,138.531586 C565.233215,139.998123 570.531921,146.721497 569.713806,156.379578 C568.650696,168.929703 564.733459,180.794449 561.251099,192.746841 C553.477234,219.428665 545.834351,246.210846 534.210510,271.528442 C517.690308,307.510498 492.202362,334.949219 455.267792,350.600677 C441.106995,356.601532 426.326691,360.237488 410.721649,360.477753 C400.291809,360.638306 391.729919,357.178986 383.665985,350.854919 C360.367889,332.583771 344.724243,309.169891 335.665680,281.154877 C335.363739,280.221222 334.944641,279.325439 334.466583,278.127441 C332.019531,279.200623 331.089050,281.450653 329.569000,283.079010 C319.533508,293.829590 308.883789,303.807495 295.997803,311.196991 C285.825348,317.030396 275.052643,316.158112 264.397858,314.002350 C212.733490,303.549530 176.888901,272.990292 154.688995,225.939392 C141.896988,198.838181 136.013947,169.468185 128.750946,140.606644 C125.994408,129.652740 123.713615,118.569435 121.530174,107.483231 C118.171196,90.428284 126.214447,81.484955 143.380096,83.884621 C167.663651,87.279327 191.475571,84.851326 215.174515,79.582054 C240.155518,74.027718 264.328766,66.258453 286.483673,53.121319 C291.489227,50.153172 296.230865,46.739948 301.385651,43.315445 M362.401123,147.211975 C366.207336,165.593063 367.461823,184.149841 365.019012,202.768143 C362.485657,222.076294 356.143738,240.265030 347.132690,257.511993 C346.032013,259.618683 344.953613,261.635101 345.467316,264.112152 C352.198212,296.568298 368.307373,323.114868 395.117035,342.920837 C399.150726,345.900757 403.634583,347.110962 408.680054,347.076141 C421.494568,346.987701 433.787231,344.298737 445.703033,339.867523 C479.637238,327.248108 503.472198,303.438751 519.088745,271.420013 C536.394226,235.938416 546.170898,197.845505 555.676819,159.739349 C557.491760,152.463898 557.061523,152.147476 549.424377,152.286407 C539.097900,152.474228 528.750854,152.579575 518.523132,151.089035 C489.024750,146.790024 460.884003,137.940689 433.897827,125.315826 C417.657196,117.718025 402.836761,107.977600 389.019989,96.571289 C383.131775,91.710335 382.223267,92.234528 378.968109,99.032867 C372.480713,112.581505 368.234711,126.984802 362.809479,140.937210 C362.114929,142.723358 362.217560,144.524261 362.401123,147.211975 M233.597870,289.865417 C241.482574,293.911011 249.831619,296.727997 258.272156,299.344330 C276.042877,304.852814 291.270355,301.324463 305.177795,288.503754 C343.864319,252.840134 357.788788,208.935532 350.191925,157.562195 C347.340942,138.282471 342.461792,119.443359 336.695251,100.842117 C332.063446,85.901222 327.367889,70.978951 322.542175,56.099812 C320.057281,48.438129 318.260437,47.943352 311.717560,52.693863 C289.076233,69.132812 264.065948,80.485474 237.109741,87.769958 C212.963943,94.294960 188.678253,99.914261 163.439346,99.150101 C156.138580,98.929054 148.864868,97.899536 141.570908,97.343964 C134.446396,96.801292 133.593979,97.865067 134.836807,104.736046 C138.716507,126.185257 144.270172,147.235382 149.900223,168.266983 C154.460388,185.301910 158.946548,202.372299 166.111618,218.560699 C180.048889,250.049850 202.372269,273.678467 233.597870,289.865417 z" />
  <path d="M383.792023,272.805939 C382.531921,274.385864 381.581970,275.762848 380.473785,276.997894 C378.043213,279.706757 375.094788,281.226624 371.664612,279.115356 C368.281525,277.033081 367.888062,273.626465 369.444122,270.319061 C372.285309,264.280029 377.201965,259.912781 382.566498,256.256409 C415.920349,233.522995 461.600037,251.929642 469.873962,291.321228 C470.534149,294.464417 470.520813,297.630341 470.192810,300.757294 C469.817352,304.336670 467.521454,306.563660 463.979950,306.851868 C460.699951,307.118744 458.814087,304.948059 457.865845,301.999725 C457.409821,300.581787 456.954071,299.107819 456.863708,297.636749 C455.721191,279.033905 444.643097,268.123779 428.143768,262.615234 C411.847992,257.174652 396.603699,259.765076 383.792023,272.805939 z" />
  <path d="M427.150604,194.165466 C407.662323,205.782578 386.748291,200.354233 377.039398,181.447388 C374.429932,176.365799 375.649506,171.851379 380.211029,170.246750 C384.964874,168.574509 387.387909,171.626144 389.214478,175.215057 C392.508514,181.687271 397.198029,186.036560 404.692108,187.207748 C408.538452,187.808884 411.941650,187.185455 415.287048,185.527725 C416.776062,184.789917 418.163635,183.849075 419.644501,183.092834 C423.311493,181.220169 427.128082,180.338348 429.968140,184.169922 C432.920563,188.153076 430.833099,191.335449 427.150604,194.165466 z" />
  <path d="M502.705658,212.554871 C504.311218,211.898926 505.500458,211.197861 506.779755,210.934998 C510.491150,210.172379 513.813965,210.658386 515.562256,214.617706 C517.395264,218.768906 515.023438,221.262283 511.882294,223.265640 C494.397827,234.416824 468.868774,224.766327 463.125763,204.867615 C461.822540,200.352219 463.310822,196.425461 467.043091,195.411133 C471.284790,194.258331 474.130829,196.270218 475.663483,200.176849 C478.523590,207.467133 483.372528,212.388199 491.226746,214.211655 C495.213043,215.137115 498.784058,214.347153 502.705658,212.554871 z" />
  <path d="M298.407654,249.454620 C269.648529,270.637360 231.756668,265.454865 209.969910,237.623093 C209.867294,237.492004 209.767731,237.358002 209.674774,237.219925 C206.137802,231.964523 201.634262,226.638733 204.851730,219.902985 C207.938232,213.441345 214.680542,214.255081 220.591797,213.616837 C237.496414,211.791550 253.984894,207.986908 270.311249,203.258316 C282.684937,199.674500 294.470306,194.727219 306.028931,189.180374 C318.808960,183.047379 324.092773,191.273361 323.221588,201.762100 C321.631378,220.907898 313.398682,236.785278 298.407654,249.454620 M232.849899,225.457718 C228.753723,226.613678 224.333374,226.240005 220.271164,227.901398 C229.070175,243.025848 252.274551,254.032639 274.128754,247.388748 C293.015259,241.647049 309.596283,220.993149 308.510956,203.025986 C284.370667,213.583496 259.720947,221.815430 232.849899,225.457718 z" />
  <path d="M218.410461,161.570129 C205.799362,153.808105 193.286407,157.887650 187.549728,171.274124 C186.321121,174.141098 185.430862,177.341003 181.378860,177.569534 C176.368729,177.852081 173.247482,174.397736 174.503662,169.336533 C177.633408,156.726379 186.114349,148.854477 198.129623,145.267059 C209.880432,141.758621 220.428864,145.363083 229.382416,153.461304 C232.989899,156.724167 233.364151,161.198410 230.633759,164.041534 C227.106705,167.714249 223.797119,166.186905 220.623520,163.386444 C220.000839,162.836975 219.344391,162.325745 218.410461,161.570129 z" />
  <path d="M279.566284,145.538666 C276.401154,152.752548 273.639801,154.633255 269.452301,152.669800 C265.363647,150.752716 264.575378,146.720276 267.149017,140.476700 C277.090118,116.359848 304.118622,112.214874 320.386353,128.674316 C324.135162,132.467300 324.120514,135.970154 320.411102,138.868866 C317.280426,141.315292 314.462891,140.683350 311.497223,138.123215 C299.941620,128.147873 286.205322,131.265900 279.566284,145.538666 z" />
</svg> Participantes</button>
        <button class="admin-action-btn admin-action-btn--del" onclick="deleteEventAdmin(${e.id}, this)">${getSvgIcon('trash')} Eliminar</button>
      </td>
    </tr>
  `).join('');
}

async function deleteEventAdmin(id, btn) {
  const exito = await supabaseDeleteEvento(id);
  if (!exito) { showToast('⚠️ Error al eliminar evento', true); return; }
  const row = btn.closest('tr');
  row.style.opacity = '0';
  row.style.transition = 'opacity .3s';
  setTimeout(() => row.remove(), 350);
  showToast('🗑️ Evento eliminado');
  const adminTotal = document.getElementById('admin-total-eventos');
  if (adminTotal) adminTotal.textContent = parseInt(adminTotal.textContent) - 1;
  EVENTOS = EVENTOS.filter(e => e.id !== id);
  filteredEventos = filteredEventos.filter(e => e.id !== id);
  renderEventos(filteredEventos);
}

function openAddEventModal() {
  // Limpiar campos del formulario
  document.getElementById('new-grupo').value = '';
  document.getElementById('new-categoria').value = 'Murga';
  document.getElementById('new-dia').value = '';
  document.getElementById('new-hora').value = '';
  document.getElementById('new-desc').value = '';
  // Resetear agrupaciones seleccionadas
  selectedAgrupaciones = [];
  renderAgrupacionChips();
  document.getElementById('modal-add-evento').classList.add('open');
}

// =====================================================================
// CHIPS DE AGRUPACIONES — modal añadir evento
// =====================================================================
let selectedAgrupaciones = [];

function addAgrupacionChip() {
  const sel = document.getElementById('new-agrupacion');
  const id = parseInt(sel.value);
  const nombre = sel.options[sel.selectedIndex]?.text;
  if (!id) return;
  if (selectedAgrupaciones.find(a => a.id === id)) { showToast('Esa agrupación ya está añadida', true); return; }
  selectedAgrupaciones.push({ id, nombre });
  renderAgrupacionChips();
  sel.value = '';
}

function removeAgrupacionChip(id) {
  selectedAgrupaciones = selectedAgrupaciones.filter(a => a.id !== id);
  renderAgrupacionChips();
}

function renderAgrupacionChips() {
  const container = document.getElementById('new-agrupacion-chips');
  const placeholder = document.getElementById('new-agrupacion-placeholder');
  if (!container) return;
  if (selectedAgrupaciones.length === 0) {
    container.innerHTML = '';
    container.appendChild(placeholder || (() => { const s = document.createElement('span'); s.id = 'new-agrupacion-placeholder'; s.style = 'font-size:.78rem;color:var(--text-subtle)'; s.textContent = 'Sin agrupaciones añadidas'; return s; })());
    return;
  }
  container.innerHTML = selectedAgrupaciones.map(a => `<span class="agrupacion-chip">${a.nombre.split(' (')[0]}<button type="button" onclick="removeAgrupacionChip(${a.id})" title="Quitar">✕</button></span>`).join('');
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
  if (!grupo || !dia || !hora) { showToast('⚠️ Rellena los campos obligatorios', true); return; }
  const { data: newEvento, error } = await supabaseAddEvento({ nombre: grupo, categoria, dia, hora, id_ubicacion, descripcion: desc || 'Sin descripción.' });
  if (error || !newEvento) { showToast('⚠️ Error al crear evento: ' + error, true); return; }
  if (selectedAgrupaciones.length > 0) {
    const resultados = await Promise.all(selectedAgrupaciones.map(a => supabaseAddParticipacion(newEvento.id, a.id, 2026)));
    const fallidas = resultados.filter(r => !r).length;
    if (fallidas > 0) showToast(`⚠️ ${fallidas} agrupación(es) no se pudieron vincular`, true);
  }
  EVENTOS.unshift(newEvento);
  filteredEventos = [...EVENTOS];
  renderAdminTable(EVENTOS);
  renderEventos(filteredEventos);
  const num = document.getElementById('admin-total-eventos');
  if (num) num.textContent = parseInt(num.textContent) + 1;
  closeModal('modal-add-evento');
  showToast('✅ Evento añadido correctamente');
  ['new-grupo', 'new-dia', 'new-hora', 'new-desc'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('new-agrupacion').value = '';
  selectedAgrupaciones = [];
  renderAgrupacionChips();
}

async function openEditEventModal(id) {
  const e = EVENTOS.find(ev => ev.id === id);
  if (!e) return;

  // Asegurarse de que el select de escenarios esté poblado
  const selectEdit = document.getElementById('edit-escenario');
  if (selectEdit && selectEdit.options.length <= 1) {
    await loadUbicacionesSelect();
  }

  const fechaDate = fechaTextoToDateInput(e.dia);
  document.getElementById('edit-dia').value = fechaDate;
  document.getElementById('edit-evento-id').value = e.id;
  document.getElementById('edit-grupo').value = e.nombre;
  document.getElementById('edit-categoria').value = e.categoria;
  document.getElementById('edit-hora').value = e.hora;
  document.getElementById('edit-desc').value = e.descripcion || '';
  if (e.id_ubicacion) document.getElementById('edit-escenario').value = e.id_ubicacion;
  document.getElementById('modal-edit-evento').classList.add('open');
}

async function saveEditEvento() {
  const id = parseInt(document.getElementById('edit-evento-id').value);
  const nombre = document.getElementById('edit-grupo').value.trim();
  const categoria = document.getElementById('edit-categoria').value;
  const diaRaw = document.getElementById('edit-dia').value;
  const dia = dateToFechaTexto(diaRaw);
  const hora = document.getElementById('edit-hora').value;
  const id_ubicacion = parseInt(document.getElementById('edit-escenario').value);
  const descripcion = document.getElementById('edit-desc').value.trim();
  if (!nombre || !dia || !hora) { showToast('Rellena los campos obligatorios', true); return; }
  const { data, error } = await supabaseUpdateEvento(id, { nombre, categoria, dia, hora, id_ubicacion, descripcion: descripcion || 'Sin descripción.' });
  if (error || !data) { showToast('Error al guardar cambios: ' + error, true); return; }
  const idx = EVENTOS.findIndex(ev => ev.id === id);
  if (idx !== -1) EVENTOS[idx] = data;
  filteredEventos = [...EVENTOS];
  renderAdminTable(EVENTOS);
  renderEventos(filteredEventos);
  closeModal('modal-edit-evento');
  showToast('Evento actualizado correctamente');
}

function loadFilterEscenarioSelect() {
  const select = document.getElementById('filter-escenario');
  if (!select || !ubicacionesList.length) return;
  // Mantener "Todos" y añadir las ubicaciones reales de la BD
  select.innerHTML = '<option value="">Todos</option>';
  ubicacionesList.forEach(ubi => {
    const option = document.createElement('option');
    option.value = ubi.nombre;   // el filtro compara por nombre
    option.textContent = ubi.nombre;
    select.appendChild(option);
  });
}

async function loadUbicacionesSelect() {
  const ubicaciones = await supabaseGetUbicaciones();

  // Poblar select de "Añadir evento" (new-escenario)
  const selectNew = document.getElementById('new-escenario');
  if (selectNew) {
    selectNew.innerHTML = '';
    ubicaciones.forEach(ubi => {
      const option = document.createElement('option');
      option.value = ubi.id_ubicacion;
      option.textContent = ubi.nombre;
      selectNew.appendChild(option);
    });
  }

  // Poblar select de "Editar evento" (edit-escenario)
  const selectEdit = document.getElementById('edit-escenario');
  if (selectEdit) {
    selectEdit.innerHTML = '<option value="">— Sin escenario —</option>';
    ubicaciones.forEach(ubi => {
      const option = document.createElement('option');
      option.value = ubi.id_ubicacion;
      option.textContent = ubi.nombre;
      selectEdit.appendChild(option);
    });
  }

  // Poblar select de agrupaciones
  if (!agrupacionesList.length) agrupacionesList = await supabaseGetAgrupaciones();
  const selectAgr = document.getElementById('new-agrupacion');
  if (selectAgr) {
    selectAgr.innerHTML = '<option value="">— Sin agrupación vinculada —</option>';
    agrupacionesList.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.id_agrupacion;
      opt.textContent = `${a.nombre} (${a.categoria})`;
      selectAgr.appendChild(opt);
    });
  }
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
  iconEl.textContent = warn ? '⚠️' : '✅';
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3000);
}

// =====================================================================
// PERFIL DE USUARIO (MODAL Y EDICIÓN) - CORREGIDO
// =====================================================================

let currentAvatarFile = null;

async function openProfileModal() {
  if (!currentUser) {
    showToast('Debes iniciar sesión para editar tu perfil', true);
    return;
  }

  const { data, error } = await supabaseClient
    .from('persona')
    .select('*')
    .eq('id_persona', currentUser.id)
    .single();

  if (error) {
    showToast('Error al cargar los datos del perfil', true);
    return;
  }

  document.getElementById('profile-name').value = data.nombre || '';
  document.getElementById('profile-surname').value = data.apellidos || '';
  document.getElementById('profile-username').value = data.username || '';
  document.getElementById('profile-phone').value = data.telefono || '';
  document.getElementById('profile-birthdate').value = data.fecha_nacimiento || '';
  document.getElementById('profile-email').value = currentUser.email || '';

  const avatarImg = document.getElementById('profile-avatar-img');
  if (data.avatar_url) {
    avatarImg.src = data.avatar_url;
  } else {
    avatarImg.src = '';
  }

  currentAvatarFile = null;
  document.getElementById('profile-avatar-input').value = '';

  document.getElementById('modal-perfil').classList.add('open');
}

// Previsualizar nueva foto en el modal
document.getElementById('profile-avatar-input')?.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    currentAvatarFile = file;
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = document.getElementById('profile-avatar-img');
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

async function saveProfile() {
  if (!currentUser) return;

  const nombre = document.getElementById('profile-name').value.trim();
  const apellidos = document.getElementById('profile-surname').value.trim();
  const telefono = document.getElementById('profile-phone').value.trim();
  const birthdate = document.getElementById('profile-birthdate').value;
  const username = document.getElementById('profile-username').value.trim().toLowerCase();

  if (username && !/^[a-zA-Z0-9._]{3,20}$/.test(username)) {
    showToast('Formato de usuario incorrecto', true);
    return;
  }

  // Verificar disponibilidad si cambió
  if (username && username !== currentUser.username) {
    const available = await supabaseCheckUsernameAvailable(username, currentUser.id);
    if (!available) {
      showToast('Ese nombre de usuario ya está en uso', true);
      return;
    }
    updates.username = username;
  }

  if (!nombre) {
    showToast('El nombre es obligatorio', true);
    return;
  }

  const btn = document.getElementById('btn-save-profile');
  const originalText = btn.innerHTML;
  btn.innerHTML = 'Guardando...';
  btn.disabled = true;

  let avatarUrl = null;
  const avatarFile = document.getElementById('profile-avatar-input').files[0];
  
  if (avatarFile) {
    avatarUrl = await supabaseUploadAvatar(avatarFile, currentUser.id);
    if (!avatarUrl) {
      showToast('Error al subir la imagen. Tamaño máximo 2MB, formato JPEG/PNG/WEBP', true);
      btn.innerHTML = originalText;
      btn.disabled = false;
      return;
    }
  }

  const updates = {
    nombre: nombre,
    apellidos: apellidos || null,
    telefono: telefono || null,
    fecha_nacimiento: birthdate || null
  };
  if (avatarUrl) updates.avatar_url = avatarUrl;

  const result = await supabaseUpdatePerfil(currentUser.id, updates);

  if (result.success) {
    currentUser.name = nombre;
    if (avatarUrl) currentUser.avatar = avatarUrl;
    localStorage.setItem('cbdj-user', JSON.stringify(currentUser));
    setupUserUI();
    showToast('Perfil actualizado correctamente');
    closeModal('modal-perfil');
  } else {
    showToast('Error: ' + result.error, true);
  }

  btn.innerHTML = originalText;
  btn.disabled = false;
}