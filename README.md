# 🚴 BikeRoute Builder

Una aplicación web moderna para ciclistas que permite crear, planificar y analizar rutas de bicicleta de forma interactiva. Incluye análisis de terreno, cálculo de dificultad y exportación en formato GPX.

![React](https://img.shields.io/badge/React-18.3-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8.0-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-06B6D4?logo=tailwindcss)

## ✨ Características

- 🗺️ **Mapas Interactivos** - Dibuja rutas directamente en el mapa con MapLibre GL
- 🔐 **Autenticación Segura** - Registro e inicio de sesión con Supabase
- 📊 **Análisis de Terreno** - Detecta tipos de superficie (asfalto, grava, tierra) usando Overpass API
- 📈 **Cálculo de Dificultad** - Analiza distancia, desnivel y tipo de terreno
- 💾 **Sincronización en la Nube** - Guarda tus rutas en Supabase
- 📥 **Importar/Exportar GPX** - Compatibilidad con estándares de GPS
- 📱 **Interfaz Responsiva** - Funciona en desktop y tablets

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - Interfaz de usuario
- **TypeScript** - Tipado estático
- **Vite** - Build tool rápido
- **Tailwind CSS v4** - Estilos
- **Framer Motion** - Animaciones
- **React Router** - Navegación

### Backend & Base de Datos
- **Supabase** - Autenticación y base de datos PostgreSQL
- **PostGIS** - Análisis geoespacial
- **Overpass API** - Datos de OpenStreetMap
- **SRTM (Elevation API)** - Datos de elevación

### Mapas
- **MapLibre GL JS** - Renderizado de mapas
- **MapTiler** - Tiles de mapas

## 📋 Requisitos Previos

- **Node.js** 16.x o superior
- **npm** o **yarn**
- Cuenta en **Supabase** (gratuita)
- Clave API de **MapTiler** (gratuita)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Chumachingan/BikeRoute-Builder.git
cd BikeRoute-Builder
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_url_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
VITE_MAPTILER_KEY=tu_clave_maptiler
VITE_ELEVATION_API_URL=https://api.opentopodata.org/v1/srtm30m
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Compilar TypeScript y Vite
npm run build

# Vista previa de producción
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── layout/
│   │   └── Navbar.tsx           # Barra de navegación
│   ├── ui/
│   │   ├── Button.tsx           # Componente botón
│   │   └── Input.tsx            # Componente input
│   └── routes/
│       └── RouteCard.tsx        # Tarjeta de ruta
├── pages/
│   ├── Home.tsx                 # Página principal
│   ├── Login.tsx                # Inicio de sesión
│   ├── Register.tsx             # Registro de usuario
│   ├── Dashboard.tsx            # Panel de control
│   ├── RouteBuilder.tsx         # Constructor de rutas
│   └── RouteDetail.tsx          # Detalle de ruta
├── services/
│   ├── supabaseClient.ts        # Cliente Supabase
│   ├── routesService.ts         # Servicios de rutas
│   ├── overpassService.ts       # Integración Overpass API
│   ├── elevationService.ts      # Datos de elevación
│   └── gpxService.ts            # Manejo de archivos GPX
├── hooks/
│   ├── useAuth.ts               # Hook de autenticación
│   ├── useRoutes.ts             # Hook de rutas
│   └── useMapRoute.ts           # Hook para mapas
├── types/
│   ├── route.ts                 # Tipos de ruta
│   └── surface.ts               # Tipos de superficie
├── utils/
│   ├── geoUtils.ts              # Utilidades geoespaciales
│   └── difficultyUtils.ts       # Cálculo de dificultad
├── App.tsx                      # Componente principal
├── main.tsx                     # Punto de entrada
└── index.css                    # Estilos globales
```

## 🔧 Configuración de Supabase

### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta y un nuevo proyecto
3. Obtén tu URL y clave anónima

### 2. Crear tablas

Ejecuta el script `supabase-init.sql` en tu base de datos:

```sql
-- El script está incluido en el repositorio
```

## 🗺️ MapTiler y Mapas

1. Registrate en [maptiler.com](https://www.maptiler.com)
2. Obtén tu clave API gratuita
3. Agrega a tu archivo `.env.local`

## 📖 Cómo Usar

### Crear una Ruta

1. Inicia sesión en tu cuenta
2. Ve a "Crear Ruta"
3. Haz clic en el mapa para agregar puntos
4. Ajusta los puntos arrastrándolos
5. Guarda la ruta

### Analizar una Ruta

- El sistema analiza automáticamente:
  - **Distancia total** en km
  - **Desnivel** en metros
  - **Tipos de terreno** (asfalto, grava, tierra)
  - **Nivel de dificultad** (fácil, moderado, difícil)

### Exportar e Importar

- **Exportar**: Descarga tus rutas en formato GPX
- **Importar**: Carga archivos GPX existentes

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT - ver el archivo LICENSE para más detalles.

## 👤 Autor

**Chumachingan**

- GitHub: [@Chumachingan](https://github.com/Chumachingan)

## 💬 Soporte

Si tienes preguntas o encuentras problemas, por favor abre un [issue](https://github.com/Chumachingan/BikeRoute-Builder/issues).

---

**Hecho con ❤️ para los amantes del ciclismo**
    useAuth.ts
    useRoutes.ts
    useMapRoute.ts
  types/
    route.ts
    surface.ts
  utils/
    geoUtils.ts
    difficultyUtils.ts
  App.tsx
  main.tsx
🔑 AUTENTICACIÓN

Implementa autenticación con Supabase:

Registro: nombre, apellido, email, contraseña
Login: email, contraseña
Logout
Protección de rutas privadas usando React Router

Cuando el usuario esté logueado, debe poder acceder a:

Dashboard
Route Builder
Route Detail

Si no está logueado, redirigir a Login.

🗺️ MAPA Y CREACIÓN DE RUTAS

En la página RouteBuilder.tsx:

Mostrar un mapa con MapLibre.
Permitir al usuario hacer clic en el mapa y añadir puntos.
Dibujar una línea (polyline) con los puntos.
Mostrar distancia total aproximada en km.
Permitir borrar el último punto y reiniciar la ruta.
Guardar la ruta en Supabase con:
user_id
name
coordinates (array de lat/lng en JSON)
created_at
🧾 BASE DE DATOS SUPABASE (SQL)

Genera el SQL necesario para crear las tablas:

Tabla routes:

id UUID PRIMARY KEY
user_id UUID REFERENCES auth.users
name TEXT
coordinates JSONB
distance_km NUMERIC
elevation_gain_m NUMERIC
difficulty TEXT
surface_stats JSONB
created_at TIMESTAMP

Activar Row Level Security para que cada usuario solo vea sus rutas.

🌍 ANÁLISIS DE SUPERFICIE (OVERPASS API)

Crear overpassService.ts que:

Reciba una lista de coordenadas de la ruta.
Consulte Overpass API para obtener información de caminos.
Analice tags como:
surface
highway
tracktype
Clasifique tramos en:
asphalt
gravel
dirt
unknown

Guardar el análisis en la ruta dentro de Supabase.

El mapa debe mostrar la ruta con colores diferentes según superficie.

⛰️ ALTITUD Y DESNIVEL

Crear elevationService.ts:

Enviar coordenadas a una API tipo OpenTopoData.
Recibir altitudes.
Calcular desnivel acumulado positivo.
Guardar elevation_gain_m en Supabase.
📊 CÁLCULO DE DIFICULTAD

Crear difficultyUtils.ts que calcule:

Fácil / Moderada / Difícil

Basado en:

distancia
desnivel
porcentaje de superficie gravel/tierra

Ejemplo de lógica:

más de 50km y más de 800m -> difícil
gravel/tierra sube dificultad
📌 DASHBOARD

En Dashboard.tsx:

Listar rutas del usuario.
Mostrar:
nombre
distancia
desnivel
dificultad
Botón para ver detalle
Botón para borrar ruta
🧭 DETALLE DE RUTA

En RouteDetail.tsx:

Mostrar el mapa con la ruta cargada.
Mostrar estadísticas:
distancia
desnivel
dificultad
superficie (%)
Botón para exportar GPX
📁 EXPORTAR E IMPORTAR GPX

Crear gpxService.ts:

Convertir coordenadas a GPX descargable.
Importar un archivo GPX y convertirlo a coordenadas para cargarlo en el mapa.
🎨 DISEÑO (TAILWIND)

El diseño debe ser moderno, limpio y tipo app profesional.

Navbar con links
Layout responsive
Cards para rutas
Botones claros
Fondo claro, estilo minimalista
⚡ OPTIMIZACIÓN Y CACHEO

Evitar repetir llamadas a Overpass y elevación:

Guardar surface_stats y elevation_gain en Supabase.
Si ya existe, no volver a llamar a la API.

## Instalación

1. Copia las variables de entorno en un archivo `.env`.
2. Ejecuta `npm install`.
3. Ejecuta `npm run dev`.

## Variables de entorno necesarias

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_OPENTOPODATA_URL` (opcional)

🔥 REQUISITO FINAL

Genera código completo, funcional y limpio, con comentarios donde sea necesario.

Usa React Router DOM.

📌 Ahora crea los archivos base, implementa el código principal y deja el proyecto listo para correr con:

npm install
npm run dev