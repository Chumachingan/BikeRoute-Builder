Estoy creando una aplicación web llamada BikeRoute Builder usando:

React + Vite
TypeScript
Tailwind CSS v4
MapLibre GL JS
MapTiler (Free Tier)
Supabase (Auth + PostgreSQL + Storage)
PostGIS
Overpass API (OpenStreetMap)
API de elevación tipo OpenTopoData (SRTM)

Quiero que generes la estructura completa del proyecto, código inicial y funcionalidades base.

✅ OBJETIVO GENERAL

Una aplicación para ciclistas donde el usuario pueda:

Registrarse / iniciar sesión
Crear rutas dibujando puntos en el mapa
Guardar rutas en Supabase
Ver y editar sus rutas
Analizar superficie del terreno por tramos usando Overpass API
Calcular dificultad según distancia, desnivel y superficie
Exportar e importar rutas GPX
Mostrar rutas en el mapa con colores según tipo de terreno
📂 ESTRUCTURA DE CARPETAS OBLIGATORIA

Genera una estructura clara como esta:

src/
  components/
    ui/
    layout/
    map/
    routes/
  pages/
    Home.tsx
    Dashboard.tsx
    RouteBuilder.tsx
    RouteDetail.tsx
    Login.tsx
    Register.tsx
  services/
    supabaseClient.ts
    routesService.ts
    overpassService.ts
    elevationService.ts
    gpxService.ts
  hooks/
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