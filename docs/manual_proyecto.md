# Manual de Proyecto — Carnaval de Badajoz

**Autor:** Ángel Galea Anisa  
**Proyecto:** Trabajo de Fin de Grado — Desarrollo de Aplicaciones Web (DAW)  
**Centro:** IES Albarregas | Curso 2025/2026  
**Versión:** 1.0

---

## 1. Introducción y objetivos

**Carnaval de Badajoz** es una aplicación web completa que centraliza toda la información relevante de las fiestas del Carnaval de Badajoz, declarado Fiesta de Interés Turístico Internacional.

La aplicación permite a los usuarios consultar el programa de eventos (murgas, comparsas, artefactos, grupos de animación y desfiles), visualizar los escenarios en un mapa interactivo, guardar eventos como favoritos, publicar comentarios, y —en el caso de los administradores— gestionar el contenido en tiempo real.

### Objetivos principales

- Unificar la información actualmente dispersa en redes sociales, cartelería física y medios tradicionales.
- Ofrecer una experiencia digital moderna, responsive y accesible desde cualquier dispositivo.
- Fomentar la participación de los asistentes mediante funciones sociales (favoritos, comentarios).
- Dotar a los organizadores de una herramienta ágil para actualizar horarios y eventos en tiempo real.

---

## 2. Justificación del cambio tecnológico

Inicialmente el proyecto se planteó con un backend tradicional en PHP (Laravel) o Node.js. Durante el desarrollo se optó por **Supabase** por las razones que se detallan a continuación.

| Aspecto | Backend tradicional | Supabase (serverless) |
|---|---|---|
| Tiempo de desarrollo | Mayor (crear API, autenticación, validaciones) | Reducido drásticamente (servicios listos) |
| Escalabilidad | Requiere configuración de servidores | Automática y sin intervención |
| Mantenimiento | Necesita actualizaciones y parches | Gestionado por Supabase |
| Coste | Alojamiento propio | Plan gratuito suficiente para el TFG |
| Seguridad | Implementación manual | RLS y autenticación integrada |
| Tiempo dedicado a UI/UX | Menor (invertido en backend) | Máximo; se pudo refinar la interfaz |

**Decisión final:** se eligió Supabase para garantizar la escalabilidad y centrar el esfuerzo en mejorar la experiencia de usuario, la calidad del frontend y las funcionalidades específicas del carnaval.

---

## 3. Metodología de desarrollo

Se ha seguido un enfoque **ágil con iteraciones cortas** (sprints de 1–2 semanas). Las fases principales fueron:

1. Análisis de requisitos y diseño del modelo Entidad-Relación *(primer trimestre)*.
2. Configuración de Supabase y creación de las tablas con políticas RLS.
3. Desarrollo del frontend (HTML/CSS/JS) y conexión con Supabase.
4. Implementación de funciones específicas (mapa, favoritos, comentarios, administración).
5. Pruebas unitarias manuales y pruebas de integración con Supabase.
6. Elaboración de la documentación (manuales, memoria).

**Control de versiones:** Git + GitHub — repositorio: [AngeloteXD888/TFG](https://github.com/AngeloteXD888/TFG)

---

## 4. Estado actual del proyecto

El proyecto cubre los dos trimestres del módulo profesional de Proyecto Intermodular de DAW.

### Primer trimestre
- Diseño de la base de datos y modelo Entidad/Relación.
- Creación de las tablas en Supabase.
- Esqueleto HTML/CSS de las tres páginas.

### Segundo trimestre
- Integración completa con Supabase: autenticación, CRUD de eventos, favoritos, comentarios.
- Panel de administración.
- Mapa interactivo con Google Maps.
- Pruebas y documentación final.

### Funcionalidades implementadas

- Registro/login de usuarios con confirmación de correo electrónico.
- Sesión anónima sin credenciales.
- Visualización del programa de eventos con filtros por categoría, día, escenario y búsqueda textual.
- Mapa interactivo con todos los escenarios del carnaval y rutas de los desfiles.
- Guardar/eliminar eventos favoritos (solo usuarios registrados).
- Sistema de comentarios con detección de lenguaje ofensivo y moderación para administradores.
- Panel de administración: CRUD completo de eventos, asignación de agrupaciones y moderación de comentarios.
- Edición de perfil de usuario (nombre, apellidos, teléfono, fecha de nacimiento, avatar).
- Subida de avatar a Supabase Storage.
- Redirección automática si ya existe sesión activa al entrar a la página de login.

### Fuera del alcance (por tiempo)

- Notificaciones push.
- Galería multimedia de fotos.
- Integración con redes sociales.

---

## 5. Modelo de datos (Entidad-Relación)

### Entidades y atributos principales

| Entidad | Atributos principales |
|---|---|
| `persona` | `id_persona` (UUID), `nombre`, `apellidos`, `email`, `telefono`, `fecha_nacimiento`, `contrasena`, `fecha_registro`, `rol`, `avatar_url` |
| `evento` | `id` (serial), `nombre`, `categoria`, `dia`, `hora`, `id_ubicacion` (FK), `descripcion` |
| `ubicacion` | `id_ubicacion` (serial), `nombre`, `direccion`, `latitud`, `longitud` |
| `agrupacion` | `id_agrupacion` (serial), `nombre`, `categoria`, `descripcion` |
| `participacion` | `id_participacion` (serial), `id_evento` (FK), `id_agrupacion` (FK), `anio` |
| `publicacion` | `id_publicacion` (serial), `id_persona` (FK), `id_evento` (FK), `tipo`, `contenido`, `fecha` |
| `favorito` | `id_persona` (FK), `id_evento` (FK) — clave compuesta |

### Relaciones clave

- **Evento — Ubicación:** N:1 (un evento se celebra en una ubicación; una ubicación puede albergar muchos eventos).
- **Evento — Agrupación:** N:M mediante la tabla `participacion`.
- **Usuario — Favorito:** 1:N.
- **Usuario — Publicación:** 1:N (un usuario puede tener muchos comentarios).

### Justificación de las decisiones de diseño

- **Normalización:** se evita redundancia separando ubicaciones y agrupaciones en tablas propias.
- **Tabla `participacion`:** permite conocer en qué eventos actúa cada agrupación y en qué año, facilitando la reutilización del modelo para ediciones futuras.
- **`favorito` como tabla independiente:** facilita consultas eficientes y estadísticas por usuario.

---

## 6. Roles y permisos

La asignación de roles se gestiona mediante el campo `rol` en la tabla `persona` (valores: `usuario`, `admin`).

| Rol | Capacidades |
|---|---|
| Anónimo (sin login) | Ver programa, mapa y comentarios. No puede guardar favoritos ni comentar. |
| Usuario registrado | Todo lo anterior + guardar favoritos, comentar, editar su perfil y subir avatar. |
| Administrador | Todo lo de usuario registrado + panel de admin: crear/editar/eliminar eventos, asignar agrupaciones y moderar comentarios. |

---

## 7. Funcionalidades detalladas por módulo

### 7.1. Landing page (`index.html`)

Presentación del proyecto con secciones de características, tecnologías, cómo funciona y roles.

- Botón **"Empezar"** → redirige a `auth.html`.
- Botón **"Explorar como invitado"** → permite entrar a la app sin registro (sesión anónima).
- Confeti animado y efecto parallax en el hero.

### 7.2. Autenticación (`auth.html`)

- Registro con validación de nombre, teléfono, fecha de nacimiento (mínimo 14 años), email y contraseña segura.
- Confirmación de correo electrónico obligatoria antes del primer acceso.
- Subida opcional de avatar.
- Login con email/contraseña.
- Redirección automática si ya hay sesión activa.
- Modal de términos y condiciones con scroll obligatorio para aceptar.

### 7.3. Aplicación principal (`app.html`)

- **Inicio:** estadísticas, próximos eventos y ganadores del COMBA 2026.
- **Programa:** listado de eventos con filtros (categoría, día, escenario, búsqueda). Modal con detalles, comentarios y agrupaciones participantes.
- **Mapa:** Google Maps centrado en Badajoz. Lista de escenarios y botones para mostrar los recorridos de los desfiles.
- **Favoritos:** lista de eventos guardados por el usuario registrado.
- **Admin:** tabla de eventos con acciones Editar, Participantes y Eliminar. Panel de moderación de comentarios con indicador de contenido prohibido.

### 7.4. Gestión de perfil

Desde la barra lateral, el usuario registrado puede editar su nombre, apellidos, nombre de usuario, teléfono, fecha de nacimiento y foto de perfil. Los cambios se persisten en Supabase y se reflejan de forma inmediata en la interfaz.