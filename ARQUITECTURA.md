# Maqaronesia - Documentación Técnica y de Operaciones

Este documento detalla la estructura del proyecto, la función de cada archivo y el historial de operaciones realizadas para construir la base de esta aplicación Django.

## 1. Estructura del Proyecto

El proyecto sigue una estructura modular y moderna de Django.

### Directorios Principales

*   **`config/`**: Es el "corazón" de configuración del proyecto (lo que normalmente se llamaría igual que la carpeta raíz, pero aquí lo hemos llamado `config` para ser más limpio).
    *   `settings.py`: Archivo de configuración global. Aquí hemos configurado:
        *   Apps instaladas (`INSTALLED_APPS`).
        *   Base de datos (`DATABASES` con `dj_database_url`).
        *   Autenticación (`django-allauth` y modelo de Usuario personalizado).
        *   Archivos estáticos (`WhiteNoise`).
    *   `urls.py`: El "índice" de rutas web. Redirige el tráfico a las distintas apps (`apps.blog`, `apps.courses`, `allauth`).
    *   `wsgi.py`: Punto de entrada para servidores web (como Vercel).

*   **`apps/`**: Contiene las aplicaciones funcionales del negocio. Dividimos el código por dominios lógicos.
    *   **`blog/`**:
        *   `models.py`: Define `Post`, `Category`, `Tag`.
        *   `views.py` y `urls.py`: Lógica para listar y ver artículos.
    *   **`courses/`**:
        *   `models.py`: Define `Course`, `Module`, `Lesson` y el seguimiento (`UserCourseAccess`).
        *   `views.py`: Lógica para listar cursos, inscribirse y ver lecciones (con protección de acceso).
    *   **`users/`**:
        *   `models.py`: Define un modelo `User` personalizado (hereda de `AbstractUser`). Esto es vital para poder añadir campos al usuario en el futuro sin romper la base de datos.
    *   Cada app tiene una carpeta `migrations/` con el historial de cambios en la base de datos.

*   **`templates/`**: Los archivos HTML (Frontend).
    *   `base.html`: La plantilla maestra. Contiene la cabecera (Nav), el pie de página y la carga de estilos (TailwindCSS). Todas las demás páginas "heredan" de esta.
    *   `blog/`: Plantillas para el blog (`post_list.html`, `post_detail.html`).
    *   `courses/`: Plantillas para los cursos.

*   **`.secrets/`**:
    *   Carpeta ignorada por git (gracias al `.gitignore`) donde guardarás archivos sensibles como el JSON de Google.

### Archivos Raíz

*   **`manage.py`**: El ejecutor de comandos de Django. Se usa para todo (`runserver`, `makemigrations`, `createsuperuser`).
*   **`requirements.txt`**: Lista de librerías de Python necesarias (`django`, `django-allauth`, `psycopg2`, etc.).
*   **`vercel.json`**: Configuración para que la nube (Vercel) sepa cómo arrancar Python.
*   **`.gitignore`**: Lista negra de archivos que NUNCA deben subir a GitHub (contraseñas, carpetas virtuales, base de datos local).
*   **`db.sqlite3`**: Tu base de datos local. Es un archivo que contiene todas las tablas y usuarios.

---

## 2. Historial de Operaciones (Paso a Paso)

Aquí resumo las acciones técnicas que ejecutamos para llegar a este punto:

### Fase 1: Inicialización
1.  **Entorno Virtual**: Creamos `.venv` para aislar las librerías de Python.
    *   `python3 -m venv .venv`
    *   `source .venv/bin/activate`
2.  **Instalación**: Instalamos Django y las herramientas necesarias.
    *   `pip install -r requirements.txt`
3.  **Estructura**: Iniciamos el proyecto y las apps.
    *   `django-admin startproject config .`
    *   `python manage.py startapp ...` (para blog, courses, users).
    *   Movimos las apps a la carpeta `apps/` para mantener el orden.

### Fase 2: Configuración del Núcleo
4.  **Settings (`settings.py`)**:
    *   Configuramos `INSTALLED_APPS` añadiendo nuestras apps y las de terceros (`allauth`, `whitenoise`).
    *   Configuramos la Base de Datos para que use `sqlite` en local pero esté lista para `postgres` en la nube.
    *   Definimos `AUTH_USER_MODEL = 'users.User'` para usar nuestro usuario propio.
5.  **Modelado de Datos**:
    *   Escribimos las clases en `models.py` de cada app.
    *   **Migraciones**: Ejecutamos `makemigrations` (crear intrucciones SQL) y `migrate` (aplicarlas a la DB).
        *   *Incidente*: Tuvimos un conflicto con `django_site` que nos obligó a reiniciar la DB (`rm db.sqlite3` y `migrate` de nuevo). Esto solucionó las dependencias rotas.

### Fase 3: Funcionalidad Web
6.  **Vistas y URLs**: Conectamos las URLs (`urls.py`) a las Vistas (`views.py`) y estas a los Templates (`html`).
7.  **Templates**: Creamos la estructura visual con TailwindCSS.
    *   Implementamos lógica `{% if user.is_authenticated %}` para mostrar Login o Logout.
    *   Implementamos lógica de acceso a cursos (si no estás inscrito, botón de "Enroll").

### Fase 4: Seguridad y Auth
8.  **Google SSO**:
    *   Integramos `django-allauth`.
    *   Añadimos `django.contrib.sites` (necesario para que Auth sepa en qué dominio está).
    *   Configuramos en el Admin (`/admin`) la *Social Application* con las credenciales de Google Cloud.

---

## 3. Comandos Útiles

Guarda estos comandos "de cabecera":

*   **Arrancar servidor**: `python manage.py runserver`
*   **Aplicar cambios de modelos**:
    1.  `python manage.py makemigrations` (Detectar cambios)
    2.  `python manage.py migrate` (Aplicar cambios)
*   **Crear administrador**: `python manage.py createsuperuser`
*   **Consola de Python (con Django cargado)**: `python manage.py shell`

¡Este es tu sistema operativo Maqaronesia V1!
