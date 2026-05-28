/* =============================================
   CARNAVAL DE BADAJOZ — JavaScript
   Author: Ángel Galea Anisa | TFG 2025/2026
   ============================================= */

// ---- NAVBAR: Scroll effect ----
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ---- CONFETTI ----
const CONFETTI_COLORS = [
  '#7c3aed', '#a855f7', '#f59e0b', '#fcd34d',
  '#ef4444', '#ec4899', '#3b82f6', '#10b981',
  '#f97316', '#06b6d4'
];

function createConfetti() {
  const container = document.getElementById('confetti-container');
  const count = 60;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.classList.add('confetti-piece');

    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const left = Math.random() * 100;
    const duration = 4 + Math.random() * 8;
    const delay = Math.random() * 10;
    const size = 6 + Math.random() * 8;
    const isCircle = Math.random() > 0.5;

    piece.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${isCircle ? size : size * 1.6}px;
      background: ${color};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      border-radius: ${isCircle ? '50%' : '2px'};
      opacity: 0;
    `;

    container.appendChild(piece);
  }
}
createConfetti();

// ---- SCROLL REVEAL (Simple AOS-like) ----
function initScrollReveal() {
  const elements = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}
initScrollReveal();

// ---- SMOOTH ACTIVE NAV HIGHLIGHT ----
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  },
  { threshold: 0.4 }
);
sections.forEach(s => sectionObserver.observe(s));

// Active nav style injection
const styleEl = document.createElement('style');
styleEl.textContent = `.nav-links a.active { color: var(--purple-light) !important; }`;
document.head.appendChild(styleEl);

// ---- COUNTER ANIMATION (hero stats) ----
// Simple parallax tilt on hero orbs
document.addEventListener('mousemove', (e) => {
  const orbs = document.querySelectorAll('.hero-orb');
  const x = (e.clientX / window.innerWidth - 0.5);
  const y = (e.clientY / window.innerHeight - 0.5);

  orbs.forEach((orb, i) => {
    const depth = (i + 1) * 18;
    orb.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
  });
});


// ========== MODAL DE DOCUMENTACIÓN (SIN EMOJIS, CON SVG) ==========
const modalContent = {
  'manual-usuario': {
    title: 'Manual de Usuario',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" style="width:24px;height:24px;vertical-align:middle;margin-right:8px;"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>`,
    body: `
      <h4>Acceso y registro</h4>
      <p>Puedes navegar por todo el contenido sin necesidad de registrarte. Si quieres guardar eventos favoritos, recibir notificaciones o comentar, crea una cuenta gratuita desde el botón <strong>"Empezar"</strong> en la barra de navegación.</p>
      
      <h4>Guardar favoritos</h4>
      <p>Una vez registrado, haz clic en el icono del corazón junto a cualquier evento del programa. Los favoritos se sincronizan automáticamente y los tendrás disponibles en tu perfil.</p>
      
      <h4>Mapa interactivo</h4>
      <p>Accede al mapa desde la sección principal. Verás la ubicación de todos los escenarios del Carnaval (plaza Alta, Recinto Ferial, etc.). Haz clic en cada marcador para obtener más información.</p>
      
      <h4>Notificaciones personalizadas</h4>
      <p>Si autorizas las notificaciones, el sistema te avisará 30 minutos antes de tus eventos favoritos. Puedes gestionar esto desde tu panel de usuario.</p>
      
      <h4>Comentarios y valoraciones</h4>
      <p>Comparte tu opinión sobre cada actuación y lee lo que otros usuarios opinan. El equipo modera los comentarios para mantener un ambiente respetuoso.</p>
    `
  },
  'manual-tecnico': {
    title: 'Manual Técnico',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" style="width:24px;height:24px;vertical-align:middle;margin-right:8px;"><path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>`,
    body: `
      <h4>Arquitectura general</h4>
      <p>Aplicación web <strong>Serverless</strong> dividida en dos partes: frontend estático (HTML/CSS/JS) y backend gestionado por <strong>Supabase</strong> (PostgreSQL + autenticación + almacenamiento).</p>
      
      <h4>Estructura del frontend</h4>
      <ul>
        <li><code>index.html</code> → Página principal de aterrizaje</li>
        <li><code>app.html</code> → Aplicación principal (calendario, mapa, favoritos)</li>
        <li><code>auth.html</code> → Login y registro</li>
        <li><code>css/landing.css</code> y <code>js/landing.js</code> → Estilos e interacciones comunes</li>
      </ul>
      
      <h4>Backend con Supabase</h4>
      <p>Se utilizan las siguientes tablas principales:</p>
      <ul>
        <li><code>eventos</code> → id, nombre, fecha, hora, escenario, descripción, agrupación_id</li>
        <li><code>agrupaciones</code> → id, nombre, tipo (murga/comparsa/artefacto), foto, resultados</li>
        <li><code>favoritos</code> → user_id, evento_id</li>
        <li><code>comentarios</code> → user_id, evento_id, texto, fecha</li>
      </ul>
      <p>Las políticas de seguridad (<strong>Row Level Security</strong>) están activadas para que cada usuario solo pueda modificar sus propios favoritos y comentarios.</p>
      
      <h4>Integración con Google Maps API</h4>
      <p>Se carga la API de Maps con una clave de entorno (almacenada en variables de entorno). Los marcadores se obtienen desde una tabla <code>ubicaciones</code> y se pintan dinámicamente.</p>
      
      <h4>Despliegue y CI/CD</h4>
      <p>El repositorio se aloja en GitHub. Se utiliza Netlify (o Vercel) para despliegue automático: cada push a la rama <code>main</code> genera una nueva versión en producción.</p>
    `
  },
  'manual-despliegue': {
    title: 'Manual de Despliegue',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" style="width:24px;height:24px;vertical-align:middle;margin-right:8px;"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /></svg>`,
    body: `
      <h4>Requisitos previos</h4>
      <ul>
        <li>Cuenta en <strong>GitHub</strong></li>
        <li>Cuenta en <strong>Supabase</strong> (plan gratuito)</li>
        <li>Cuenta en <strong>Google Cloud Platform</strong> para habilitar la API de Maps</li>
        <li>Opcional: cuenta en <strong>Netlify</strong> o <strong>Vercel</strong> para despliegue automático</li>
      </ul>
      
      <h4>Configuración de Supabase</h4>
      <ol>
        <li>Crear un nuevo proyecto en Supabase.</li>
        <li>Ejecutar el script SQL (incluido en <code>/database/schema.sql</code>) para crear las tablas y políticas RLS.</li>
        <li>Anotar la <strong>URL</strong> y la <strong>anon key</strong> del proyecto.</li>
      </ol>
      
      <h4>Configuración de Google Maps</h4>
      <ol>
        <li>Ir a Google Cloud Console → APIs y servicios → Habilitar <strong>Maps JavaScript API</strong>.</li>
        <li>Crear una clave de API (restringir dominios a tu web en producción).</li>
      </ol>
      
      <h4>Despliegue en Netlify (recomendado)</h4>
      <ol>
        <li>Sube el código a un repositorio de GitHub.</li>
        <li>Inicia sesión en Netlify → "New site from Git".</li>
        <li>Selecciona el repositorio y la rama <code>main</code>.</li>
        <li>Configura las variables de entorno:<br/>
          <code>VITE_SUPABASE_URL</code> = tu URL de Supabase<br/>
          <code>VITE_SUPABASE_ANON_KEY</code> = tu anon key<br/>
          <code>VITE_GOOGLE_MAPS_API_KEY</code> = tu clave de Maps
        </li>
        <li>Haz clic en "Deploy". En menos de un minuto tendrás tu web pública.</li>
      </ol>
      
      <h4>Verificación post‑despliegue</h4>
      <ul>
        <li>Comprobar que la página de inicio carga correctamente.</li>
        <li>Probar el registro de un nuevo usuario.</li>
        <li>Navegar por el mapa y los eventos.</li>
        <li>Revisar la consola del navegador por posibles errores de API.</li>
      </ul>
      <p>Para actualizar, solo haz <code>git push</code> y Netlify reconstruirá automáticamente.</p>
    `
  },
  'aviso-legal': {
    title: 'Aviso Legal',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:24px;height:24px;vertical-align:middle;margin-right:8px;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" /></svg>`,
    body: `
      <h4>Titular del sitio web</h4>
      <p>Este sitio web es un proyecto académico desarrollado por <strong>Ángel Galea Anisa</strong> como Trabajo de Fin de Grado (TFG) para el ciclo de <strong>Desarrollo de Aplicaciones Web</strong> en el IES Albarregas (Badajoz), curso 2025/2026.</p>
      <h4>Finalidad</h4>
      <p>La plataforma tiene como objetivo centralizar la información del Carnaval de Badajoz (programa, escenarios, agrupaciones) con fines exclusivamente educativos y de demostración. No tiene carácter comercial.</p>
      <h4>Propiedad intelectual</h4>
      <p>El código fuente, diseño y contenidos propios de esta web son propiedad del autor. Los datos del Carnaval de Badajoz se referencian con fines informativos a partir de fuentes públicas como <a href="https://carnavaldebadajoz.org" target="_blank" rel="noopener">carnavaldebadajoz.org</a>.</p>
      <h4>Limitación de responsabilidad</h4>
      <p>El autor no se hace responsable de posibles errores u omisiones en los datos del programa oficial. Para información oficial, consulta siempre <a href="https://carnavaldebadajoz.org" target="_blank" rel="noopener">carnavaldebadajoz.org</a>.</p>
    `
  },
  'politica-cookies': {
    title: 'Política de Cookies',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:24px;height:24px;vertical-align:middle;margin-right:8px;"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>`,
    body: `
      <h4>¿Qué son las cookies?</h4>
      <p>Las cookies son pequeños archivos de texto que los sitios web almacenan en tu navegador para recordar preferencias y mejorar la experiencia de uso.</p>
      <h4>Cookies que utilizamos</h4>
      <ul>
        <li><strong>Sesión de usuario (Supabase):</strong> necesarias para mantener tu sesión iniciada. Se eliminan al cerrar sesión.</li>
        <li><strong>Preferencias locales:</strong> almacenadas en <code>localStorage</code> del navegador. No son cookies propiamente dichas y no se envían a ningún servidor.</li>
      </ul>
      <h4>Cookies de terceros</h4>
      <p>Google Maps puede establecer cookies propias al cargar el mapa interactivo. Consulta la política de Google en <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">policies.google.com</a>.</p>
      <h4>¿Cómo desactivarlas?</h4>
      <p>Puedes configurar tu navegador para bloquear o eliminar cookies. Ten en cuenta que desactivar las cookies de sesión impedirá iniciar sesión en la aplicación.</p>
      <h4>Más información</h4>
      <p>Al tratarse de un proyecto académico sin finalidad comercial, no se utilizan cookies de seguimiento, publicidad ni analítica de terceros.</p>
    `
  },
  'contacto': {
    title: 'Contacto',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:24px;height:24px;vertical-align:middle;margin-right:8px;"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>`,
    body: `
      <h4>Autor del proyecto</h4>
      <p><strong>Ángel Galea Anisa</strong><br/>Alumno de Desarrollo de Aplicaciones Web<br/>IES Albarregas · Badajoz · Curso 2025/2026</p>
      <h4>Correo de contacto</h4>
      <p>Para consultas relacionadas con el proyecto TFG:<br/><a href="mailto:angegalea@outlook.es">angegalea@outlook.es</a></p>
      <h4>Sobre el proyecto</h4>
      <p>Plataforma desarrollada con fines académicos para el TFG de Desarrollo de Aplicaciones Web. Cualquier sugerencia o consulta técnica es bienvenida.</p>
      <h4>Fuente de datos oficiales</h4>
      <p>Para datos y noticias oficiales del Carnaval: <a href="https://carnavaldebadajoz.org" target="_blank" rel="noopener">carnavaldebadajoz.org</a></p>
    `
  }
};

// Abrir modal con SVG en el título
function openModal(type) {
  const modal = document.getElementById('docModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  
  const content = modalContent[type];
  if (content) {
    title.innerHTML = `${content.svg} ${content.title}`;
    body.innerHTML = content.body;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

// Cerrar modal
function closeModal() {
  const modal = document.getElementById('docModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Eventos: enlaces del footer (igual que antes)
document.addEventListener('DOMContentLoaded', () => {
  const manualLinks = {
    'Manual de Usuario': 'manual-usuario',
    'Manual Técnico': 'manual-tecnico',
    'Manual de Despliegue': 'manual-despliegue'
  };
  
  const footerLinks = document.querySelectorAll('.footer-col a');
  footerLinks.forEach(link => {
    const linkText = link.innerText.trim();
    if (manualLinks[linkText]) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(manualLinks[linkText]);
      });
    }
  });
  
  const closeBtn = document.getElementById('closeModalBtn');
  const overlay = document.querySelector('.modal-overlay');
  
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);
  
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('docModal').style.display === 'flex') {
      closeModal();
    }
  });
});