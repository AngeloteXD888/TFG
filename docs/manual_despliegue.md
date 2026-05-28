# Manual de Despliegue — Carnaval de Badajoz

**Autor:** Ángel Galea Anisa  
**Proyecto:** Trabajo de Fin de Grado — Desarrollo de Aplicaciones Web (DAW)  
**Centro:** IES Albarregas | Curso 2025/2026  
**Versión:** 1.0

---

## 1. Requisitos previos

Antes de desplegar la aplicación, asegúrate de contar con lo siguiente:

- Una cuenta activa en [Supabase](https://supabase.com) con un proyecto creado.
- Una API Key de Google Maps con las siguientes APIs habilitadas:
  - **Maps JavaScript API** (obligatoria).
  - **Geocoding API** (opcional).
- Los archivos del proyecto: `index.html`, `auth.html`, `app.html`, `css/`, `js/`, etc.
- Un editor de texto para modificar los archivos de configuración si fuera necesario.

---

## 2. Configuración de Supabase

El archivo `js/supabase.js` ya contiene las credenciales del proyecto correctamente configuradas:

```js
const SUPABASE_URL     = 'https://eyqfabyctclrugfiwsei.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

No es necesario modificarlas a menos que se cambie de proyecto en Supabase.

### 2.1. Estructura de la base de datos

Las tablas del proyecto (`persona`, `evento`, `ubicacion`, `agrupacion`, `participacion`, `publicacion`, `favorito`) ya están creadas en Supabase. Si en algún momento fuera necesario recrearlas, ejecuta el script `schema.sql` incluido en la carpeta `sql/` del proyecto desde el SQL Editor de Supabase.

### 2.2. Confirmación de correo electrónico

Para que el registro exija confirmación de correo antes del primer acceso:

1. Ve a **Supabase Dashboard → Authentication → Providers → Email**.
2. Activa la opción **"Confirm email"**.
3. Guarda los cambios.

Opcionalmente, personaliza el asunto y cuerpo del correo en **Authentication → Email Templates**.

### 2.3. Bucket de almacenamiento para avatares

El bucket `avatars` debe existir y ser público para que la subida de imágenes funcione:

1. Ve a **Supabase Dashboard → Storage → Create bucket**.
2. Nombre del bucket: `avatars`.
3. Marca la opción **Public bucket**.
4. Opcionalmente, crea una política que permita a usuarios autenticados subir archivos.

### 2.4. Usuario administrador

Para disponer de un administrador, inserta un registro en la tabla `persona` con `rol = 'admin'`, usando el UUID real del usuario creado en **Authentication → Users**:

```sql
INSERT INTO public.persona
  (id_persona, nombre, email, contrasena, rol, telefono, fecha_nacimiento)
VALUES (
  'UUID_DEL_USUARIO_EN_AUTH',
  'Admin',
  'admin@carnaval.com',
  '***',
  'admin',
  '616229371',
  '2000-01-01'
);
```

> El campo `contrasena` se almacena como `'***'` porque la contraseña real ya está gestionada por Supabase en `auth.users`.

---

## 3. Configuración de Google Maps API

La clave de Google Maps aparece en dos lugares del proyecto y debe ser la misma en ambos.

**En `app.html`:**

```html
<script src="https://maps.googleapis.com/maps/api/js
  ?key=AIzaSyC10qy-WNqjCRyn5633_vbnrnBL5dQiKUc
  &callback=initMap">
</script>
```

**En `js/dashboard.js`:**

```js
const GOOGLE_MAPS_API_KEY = 'AIzaSyC10qy-WNqjCRyn5633_vbnrnBL5dQiKUc';
```

Si se utiliza una clave propia, reemplázala en ambos archivos. Se recomienda restringir el uso de la clave a los dominios donde se vaya a desplegar (por ejemplo `*.vercel.app` o `tudominio.com`) desde [Google Cloud Console](https://console.cloud.google.com/apis/credentials).

---

## 4. Despliegue del frontend

### Opción A: Despliegue manual (subida directa)

1. Copia todos los archivos y carpetas del proyecto a tu hosting estático (servidor FTP o carpeta pública de un hosting compartido).
2. La página de inicio debe ser `index.html`.
3. Accede a la URL que proporcione el proveedor de hosting.

### Opción B: Despliegue en Vercel (recomendado)

1. Sube el código a un repositorio de GitHub.
2. Inicia sesión en [Vercel](https://vercel.com) → **Add New → Project**.
3. Importa el repositorio desde GitHub.
4. No es necesario configurar variables de entorno, ya que las claves están incluidas en los archivos del proyecto.
5. Haz clic en **Deploy**.
6. Vercel proporcionará una URL pública del tipo `carnaval-badajoz.vercel.app`.

> **Repositorio del proyecto:** [https://github.com/AngeloteXD888/TFG.git](https://github.com/AngeloteXD888/TFG.git)

---

## 5. Verificación post-despliegue

Una vez desplegada la aplicación, comprueba que las siguientes funcionalidades operan correctamente:

| Funcionalidad | Cómo probarla |
|---|---|
| Página de inicio | Debe cargar con el confeti, el hero y todas las secciones. |
| Registro de usuario | Crea una cuenta en `auth.html`; verifica que llega el correo de confirmación y que tras confirmarlo aparece el registro en la tabla `persona` de Supabase. |
| Inicio de sesión | Accede con el usuario creado. El avatar y nombre deben mostrarse en la barra lateral de `app.html`. |
| Sesión activa | Intenta volver a `auth.html` con sesión iniciada; debe redirigir automáticamente a `app.html`. |
| Programa de eventos | En la sección Programa deben aparecer los eventos cargados desde Supabase. |
| Favoritos | Haz clic en el corazón de un evento. Debe guardarse en la tabla `favorito` y el contador debe aumentar. |
| Comentarios | Escribe un comentario en el modal de un evento. Debe insertarse en `publicacion`. Si contiene insultos, lo rechazará. |
| Mapa interactivo | La sección Mapa debe cargar centrada en Badajoz con los marcadores de escenarios y los botones de rutas funcionando. |
| Panel de administración | Inicia sesión con rol `admin`. Aparece el ítem "Admin" en el menú. Prueba editar un evento y moderar comentarios. |
| Editar perfil | Haz clic en el lápiz de la barra lateral. Cambia datos y avatar. Los cambios deben reflejarse en `persona` y en la interfaz. |

---

## 6. Solución de problemas comunes

| Problema | Posible causa | Solución |
|---|---|---|
| Error `Failed to fetch` en la consola | Las credenciales de Supabase no son correctas o la URL está mal | Revisa `SUPABASE_URL` y `SUPABASE_ANON_KEY` en `supabase.js`. |
| El mapa no se muestra o aparece `InvalidKeyMapError` | La API Key de Google Maps no es válida o la Maps JavaScript API no está habilitada | Regenera la clave en Google Cloud Console, habilita la API y restringe el dominio. |
| Los avatares no se ven o no se suben | El bucket `avatars` no es público o las políticas RLS lo impiden | Ve a Storage → `avatars` → marca Public. Comprueba las políticas RLS. |
| Un usuario no puede guardar favoritos | Falta la fila en `persona` para ese usuario | Comprueba que `supabaseSignUp` inserta en `persona`. Si no, ejecuta la inserción manual. |
| El botón "Admin" no aparece con rol admin | La sesión no se ha actualizado o el valor del rol no es exactamente `'admin'` | Cierra sesión y vuelve a entrar. Verifica en la tabla `persona` que el rol sea exactamente `admin` en minúsculas. |
| El usuario no recibe el correo de confirmación | La opción "Confirm email" no está activada en Supabase o el correo cayó en spam | Activa la opción en Authentication → Providers → Email. Revisa la carpeta de spam. |
| Al registrarse redirige a `app.html` sin confirmar | La opción "Confirm email" no está activada | Actívala en Supabase como se indica en el apartado 2.2. |

---

## 7. Recomendaciones adicionales

- **Protección de claves:** en un entorno real de producción se recomienda usar variables de entorno en Vercel y leerlas desde JavaScript mediante `import.meta.env`, en lugar de incluirlas directamente en el código.
- **Backups:** realiza copias de seguridad periódicas de la base de datos desde **Supabase → Settings → Database → Backups**.
- **Monitorización:** Supabase ofrece logs y métricas básicas en su panel; revísalas si detectas lentitud o errores.
- **Dominio personalizado:** Vercel permite asignar un dominio propio (por ejemplo `carnavalbadajoz.es`) siguiendo su guía de configuración de DNS.

---

## 8. Enlaces de interés

- Aplicación desplegada: [https://tfg-pearl.vercel.app/](https://tfg-pearl.vercel.app/)
- Repositorio GitHub: [https://github.com/AngeloteXD888/TFG.git](https://github.com/AngeloteXD888/TFG.git)
- Dashboard de Supabase: [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Google Cloud Console (credenciales): [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
- Vercel — documentación de despliegue: [https://vercel.com/docs](https://vercel.com/docs)