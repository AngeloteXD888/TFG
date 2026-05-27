/* ============================================================
   CARNAVAL DE BADAJOZ — Supabase Client
   Author: Ángel Galea Anisa | TFG 2025/2026
   Conexión con Supabase (Auth + Base de Datos)
   ============================================================ */

// =====================================================================
// CONFIGURACIÓN SUPABASE
// =====================================================================
const SUPABASE_URL = 'https://eyqfabyctclrugfiwsei.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cWZhYnljdGNscnVnZml3c2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTQzNjksImV4cCI6MjA5MjI3MDM2OX0.YpZaUEA5ls56f88_MFUZhhl2BxIsXUDXX_yI7zDR02g';

// Crear cliente Supabase
const { createClient } = window.supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =====================================================================
// AUTENTICACIÓN
// =====================================================================

/**
 * Registrar un nuevo usuario con email y contraseña.
 * También inserta su perfil en la tabla 'persona'.
 */
async function supabaseSignUp(nombre, apellidos, email, password, telefono, fechaNacimiento, username) {
  try {
    // Verificar que el username no esté ya en uso
    const { data: existingUser } = await supabaseClient
      .from('persona')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      return { user: null, error: 'Ese nombre de usuario ya está en uso.' };
    }

    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { nombre: nombre, apellidos: apellidos, username: username }
      }
    });

    if (error) {
      return { user: null, error: traducirError(error.message) };
    }

    if (data.user) {
      const { error: profileError } = await supabaseClient
        .from('persona')
        .insert({
          id_persona: data.user.id,
          nombre: nombre,
          apellidos: apellidos || null,
          email: email,
          username: username,
          telefono: telefono,
          fecha_nacimiento: fechaNacimiento,
          contrasena: '***',
          fecha_registro: new Date().toISOString(),
          rol: 'usuario'
        });

      if (profileError) {
        console.warn('Error al crear perfil en persona:', profileError.message);
      }
    }

    return { user: data.user, error: null };
  } catch (err) {
    console.error('supabaseSignUp error:', err);
    return { user: null, error: 'Error inesperado al registrar. Inténtalo de nuevo.' };
  }
}

/**
 * Iniciar sesión con email y contraseña.
 */
async function supabaseSignIn(email, password) {
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      return { user: null, perfil: null, error: traducirError(error.message) };
    }

    let perfil = null;
    if (data.user) {
      const { data: perfilData } = await supabaseClient
        .from('persona')
        .select('*')
        .eq('id_persona', data.user.id)
        .single();

      perfil = perfilData;
    }

    return { user: data.user, perfil: perfil, error: null };
  } catch (err) {
    console.error('supabaseSignIn error:', err);
    return { user: null, perfil: null, error: 'Error inesperado al iniciar sesión.' };
  }
}

/**
 * Cerrar sesión.
 */
async function supabaseSignOut() {
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) console.warn('Error al cerrar sesión:', error.message);
  } catch (err) {
    console.error('supabaseSignOut error:', err);
  }
}

/**
 * Obtener el usuario actualmente autenticado.
 */
async function supabaseGetUser() {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) return { user: null, perfil: null };

    const { data: perfil } = await supabaseClient
      .from('persona')
      .select('*')
      .eq('id_persona', user.id)
      .single();

    return { user, perfil };
  } catch (err) {
    console.error('supabaseGetUser error:', err);
    return { user: null, perfil: null };
  }
}

// =====================================================================
// FAVORITOS — CRUD
// =====================================================================

async function supabaseGetFavoritos(userId) {
  try {
    const { data, error } = await supabaseClient
      .from('favorito')
      .select('id_evento')
      .eq('id_persona', userId);

    if (error) {
      console.warn('Error al obtener favoritos:', error.message);
      return [];
    }

    return data.map(f => f.id_evento);
  } catch (err) {
    console.error('supabaseGetFavoritos error:', err);
    return [];
  }
}

async function supabaseAddFavorito(userId, eventoId) {
  try {
    const { error } = await supabaseClient
      .from('favorito')
      .insert({
        id_persona: userId,
        id_evento: eventoId
      });

    if (error) {
      console.warn('Error al añadir favorito:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('supabaseAddFavorito error:', err);
    return false;
  }
}

async function supabaseRemoveFavorito(userId, eventoId) {
  try {
    const { error } = await supabaseClient
      .from('favorito')
      .delete()
      .eq('id_persona', userId)
      .eq('id_evento', eventoId);

    if (error) {
      console.warn('Error al eliminar favorito:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('supabaseRemoveFavorito error:', err);
    return false;
  }
}

// =====================================================================
// PUBLICACIONES (COMENTARIOS) — CRUD
// =====================================================================

async function supabaseGetComentarios(eventoId) {
  try {
    const { data, error } = await supabaseClient
      .from('publicacion')
      .select('*, persona(nombre, username, avatar_url)')
      .eq('id_evento', eventoId)
      .eq('tipo', 'comentario')
      .order('fecha', { ascending: true });
    if (error) {
      console.warn('Error al obtener comentarios:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('supabaseGetComentarios error:', err);
    return [];
  }
}

async function supabaseAddComentario(userId, eventoId, texto) {
  try {
    const { data, error } = await supabaseClient
      .from('publicacion')
      .insert({
        id_persona: userId,
        id_evento: eventoId,
        tipo: 'comentario',
        contenido: texto,
        fecha: new Date().toISOString()
      })
      .select('*, persona(nombre)')
      .single();

    if (error) {
      console.warn('Error al publicar comentario:', error.message);
      return { comment: null, error: 'Error al publicar comentario.' };
    }

    return { comment: data, error: null };
  } catch (err) {
    console.error('supabaseAddComentario error:', err);
    return { comment: null, error: 'Error inesperado.' };
  }
}

async function supabaseDeleteComentario(commentId) {
  try {
    const { error } = await supabaseClient
      .from('publicacion')
      .delete()
      .eq('id_publicacion', commentId);

    if (error) {
      console.warn('Error al eliminar comentario:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('supabaseDeleteComentario error:', err);
    return false;
  }
}

async function supabaseGetAllComentarios() {
  try {
    const { data, error } = await supabaseClient
      .from('publicacion')
      .select('*, persona(nombre, username, avatar_url)')
      .eq('tipo', 'comentario')
      .order('fecha', { ascending: false })
      .limit(50);

    if (error) {
      console.warn('Error al obtener todos los comentarios:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('supabaseGetAllComentarios error:', err);
    return [];
  }
}

// =====================================================================
// EVENTOS — CRUD
// =====================================================================

async function supabaseGetEventos() {
  try {
    const { data, error } = await supabaseClient
      .from('evento')
      .select('*, ubicacion(nombre, direccion, latitud, longitud)')
      .order('id', { ascending: true });

    if (error) {
      console.warn('Error al obtener eventos:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('supabaseGetEventos error:', err);
    return [];
  }
}

async function supabaseAddEvento(evento) {
  try {
    const { data, error } = await supabaseClient
      .from('evento')
      .insert({
        nombre: evento.nombre,
        categoria: evento.categoria,
        dia: evento.dia,
        hora: evento.hora,
        id_ubicacion: evento.id_ubicacion,
        descripcion: evento.descripcion
      })
      .select('*, ubicacion(nombre, direccion, latitud, longitud)')
      .single();

    if (error) {
      console.warn('Error al añadir evento:', error.message);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error('supabaseAddEvento error:', err);
    return { data: null, error: 'Error inesperado.' };
  }
}

async function supabaseUpdateEvento(id, datos) {
  try {
    const { data, error } = await supabaseClient
      .from('evento')
      .update({
        nombre: datos.nombre,
        categoria: datos.categoria,
        dia: datos.dia,
        hora: datos.hora,
        id_ubicacion: datos.id_ubicacion,
        descripcion: datos.descripcion
      })
      .eq('id', id)
      .select('*, ubicacion(nombre, direccion, latitud, longitud)')
      .single();

    if (error) {
      console.warn('Error al actualizar evento:', error.message);
      return { data: null, error: error.message };
    }
    return { data, error: null };
  } catch (err) {
    console.error('supabaseUpdateEvento error:', err);
    return { data: null, error: 'Error inesperado.' };
  }
}

async function supabaseDeleteEvento(id) {
  try {
    const { error } = await supabaseClient
      .from('evento')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Error al eliminar evento:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('supabaseDeleteEvento error:', err);
    return false;
  }
}

async function supabaseGetUbicaciones() {
  try {
    const { data, error } = await supabaseClient
      .from('ubicacion')
      .select('*');
    if (error) {
      console.warn('Error al obtener ubicaciones:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('supabaseGetUbicaciones error:', err);
    return [];
  }
}

async function supabaseGetTotalUsuarios() {
  try {
    const { count, error } = await supabaseClient
      .from('persona')
      .select('*', { count: 'exact', head: true });
    if (error) {
      console.warn('Error al contar usuarios:', error.message);
      return 0;
    }
    return count || 0;
  } catch (err) {
    console.error('supabaseGetTotalUsuarios error:', err);
    return 0;
  }
}

async function supabaseGetTotalAgrupaciones() {
  try {
    const { count, error } = await supabaseClient
      .from('agrupacion')
      .select('*', { count: 'exact', head: true });
    if (error) {
      console.warn('Error al contar agrupaciones:', error.message);
      return 0;
    }
    return count || 0;
  } catch (err) {
    console.error('supabaseGetTotalAgrupaciones error:', err);
    return 0;
  }
}

async function supabaseGetTotalEscenarios() {
  try {
    const { count, error } = await supabaseClient
      .from('ubicacion')
      .select('*', { count: 'exact', head: true });
    if (error) {
      console.warn('Error al contar escenarios:', error.message);
      return 0;
    }
    return count || 0;
  } catch (err) {
    console.error('supabaseGetTotalEscenarios error:', err);
    return 0;
  }
}

// =====================================================================
// HELPERS
// =====================================================================

function traducirError(msg) {
  const traducciones = {
    'Invalid login credentials': 'Correo o contraseña incorrectos.',
    'Email not confirmed': 'Debes confirmar tu correo electrónico.',
    'User already registered': 'Este correo ya está registrado.',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
    'Signup requires a valid password': 'Introduce una contraseña válida.',
    'To signup, please provide your email': 'Introduce un correo electrónico válido.',
    'Email rate limit exceeded': 'Demasiados intentos. Espera un momento e inténtalo de nuevo.',
    'Anonymous sign-ins are disabled': 'El registro anónimo está deshabilitado.',
  };

  for (const [eng, esp] of Object.entries(traducciones)) {
    if (msg.includes(eng)) return esp;
  }

  return msg;
}

// =====================================================================
// AGRUPACIONES — CRUD
// =====================================================================

async function supabaseGetAgrupaciones() {
  try {
    const { data, error } = await supabaseClient
      .from('agrupacion')
      .select('*')
      .order('nombre', { ascending: true });
    if (error) { console.warn('Error al obtener agrupaciones:', error.message); return []; }
    return data || [];
  } catch (err) {
    console.error('supabaseGetAgrupaciones error:', err);
    return [];
  }
}

// =====================================================================
// PARTICIPACIONES — CRUD
// =====================================================================

async function supabaseGetParticipaciones(eventoId) {
  try {
    const { data, error } = await supabaseClient
      .from('participacion')
      .select('*, agrupacion(nombre, categoria, descripcion)')
      .eq('id_evento', eventoId)
      .order('id_participacion', { ascending: true });
    if (error) { console.warn('Error al obtener participaciones:', error.message); return []; }
    return data || [];
  } catch (err) {
    console.error('supabaseGetParticipaciones error:', err);
    return [];
  }
}

async function supabaseAddParticipacion(idEvento, idAgrupacion, anio) {
  try {
    const { error } = await supabaseClient
      .from('participacion')
      .insert({ id_evento: idEvento, id_agrupacion: idAgrupacion, anio: anio });
    if (error) { console.warn('Error al añadir participación:', error.message); return false; }
    return true;
  } catch (err) {
    console.error('supabaseAddParticipacion error:', err);
    return false;
  }
}

async function supabaseDeleteParticipacion(idParticipacion) {
  try {
    const { error } = await supabaseClient
      .from('participacion')
      .delete()
      .eq('id_participacion', idParticipacion);
    if (error) { console.warn('Error al eliminar participación:', error.message); return false; }
    return true;
  } catch (err) {
    console.error('supabaseDeleteParticipacion error:', err);
    return false;
  }
}

console.log('Supabase conectado —', SUPABASE_URL);

/**
 * Iniciar sesión anónima en Supabase
 * Crea un usuario temporal sin email/contraseña
 */
async function supabaseSignInAnonymously() {
  try {
    const { data, error } = await supabaseClient.auth.signInAnonymously();
    if (error) {
      console.error('Error en login anónimo:', error.message);
      return { user: null, error: traducirError(error.message) };
    }
    return { user: data.user, error: null };
  } catch (err) {
    console.error('supabaseSignInAnonymously error:', err);
    return { user: null, error: 'Error al iniciar sesión anónima.' };
  }
}

// =====================================================================
// PERFIL DE USUARIO (ACTUALIZACIÓN Y AVATAR) - CORREGIDO
// =====================================================================

async function supabaseUpdatePerfil(userId, datos) {
  try {
    const { error } = await supabaseClient
      .from('persona')
      .update(datos)
      .eq('id_persona', userId);
    if (error) {
      console.error('Error al actualizar perfil:', error);
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err) {
    console.error('supabaseUpdatePerfil error:', err);
    return { success: false, error: err.message };
  }
}

async function supabaseCheckUsernameAvailable(username, currentUserId) {
  const { data } = await supabaseClient
    .from('persona')
    .select('id_persona')
    .eq('username', username)
    .neq('id_persona', currentUserId)  // excluir al propio usuario
    .single();
  return !data; // true = disponible
}

async function supabaseUploadAvatar(file, userId) {
  if (!file) return null;
  
  // Validaciones
  if (file.size > 2 * 1024 * 1024) {
    console.error('La imagen supera los 2MB');
    return null;
  }
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.type)) {
    console.error('Formato no permitido. Usa JPEG, PNG o WEBP.');
    return null;
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = fileName;

  try {
    // Subir archivo
    const { error: uploadError } = await supabaseClient.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Error storage:', uploadError);
      return null;
    }

    // Obtener URL pública
    const { data: publicUrlData } = supabaseClient.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('supabaseUploadAvatar excepción:', err);
    return null;
  }
}