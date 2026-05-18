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
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =====================================================================
// AUTENTICACIÓN
// =====================================================================

/**
 * Registrar un nuevo usuario con email y contraseña.
 * También inserta su perfil en la tabla 'persona'.
 * @param {string} nombre
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: object|null, error: string|null}>}
 */
async function supabaseSignUp(nombre, email, password) {
  try {
    // 1. Crear cuenta en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { nombre: nombre }
      }
    });

    if (error) {
      return { user: null, error: traducirError(error.message) };
    }

    // 2. Insertar perfil en la tabla 'persona'
    if (data.user) {
      const { error: profileError } = await supabase
        .from('persona')
        .insert({
          id_persona: data.user.id,
          nombre: nombre,
          email: email,
          contrasena: '***', // No guardamos la contraseña real, Supabase Auth la gestiona
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
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: object|null, perfil: object|null, error: string|null}>}
 */
async function supabaseSignIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      return { user: null, perfil: null, error: traducirError(error.message) };
    }

    // Obtener perfil de la tabla 'persona'
    let perfil = null;
    if (data.user) {
      const { data: perfilData } = await supabase
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
 * Iniciar sesión con Google OAuth.
 */
async function supabaseSignInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/app.html'
      }
    });

    if (error) {
      return { error: traducirError(error.message) };
    }
    return { data, error: null };
  } catch (err) {
    console.error('supabaseSignInWithGoogle error:', err);
    return { error: 'Error al conectar con Google.' };
  }
}

/**
 * Cerrar sesión.
 */
async function supabaseSignOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) console.warn('Error al cerrar sesión:', error.message);
  } catch (err) {
    console.error('supabaseSignOut error:', err);
  }
}

/**
 * Obtener el usuario actualmente autenticado.
 * @returns {Promise<{user: object|null, perfil: object|null}>}
 */
async function supabaseGetUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { user: null, perfil: null };

    // Obtener perfil
    const { data: perfil } = await supabase
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

/**
 * Obtener los IDs de eventos favoritos del usuario actual.
 * @param {string} userId
 * @returns {Promise<number[]>}
 */
async function supabaseGetFavoritos(userId) {
  try {
    const { data, error } = await supabase
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

/**
 * Añadir un evento a favoritos.
 * @param {string} userId
 * @param {number} eventoId
 * @returns {Promise<boolean>}
 */
async function supabaseAddFavorito(userId, eventoId) {
  try {
    const { error } = await supabase
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

/**
 * Eliminar un evento de favoritos.
 * @param {string} userId
 * @param {number} eventoId
 * @returns {Promise<boolean>}
 */
async function supabaseRemoveFavorito(userId, eventoId) {
  try {
    const { error } = await supabase
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

/**
 * Obtener publicaciones/comentarios de un evento.
 * @param {number} eventoId
 * @returns {Promise<object[]>}
 */
async function supabaseGetComentarios(eventoId) {
  try {
    const { data, error } = await supabase
      .from('publicacion')
      .select('*, persona(nombre)')
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

/**
 * Publicar un nuevo comentario en un evento.
 * @param {string} userId
 * @param {number} eventoId
 * @param {string} texto
 * @returns {Promise<{comment: object|null, error: string|null}>}
 */
async function supabaseAddComentario(userId, eventoId, texto) {
  try {
    const { data, error } = await supabase
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

/**
 * Eliminar un comentario (solo admin).
 * @param {number} commentId
 * @returns {Promise<boolean>}
 */
async function supabaseDeleteComentario(commentId) {
  try {
    const { error } = await supabase
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

/**
 * Obtener todos los comentarios (para moderación admin).
 * @returns {Promise<object[]>}
 */
async function supabaseGetAllComentarios() {
  try {
    const { data, error } = await supabase
      .from('publicacion')
      .select('*, persona(nombre)')
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
// HELPERS
// =====================================================================

/**
 * Traducir mensajes de error de Supabase al español.
 */
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

  return msg; // Devolver el mensaje original si no hay traducción
}

console.log('✅ Supabase conectado —', SUPABASE_URL);
