Adaptado a la arquitectura moderna con Supabase.

Arquitectura de la Aplicación
La aplicación utiliza una arquitectura Serverless. El frontend se comunica directamente con Supabase para la gestión de datos y autenticación, eliminando la necesidad de un backend tradicional en PHP o Node.js.

Tecnologías Usadas

Frontend: React / Vue.js (JavaScript/TypeScript) con Vite.

Backend & DB: Supabase (PostgreSQL, Auth, Storage).

Mapas: API de Google Maps.

Documentación Técnica y Análisis

Análisis de Datos: El modelo de datos se ha implementado en PostgreSQL dentro de Supabase.

Tablas: usuarios, eventos, ubicaciones, agrupaciones, participantes, publicaciones (fotos/comentarios) y favoritos.

Seguridad (RLS): Se han configurado Row Level Security (RLS) en Supabase para que solo los usuarios autenticados puedan subir fotos o marcar favoritos, y solo los administradores puedan editar eventos.