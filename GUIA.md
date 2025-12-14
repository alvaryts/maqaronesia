# Maqaronesia - Guía de Desarrollo

¡Tu sitio web personal en Django está listo! Incluye un Blog, una plataforma de Cursos y autenticación de usuarios vía Google.

## Resumen de Funcionalidades
*   **Blog**: Crea artículos desde el Admin, visualízalos en la portada/sección de blog. Soporta Categorías y Etiquetas (Tags).
*   **Cursos**: Crea cursos con Módulos y Lecciones. Los usuarios pueden inscribirse (simulado o gratis) para acceder al contenido de las lecciones.
*   **Autenticación**: Inicio de sesión único (SSO) con Google usando `django-allauth`.

## Desarrollo Local

1.  **Iniciar el servidor**:
    ```bash
    source .venv/bin/activate
    python manage.py runserver
    ```
2.  **Acceso**: Abre `http://127.0.0.1:8000`.

## Configuración y Uso

### 1. Crear un Superusuario
Para entrar al panel de Administración y crear contenido:
```bash
python manage.py createsuperuser
```
Ve a `http://127.0.0.1:8000/admin`.

### 2. Configurar Google OAuth (SSO)
Para que el botón "Log in with Google" funcione:
1.  Ve a [Google Cloud Console](https://console.cloud.google.com/).
2.  Crea un Proyecto y configura la **Pantalla de consentimiento de OAuth**.
3.  Crea **Credenciales** (ID de cliente de OAuth) para Aplicación Web.
    *   **URIs de redirección autorizados**: `http://127.0.0.1:8000/accounts/google/login/callback/` (y tu URL de producción después).
4.  En Django Admin > **Cuentas sociales** > **Aplicaciones sociales**:
    *   Añade una nueva aplicación.
    *   Proveedor: **Google**.
    *   Nombre: `Google`.
    *   Client ID & Secret: (Los que obtuviste en Google Cloud).
    *   Sitios: Mueve `example.com` (ID 1) a "Sitios elegidos".

### 3. Creación de Contenido
*   **Blog**: Añade `Categories`, `Tags`, y luego `Posts`. Marca los posts como `Published` (Publicado).
*   **Cursos**: Añade `Course`, luego `Module` (Módulo), y dentro `Lesson` (Lección).
    *   Las lecciones pueden tener una `Video URL` (ej. embed de YouTube).

## Guía de Despliegue (Vercel + Neon)

### 1. Base de Datos (Neon)
1.  Crea una base de datos Postgres en Neon.tech (Gratis).
2.  Obtén la cadena de conexión (Connection String).

### 2. Vercel
1.  Instala Vercel CLI o conecta tu repositorio de GitHub en el dashboard de Vercel.
2.  Variables de Entorno necesarias en Vercel:
    *   `DATABASE_URL`: (Tu cadena de conexión de Neon)
    *   `SECRET_KEY`: (Genera una cadena aleatoria segura)
    *   `ALLOWED_HOSTS`: `.vercel.app,maqaronesia.com`
    *   `DEBUG`: `False`

### 3. Configuración de Vercel (`vercel.json`)
El archivo `vercel.json` ya está creado en la raíz para manejar Python serverless y estáticos.

## Siguientes Pasos
*   Personalizar estilos en `templates/base.html` (actualmente usa Tailwind CDN).
*   Añadir pasarela de pago real (Stripe) en la vista `EnrollCourseView`.
