# Manual de Usuario — Carnaval de Badajoz

**Aplicación web para consultar el programa, guardar favoritos, ver el mapa interactivo y participar en la comunidad del Carnaval de Badajoz.**

> TFG · Ángel Galea Anisa · IES Albarregas · 2025/2026

---

## 1. Primeros pasos

Accede a la web desde cualquier dispositivo con navegador (móvil, tablet u ordenador). No necesitas instalar nada.

**URL de acceso:** [https://tfg-pearl.vercel.app/](https://tfg-pearl.vercel.app/)

### Pantalla de bienvenida (Landing)

Desde la pantalla de inicio puedes:

- Hacer clic en **"Descubrir la App"** o **"Empezar"** para ir a la página de acceso.
- Hacer clic en **"Explorar como invitado"** para entrar directamente sin registrarte (verás menos funciones).

---

## 2. Registrarse o iniciar sesión

En la página `auth.html` encontrarás dos pestañas: **Iniciar Sesión** y **Registrarse**.

### Inicio de sesión (si ya tienes cuenta)

1. Introduce tu correo electrónico o nombre de usuario y tu contraseña.
2. Marca **"Recordarme"** si quieres que la sesión permanezca abierta.
3. Pulsa **"Entrar al Carnaval"**.

> Si ya tienes una sesión activa, la aplicación te redirigirá automáticamente sin mostrar el formulario.

### Registro (crear cuenta nueva)

Rellena todos los campos del formulario:

| Campo | Obligatorio | Notas |
|---|---|---|
| Nombre | Sí | — |
| Apellidos | No | — |
| Nombre de usuario | Sí | 3–20 caracteres; solo minúsculas, números, puntos y guiones bajos |
| Teléfono | Sí | Formato nacional o internacional |
| Fecha de nacimiento | Sí | Debes tener al menos 14 años |
| Correo electrónico | Sí | No se podrá cambiar después |
| Contraseña | Sí | Mínimo 8 caracteres; se muestra el nivel de seguridad |
| Confirmar contraseña | Sí | — |
| Foto de perfil | No | JPEG, PNG o WEBP; máximo 2 MB |

Marca la casilla **"Acepto los términos y condiciones"**. Al hacer clic en el enlace se abre el texto completo; desplázalo hasta el final para habilitar el botón de aceptar. Pulsa **"Crear mi cuenta"**.

> **Importante:** Recibirás un correo de confirmación. Debes confirmarlo antes de poder iniciar sesión.

### Modo invitado (sin registro)

Pulsa "Explorar como invitado" en la página de inicio. Podrás ver el programa completo y el mapa, pero **no podrás** guardar favoritos, comentar ni acceder al perfil.

---

## 3. Pantalla principal (Inicio)

Al entrar a la app verás el panel principal con los siguientes elementos:

- **Barra lateral izquierda (menú):** en móvil se oculta y se abre con el botón ☰ arriba a la izquierda.
- **Tarjetas de estadísticas:** número de agrupaciones (171), días de carnaval (10), escenarios (15) y tus favoritos guardados.
- **Próximos eventos:** lista de los próximos desfiles con fecha y hora.
- **Ganadores COMBA 2026:** clasificación oficial de las agrupaciones.
- **Categorías rápidas:** botones para filtrar por tipo (Murgas, Comparsas, Artefactos, etc.) que te llevan directamente a la sección Programa aplicando ese filtro.

---

## 4. Programa de eventos

Accede desde el menú lateral: **"Programa"**. Aquí encontrarás todos los eventos ordenados por fecha.

### Filtrar eventos

Puedes combinar varios filtros a la vez:

- **Categoría:** Murga, Comparsa, Artefacto, Grupo Animación o Desfile.
- **Día:** desde el sábado 8 de febrero hasta el lunes 17 de febrero.
- **Escenario:** Recinto Ferial, Teatro López de Ayala, Casco Antiguo, etc.
- **Buscador:** escribe parte del nombre de la agrupación o una palabra de la descripción.

El botón **"✕ Limpiar"** quita todos los filtros y muestra todos los eventos de nuevo.

### Tarjetas de eventos

Cada tarjeta muestra el nombre de la agrupación, día, hora, escenario y categoría (con etiqueta de color). Si has iniciado sesión, aparece el botón de favorito. Haz clic en cualquier parte de la tarjeta para abrir el detalle completo.

### Detalle del evento

Al abrir una tarjeta se muestra una ventana emergente con:

- Nombre, categoría, día, hora y escenario.
- Descripción del evento.
- Agrupaciones participantes (agrupadas por categoría).
- Botones **"Añadir a favoritos"** y **"Ver en el mapa"**.
- Sección de comentarios (solo para usuarios registrados).

> Los comentarios con insultos o palabras malsonantes son bloqueados automáticamente. Los administradores pueden eliminar cualquier comentario.

---

## 5. Mapa interactivo

Accede desde el menú lateral: **"Mapa"**. Muestra todos los escenarios del Carnaval sobre un plano de Badajoz.

- **Panel izquierdo:** lista de todos los escenarios. Haz clic en uno para centrar el mapa.
- **Panel derecho:** mapa con marcadores morados. Pulsa sobre un marcador para ver el nombre del escenario.
- **Botones de recorridos** (arriba del mapa):
  - **Gran Desfile** — recorrido oficial del desfile de adultos.
  - **Desfile Infantil** — recorrido del desfile de comparsas infantiles.
  - **Entierro Sardina** y **Despedida** — sus respectivos recorridos.
  - Pulsa el mismo botón de nuevo para ocultar la ruta.

> En móvil, gira el teléfono horizontalmente para ver mejor el mapa.

---

## 6. Mis Favoritos

> Requiere tener sesión iniciada. Si entras como invitado, verás un mensaje invitándote a registrarte.

### Cómo añadir favoritos

- En la sección Programa, haz clic en el corazón vacío de cualquier tarjeta.
- También puedes añadirlos desde el modal de detalle pulsando **"Añadir a favoritos"**.

### Cómo ver tus favoritos

Ve a **"Favoritos"** en el menú lateral. Aparecerán todos los eventos guardados, ordenados igual que en el programa. Puedes quitar un favorito desde la tarjeta o desde el detalle (el corazón volverá a quedar vacío). El contador del menú lateral muestra cuántos tienes guardados.

---

## 7. Mi Perfil (editar datos)

> Solo disponible para usuarios registrados.

Haz clic en el icono del lápiz junto a tu avatar en la barra lateral inferior. Se abre un modal con tus datos actuales.

Puedes modificar:

- Nombre y apellidos
- Nombre de usuario
- Teléfono
- Fecha de nacimiento
- Foto de perfil (haz clic en el círculo, selecciona una imagen JPEG/PNG/WEBP de máximo 2 MB)

> El correo electrónico **no se puede cambiar**, ya que es tu identificador único. Pulsa **"Guardar cambios"** para aplicar. La nueva foto se verá en la barra lateral y en tus comentarios.

---

## 8. Panel de Administración

> Solo visible para usuarios con rol de administrador.

Accede desde el menú lateral: **"Admin"**.

### Gestión de eventos

La tabla muestra todas las agrupaciones con columnas: nombre, categoría, día, hora, escenario y acciones.

- **+ Añadir evento:** abre un formulario para crear un nuevo evento. Puedes vincular agrupaciones participantes desde el mismo modal.
- **Editar:** modifica cualquier dato del evento.
- **Participantes:** añade o quita agrupaciones vinculadas al evento.
- **Eliminar:** borra el evento y todas sus participaciones.

### Moderación de comentarios

Muestra los últimos 50 comentarios publicados con el usuario, el evento asociado, el texto y la fecha. Los comentarios con palabras prohibidas aparecen con una etiqueta de advertencia. Usa el botón **"Eliminar"** para borrar los inapropiados.

---

## 9. Otras funciones

### Cerrar sesión

En la barra lateral inferior, pulsa el botón con icono de puerta. Volverás a la página de acceso.

### Volver a la landing

En el menú lateral, al final, **"Volver al inicio"** te lleva a la página pública de presentación del carnaval.

### Notificaciones (toast)

Cuando realizas una acción (guardar favorito, publicar comentario, editar perfil, etc.), aparece un pequeño mensaje flotante en la esquina inferior derecha que desaparece solo a los pocos segundos.