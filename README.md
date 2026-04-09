# Plataforma Colegio Pio XII

Aplicación web desarrollada con **Vue 3 + Vite + TypeScript** para la gestión académica de Docentes, Cursos y Estudiantes del Colegio Pio XII. Proyecto final del curso de Vue 3.

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | Vue 3 + Vite + TypeScript |
| Enrutamiento | Vue Router 4 |
| HTTP | Axios |
| UI | Bootstrap 5 + Bootstrap Icons |
| Backend simulado | JSON Server 0.17.x |
| Autenticación | JSON Server Auth (JWT + bcrypt) |

---

## Requisitos previos

- Node.js 18 o superior
- npm

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd proyectoVue
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

El archivo `.env` ya está incluido en el proyecto con la configuración por defecto:

```env
VITE_API_URL=http://localhost:3001
```

> Si necesitas cambiar el puerto del backend, edita ese valor.

### 4. Ejecutar el proyecto

Abrir **dos terminales** en la raíz del proyecto:

**Terminal 1 — Backend (JSON Server Auth):**
```bash
npm run server
```
Levanta la API en `http://localhost:3001`

**Terminal 2 — Frontend (Vite):**
```bash
npm run dev
```
Levanta el frontend en `http://localhost:5173`

Abrir el navegador en **http://localhost:5173**

---

## Credenciales de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Admin | `admin@pioxii.com` | `admin2026` |
| Docente | `docente@pioxii.com` | `docente2026` |

También puedes registrar una cuenta nueva desde `/register`.

---

## Estructura del proyecto

```
proyectoVue/
├── db.json                     # Base de datos JSON (datos de prueba incluidos)
├── .env                        # Variables de entorno
├── .env.example                # Ejemplo de variables de entorno
├── public/
│   └── logo1.png               # Logo del Colegio Pio XII
└── src/
    ├── assets/
    │   └── main.css            # Estilos globales y paleta de colores
    ├── components/
    │   └── layout/
    │       └── AppNavbar.vue   # Navbar superior responsivo con menú mobile
    ├── composables/
    │   ├── useAuth.ts          # Singleton de autenticación (token, user)
    │   └── useNotification.ts  # Sistema de notificaciones toast
    ├── router/
    │   └── index.ts            # Rutas + navigation guard (protección de rutas)
    ├── services/
    │   ├── api.ts              # Axios con interceptores de token y errores
    │   ├── authService.ts      # Login y registro
    │   ├── docenteService.ts   # CRUD docentes
    │   ├── cursoService.ts     # CRUD cursos
    │   └── estudianteService.ts # CRUD estudiantes
    ├── types/
    │   └── index.ts            # Interfaces y tipos TypeScript
    └── views/
        ├── auth/
        │   ├── LoginView.vue       # Inicio de sesión
        │   └── RegisterView.vue    # Registro de usuario
        ├── docentes/
        │   ├── DocentesView.vue       # Listado + CRUD docentes
        │   └── DocenteDetailView.vue  # Detalle del docente (ruta dinámica)
        ├── cursos/
        │   ├── CursosView.vue         # Listado + CRUD cursos
        │   └── CursoDetailView.vue    # Detalle del curso + estudiantes
        ├── estudiantes/
        │   └── EstudiantesView.vue    # Listado + CRUD estudiantes
        └── DashboardView.vue          # Panel de control con estadísticas
```

---

## Funcionalidades implementadas

### Autenticación
- Registro de usuario (`/register`)
- Login con email y contraseña (`/login`)
- Token JWT guardado en `localStorage`
- Logout con limpieza de sesión
- Protección de rutas privadas mediante navigation guard
- Redirección automática si no está autenticado

### Docentes
- Listar todos los docentes con buscador y filtros (área, estado)
- Crear / editar / eliminar docente (modal con confirmación)
- Asignar cursos a cada docente mediante checkboxes
- Ver detalle del docente con sus cursos asignados (`/docentes/:id`)

### Cursos
- Listar cursos con filtros (año, paralelo, turno, estado)
- Crear / editar / eliminar curso (modal)
- Vista previa del nombre del curso al seleccionar año y paralelo
- Ver detalle del curso con estudiantes matriculados (`/cursos/:id`)

### Estudiantes
- Listar todos los estudiantes con buscador y filtros (curso, estado)
- Crear / editar / eliminar estudiante (modal con confirmación)
- Filtro de cursos ordenado (1ro A, 1ro B, 2do A, 3ro A…)

### Dashboard
- Estadísticas generales: total docentes, cursos, estudiantes, cursos activos
- Lista de cursos recientes
- Lista de docentes del sistema

---

## Rutas

| Ruta | Tipo | Descripción |
|---|---|---|
| `/login` | Pública | Inicio de sesión |
| `/register` | Pública | Registro de usuario |
| `/` | Privada | Dashboard con estadísticas |
| `/docentes` | Privada | Gestión de docentes (CRUD) |
| `/docentes/:id` | Privada | Detalle de docente — ruta dinámica |
| `/cursos` | Privada | Gestión de cursos (CRUD) |
| `/cursos/:id` | Privada | Detalle de curso + estudiantes — ruta dinámica |
| `/estudiantes` | Privada | Gestión de estudiantes (CRUD) |

---

## Relaciones entre entidades

```
Docente (N) ←→ Cursos (N)
  └── Un docente puede tener varios cursos asignados (campo cursoIds[])
  └── Un curso puede tener docentes de distintas áreas

Curso (1) → Estudiantes (N)
  └── Un estudiante pertenece a un curso (campo cursoId)
  └── Un curso puede tener múltiples estudiantes
```

---

## Variables de entorno

```env
# .env
VITE_API_URL=http://localhost:3001
```

---

## Scripts disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo (frontend)
npm run server   # Inicia JSON Server Auth (backend)
npm run build    # Compila el proyecto para producción
npm run preview  # Previsualiza el build de producción
```

---

## Notas importantes

- `db.json` está incluido en el repositorio con datos de prueba realistas
- `node_modules/` está excluido del repositorio (`.gitignore`)
- Las contraseñas en `db.json` están hasheadas con bcrypt automáticamente por `json-server-auth`
- Axios envía el token JWT automáticamente en cada petición via interceptores
- La aplicación es completamente responsiva (Bootstrap 5 + menú hamburger mobile)
