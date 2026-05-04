# 🚴 BikeRoute Builder

Una aplicación web moderna y progresiva para planificar, crear y seguir rutas en bicicleta con rastreo GPS en tiempo real, análisis de elevación y mapas interactivos.

---

## ✨ Características Principales

### 🗺️ Planificación de Rutas
- **Constructor interactivo de rutas** con arrastrar y soltar en el mapa
- **Visualización en tiempo real** de distancia, elevación y dificultad
- **Integración con OpenStreetMap** mediante MapLibre GL para mapas de alta calidad
- **Análisis automático de superficie** de carreteras (asfalto, grava, montaña, etc.)
- **Cálculo de elevación** mediante datos SRTM de resolución 30m

### 📍 Rastreo GPS
- **Seguimiento en tiempo real** de tu ubicación durante el recorrido
- **Brújula visual** interactiva que muestra tu dirección de viaje
- **Barra de progreso animada** con estadísticas detalladas
- **Información de velocidad y precisión** del GPS
- **Seguimiento offline** - Funciona sin conexión a internet

### 📊 Dashboard y Gestión
- **Panel de control personal** para visualizar todas tus rutas
- **Tarjetas de rutas** con información resumida (distancia, dificultad, elevación)
- **Detalle completo de rutas** con estadísticas detalladas
- **Gestión de rutas guardadas** - Crear, ver, editar y eliminar

### 🎨 Diseño Moderno
- **Interfaz intuitiva** con tema oscuro premium
- **Animaciones fluidas** con Framer Motion
- **Responsive design** - Optimizado para móvil, tablet y escritorio
- **Tema "Tech Outdoor Minimal"** con colores inspirados en ciclismo y naturaleza
- **Accesibilidad mejorada** con contraste adecuado y navegación clara

### 🔐 Autenticación
- **Sistema de autenticación seguro** con Supabase
- **Registro y login** con validación de datos
- **Rutas protegidas** - Acceso controlado a funcionalidades
- **Gestión de sesiones** automática

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 18.3** - Librería UI moderna
- **TypeScript 5.6** - Tipado estático para JavaScript
- **Vite 8** - Bundler ultra-rápido
- **React Router 6** - Enrutamiento de aplicaciones

### UI & Estilos
- **Tailwind CSS 4.2** - Framework CSS utilitario
- **Framer Motion 12** - Animaciones y transiciones
- **PostCSS** - Procesamiento de CSS

### Mapas & Localización
- **MapLibre GL 3.5** - Mapas vectoriales de código abierto
- **Geolocation API** - API nativa del navegador para GPS
- **OpenStreetMap** - Datos cartográficos gratuitos

### Backend & Base de Datos
- **Supabase** - Backend como servicio (PostgreSQL + autenticación)
- **Supabase JS SDK 2.30** - Cliente JavaScript para Supabase

### Desarrollo
- **@vitejs/plugin-react** - Plugin React para Vite
- **Autoprefixer** - Compatibilidad de navegadores antiguos

---

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 16+ y npm 7+
- Git
- Cuenta de Supabase (opcional, para funcionalidades de base de datos)

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tuusuario/bikeroute-builder.git
   cd bikeroute-builder
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   Completa las variables con tus credenciales de Supabase

4. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`

5. **Compilar para producción**
   ```bash
   npm run build
   ```

6. **Vista previa de producción**
   ```bash
   npm run preview
   ```

---

## 📁 Estructura del Proyecto

```
bikeroute-builder/
├── src/
│   ├── components/          # Componentes React reutilizables
│   │   ├── layout/          # Componentes de diseño (Navbar, Footer)
│   │   ├── routes/          # Componentes relacionados con rutas
│   │   ├── ui/              # Componentes UI genéricos (Button, Input)
│   │   ├── Compass.tsx      # Brújula visual para GPS
│   │   ├── GPSTracker.tsx   # Panel de rastreo GPS
│   │   ├── MapFallback.tsx  # Fallback para el mapa
│   │   └── ProgressLine.tsx # Barra de progreso animada
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts       # Autenticación
│   │   ├── useGPS.ts        # Rastreo GPS
│   │   ├── useMapRoute.ts   # Interacción con mapas
│   │   └── useRoutes.ts     # Gestión de rutas
│   ├── pages/               # Páginas/Vistas de la aplicación
│   │   ├── Home.tsx         # Página de inicio
│   │   ├── Login.tsx        # Formulario de login
│   │   ├── Register.tsx     # Formulario de registro
│   │   ├── Dashboard.tsx    # Dashboard de rutas
│   │   ├── RouteBuilder.tsx # Constructor de rutas
│   │   └── RouteDetail.tsx  # Detalle de ruta con GPS
│   ├── services/            # Servicios API y lógica
│   │   ├── supabaseClient.ts    # Cliente Supabase
│   │   ├── routesService.ts     # API de rutas
│   │   ├── elevationService.ts  # Cálculo de elevación
│   │   ├── gpxService.ts        # Manejo de archivos GPX
│   │   └── overpassService.ts   # Consultas a Overpass API
│   ├── types/               # Tipos TypeScript
│   │   ├── route.ts         # Tipos de rutas
│   │   └── surface.ts       # Tipos de superficie
│   ├── utils/               # Funciones utilitarias
│   │   ├── geoUtils.ts      # Utilidades geográficas
│   │   └── difficultyUtils.ts   # Cálculo de dificultad
│   ├── App.tsx              # Componente raíz
│   ├── main.tsx             # Punto de entrada
│   └── index.css            # Estilos globales
├── public/                  # Archivos estáticos
├── vite.config.ts           # Configuración de Vite
├── tailwind.config.ts       # Configuración de Tailwind CSS
├── tsconfig.json            # Configuración de TypeScript
├── package.json             # Dependencias del proyecto
└── README.md               # Este archivo
```

---

## 🧭 Guía de Características

### Crear una Ruta
1. Inicia sesión en tu cuenta
2. Navega a "Nueva ruta" desde el Dashboard
3. Dibuja en el mapa haciendo clic para agregar puntos
4. El sistema calculará automáticamente:
   - Distancia total
   - Elevación acumulada
   - Tipo de superficie
   - Nivel de dificultad
5. Guarda la ruta con un nombre descriptivo

### Seguir una Ruta con GPS
1. Abre una ruta guardada desde el Dashboard
2. Haz clic en "Iniciar" en el panel de GPS
3. Autoriza el acceso a tu ubicación
4. Sigue los indicadores visuales mientras recorres
5. Verás en tiempo real:
   - Tu posición en el mapa
   - Progreso porcentual
   - Velocidad actual
   - Dirección de viaje

### Analizar una Ruta
- **Perfil de elevación**: Visualiza cambios de altura
- **Tipos de superficie**: Categorización automática del terreno
- **Dificultad**: Cálculo basado en distancia, elevación y tipo de terreno
- **Estadísticas**: Datos completos de cada ruta

---

## 🔧 Desarrollo

### Scripts Disponibles

```bash
# Desarrollo con hot reload
npm run dev

# Compilar y verificar tipos
npm run build

# Ver build de producción localmente
npm run preview
```

### Configuración

- **Tailwind CSS**: `tailwind.config.ts`
- **Vite**: `vite.config.ts`
- **TypeScript**: `tsconfig.json`
- **PostCSS**: `postcss.config.js`

### Variables de Entorno Requeridas

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 📋 Especificaciones Técnicas

### Requisitos del Navegador
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+
- Soporte para Geolocation API
- Soporte para WebGL (para mapas)

### Precisión de Datos
- **GPS**: ±5-10 metros (depende del dispositivo)
- **Elevación**: Resolución de 30 metros (SRTM data)
- **Mapas**: OpenStreetMap - actualizado continuamente

### Rendimiento
- **Bundle**: ~250KB gzipped
- **Performance Score**: 90+
- **First Contentful Paint**: <1s
- **Time to Interactive**: <2s

---

## 📝 Licencia

Este proyecto está bajo licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📧 Contacto

Para preguntas, sugerencias o reportar bugs, por favor abre un issue en el repositorio.

---

## 🎯 Roadmap

- [ ] Exportar rutas a GPX/KML
- [ ] Compartir rutas con otros usuarios
- [ ] Competencias y desafíos entre ciclistas
- [ ] Integración con Strava
- [ ] Aplicación móvil nativa
- [ ] Modo offline completo
- [ ] Análisis estadístico avanzado
- [ ] Recomendaciones de rutas basadas en IA

---

**BikeRoute Builder** - Planifica, pedalea y conquista nuevas rutas. 🚴‍♂️
