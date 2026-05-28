# Manual Técnico — Carnaval de Badajoz

**Autor:** Ángel Galea Anisa  
**Proyecto:** Trabajo de Fin de Grado — Desarrollo de Aplicaciones Web (DAW)  
**Centro:** IES Albarregas | Curso 2025/2026  
**Versión:** 1.0

---

## 1. Arquitectura general

La aplicación sigue una arquitectura **serverless orientada a frontend puro**. No existe backend propio; toda la lógica de persistencia y autenticación se delega a Supabase.

```
+--------------+      HTTPS       +-----------------+
|  Navegador   | <--------------> |    Supabase     |
|  (HTML/JS)   |                  |  Auth, DB,      |
|              |                  |  Storage        |
+--------------+                  +-----------------+
                                          |
                                          v
                                  +--------------+
                                  | Google Maps  |
                                  |     API      |
                                  +--------------+
```

### Flujo de datos

1. El usuario interactúa con la interfaz HTML/JS.
2. Las funciones de `dashboard.js` y `supabase.js` realizan peticiones HTTP directamente a los endpoints de Supabase (REST).
3. Supabase aplica las políticas de seguridad (RLS) y devuelve o almacena los datos.
4. El mapa se carga mediante la API de Google Maps; los marcadores se generan a partir de las ubicaciones almacenadas en la base de datos.

---

## 2. Tecnologías utilizadas

| Tecnología | Versión / Uso |
|---|---|
| HTML5 | Estructura de las páginas (`index.html`, `auth.html`, `app.html`) |
| CSS3 | Estilos con diseño responsive, variables CSS y animaciones (`landing.css`, `dashboard.css`, `auth.css`) |
| JavaScript ES6+ | Lógica de cliente, manipulación del DOM, peticiones asíncronas |
| Supabase JS Library | Cliente para autenticación, base de datos y almacenamiento (`supabase.min.js` + wrapper `supabase.js`) — v2.106.0 |
| Google Maps API | Visualización del mapa, marcadores, rutas de desfiles |
| Google Fonts | Outfit (sans-serif) y Playfair Display (titulares) |
| Sin bundler | El proyecto se sirve directamente sin paso de compilación (JS nativo) |

---

## 3. Estructura de archivos

```
/
├── index.html              # Página de aterrizaje (landing)
├── auth.html               # Formularios de registro/login
├── app.html                # Aplicación principal (dashboard)
├── css/
│   ├── landing.css         # Estilos de la landing page
│   ├── auth.css            # Estilos de autenticación
│   └── dashboard.css       # Estilos de la app interna
├── js/
│   ├── landing.js          # Efectos visuales de la landing
│   ├── auth.js             # Lógica de registro/login y validaciones
│   ├── dashboard.js        # Núcleo de la app: eventos, favoritos, mapa, admin
│   ├── supabase.js         # Wrapper de funciones específicas de Supabase
│   └── lib/
│       └── supabase.min.js # Cliente oficial de Supabase (comprimido)
└── sql/
    └── schema.sql          # Script de tablas y políticas RLS
```

---

## 4. Descripción de los módulos principales

### 4.1. `supabase.js`

Encapsula todas las interacciones con Supabase. Exporta funciones asíncronas que devuelven promesas.

**Autenticación**

| Función | Descripción |
|---|---|
| `supabaseSignUp()` | Registro de nuevos usuarios |
| `supabaseSignIn()` | Inicio de sesión con email y contraseña |
| `supabaseSignOut()` | Cierre de sesión |
| `supabaseGetUser()` | Obtener el usuario autenticado actual |
| `supabaseSignInAnonymously()` | Sesión anónima sin credenciales |

**Datos**

| Función | Descripción |
|---|---|
| `supabaseGetFavoritos()` / `supabaseAddFavorito()` / `supabaseRemoveFavorito()` | Gestión de favoritos |
| `supabaseGetComentarios()` / `supabaseAddComentario()` / `supabaseDeleteComentario()` | Comentarios |
| `supabaseGetEventos()` / `supabaseAddEvento()` / `supabaseUpdateEvento()` / `supabaseDeleteEvento()` | CRUD de eventos |
| `supabaseGetUbicaciones()` / `supabaseGetAgrupaciones()` / `supabaseGetParticipaciones()` | Datos complementarios |
| `supabaseUploadAvatar()` / `supabaseUpdatePerfil()` | Gestión de perfil y avatar |

**Seguridad:** contiene la lista `PALABRAS_PROHIBIDAS` y la función `contienePalabrotas()` que filtra comentarios antes de guardarlos en la base de datos.

---

### 4.2. `dashboard.js`

Controlador principal de `app.html`. Gestiona el estado de la aplicación, el renderizado de eventos, el mapa, los favoritos, los comentarios y el panel de administración.

**Variables globales de estado**

| Variable | Descripción |
|---|---|
| `EVENTOS` | Array con todos los eventos cargados desde Supabase |
| `favoritos` | Array de IDs de eventos favoritos del usuario actual |
| `currentUser` | Objeto con datos del usuario autenticado |
| `map` | Instancia del mapa de Google Maps |
| `ubicacionesList` | Lista de escenarios y ubicaciones |

**Funciones principales**

- `initMap()`, `crearTodosLosMarcadores()`, `toggleRecorridoDesfile()` — mapa y rutas.
- `renderEventos()`, `applyFilters()`, `clearFilters()` — filtrado y visualización.
- `toggleFav()`, `renderFavoritos()`, `updateFavBadge()` — favoritos.
- `addComment()`, `deleteComment()`, `renderComments()`, `renderModerationPanel()` — comentarios y moderación.
- `openAddEventModal()`, `addEventFromAdmin()`, `saveEditEvento()` — administración de eventos.
- `openParticipacionesModal()`, `addParticipacion()`, `removeParticipacion()` — gestión de agrupaciones.
- `openProfileModal()`, `saveProfile()` — perfil de usuario.
- `requireAuth()` — bloquea funciones para usuarios no registrados y muestra un modal.

---

### 4.3. `auth.js`

Maneja el flujo de autenticación en `auth.html`.

**Funciones**

- `handleLogin()` — valida credenciales y llama a `supabaseSignIn()`.
- `handleRegister()` — valida el formulario completo y llama a `supabaseSignUp()`. Sube el avatar si se seleccionó.
- `switchTab()` — cambia entre formulario de login y registro.
- `togglePass()` — muestra u oculta la contraseña.
- `setLoading()` — controla el spinner de los botones.
- `openTermsModal()`, `acceptTermsModal()` — modal de términos con scroll obligatorio.

**Validaciones del formulario de registro**

- Fuerza de contraseña: longitud mínima, mayúsculas, números y símbolos.
- Fecha de nacimiento: edad mínima de 14 años.
- Teléfono: validado con expresión regular.
- Confirmación de contraseña.
- Aceptación obligatoria de los términos y condiciones.
- Comprobación de sesión activa al cargar la página: si ya existe sesión, redirige automáticamente a `app.html`.

---

### 4.4. `landing.js`

Efectos visuales en la página de inicio (`index.html`):

- Confeti animado al cargar la página.
- Efecto de parallax en los orbes del hero.
- Scroll reveal mediante Intersection Observer.
- Resaltado de enlaces activos según la sección visible en pantalla.

---

## 5. Seguridad implementada

### 5.1. Row Level Security (RLS) en Supabase

Todas las tablas tienen políticas restrictivas definidas en `schema.sql`:

| Tabla | Lectura | Escritura |
|---|---|---|
| `evento`, `ubicacion`, `agrupacion` | Pública (cualquier visitante) | Solo administradores |
| `publicacion` | Pública | Solo usuarios autenticados |
| `favorito` | Solo el propio usuario | Solo el propio usuario |
| `persona` | Solo el propio usuario | Solo el propio usuario |

### 5.2. Filtro de contenido ofensivo

Antes de insertar un comentario en la base de datos, `contienePalabrotas()` normaliza el texto (minúsculas, sin tildes, sustitución de caracteres de evasión como `0→o`, `1→i`, `@→a`) y lo compara contra una lista de palabras prohibidas. Si se detecta alguna, el comentario se rechaza en el cliente sin llegar a Supabase.

### 5.3. Confirmación de correo

Con la opción "Confirm email" activada en Supabase, ningún usuario puede iniciar sesión hasta haber confirmado su cuenta desde el correo recibido. El perfil en la tabla `persona` se crea en el primer login tras la confirmación, usando los metadatos guardados en `user_metadata` durante el registro.

---

## 6. Modelo de datos

### Tablas

| Entidad | Atributos principales |
|---|---|
| `persona` | `id_persona` (UUID), `nombre`, `apellidos`, `email`, `telefono`, `fecha_nacimiento`, `contrasena`, `fecha_registro`, `rol`, `avatar_url` |
| `evento` | `id` (serial), `nombre`, `categoria`, `dia`, `hora`, `id_ubicacion` (FK), `descripcion` |
| `ubicacion` | `id_ubicacion` (serial), `nombre`, `direccion`, `latitud`, `longitud` |
| `agrupacion` | `id_agrupacion` (serial), `nombre`, `categoria`, `descripcion` |
| `participacion` | `id_participacion` (serial), `id_evento` (FK), `id_agrupacion` (FK), `anio` |
| `publicacion` | `id_publicacion` (serial), `id_persona` (FK), `id_evento` (FK), `tipo`, `contenido`, `fecha` |
| `favorito` | `id_persona` (FK), `id_evento` (FK) — clave compuesta |

### Relaciones

- **Evento — Ubicación:** N:1 (un evento se celebra en una ubicación; una ubicación puede albergar muchos eventos).
- **Evento — Agrupación:** N:M mediante la tabla `participacion`.
- **Usuario — Favorito:** 1:N.
- **Usuario — Publicación:** 1:N.

---

## 7. Variables de configuración

Definidas en `js/supabase.js` y `js/dashboard.js`:

```js
// supabase.js
const SUPABASE_URL     = 'https://eyqfabyctclrugfiwsei.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGci...';

// dashboard.js
const GOOGLE_MAPS_API_KEY = 'AIzaSyC10qy-WNqjCRyn5633_vbnrnBL5dQiKUc';
```

> En un entorno de producción real se recomienda mover estas claves a variables de entorno (por ejemplo `import.meta.env` con Vite, o variables de entorno de Vercel) en lugar de incluirlas directamente en el código fuente.