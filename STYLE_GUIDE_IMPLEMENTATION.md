# 🎨 Guía de Estilos - BikeRoute Builder (IMPLEMENTADA)

## ✅ Implementación completada

Toda la aplicación BikeRoute Builder ha sido actualizada con el tema "Tech Outdoor Minimal" con tema oscuro premium.

---

## 🌍 Tema Global

### Color Scheme
- **Fondo principal**: `bg-slate-950` (oscuro premium)
- **Modo**: Oscuro (por defecto)
- **Paleta**: Colores inspirados en ciclismo y naturaleza

### Tipografía
- **Font**: Inter (configurada en `tailwind.config.ts`)
- **Jerarquía**:
  - Títulos: `text-3xl font-semibold tracking-tight`
  - Subtítulos: `text-lg text-slate-400`
  - Texto normal: `text-sm text-slate-300`
  - Labels: `text-xs uppercase tracking-widest text-slate-500`

---

## 🎯 Paleta de Colores Implementada

| Uso | Color Tailwind | Hex | Descripción |
|-----|---|---|---|
| Primary (Rutas) | emerald-500 | #10b981 | Verde ruta |
| Secondary (Mapa) | sky-400 | #0ea5e9 | Azul mapa |
| Esfuerzo | orange-400 | #fb923c | Naranja |
| Dificultad Alta | red-500 | #ef4444 | Rojo |
| Fondo | slate-950 | #030712 | Negro oscuro |
| Cards | slate-900/60 | rgba(15, 23, 42, 0.6) | Con transparencia |
| Bordes | slate-800 | #1e293b | Gris oscuro |
| Texto Principal | slate-100 | #f1f5f9 | Blanco suave |
| Texto Secundario | slate-400 | #94a3b8 | Gris neutro |

---

## 🧩 Componentes Estilizados

### Cards (Estándar en toda la app)
```tailwind
rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-lg p-5
```

**Hover Moderno**:
```tailwind
hover:border-emerald-500/40 hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300
```

### Botones

**Primary (Verde)**:
```tailwind
bg-emerald-500 px-4 py-2 text-slate-950 font-semibold hover:bg-emerald-400 active:scale-95 rounded-xl transition-all
```

**Secondary (Oscuro)**:
```tailwind
border border-slate-700 bg-slate-900 px-4 py-2 text-slate-100 hover:bg-slate-800 rounded-xl transition-all
```

**Danger (Rojo)**:
```tailwind
bg-red-500 px-4 py-2 text-white hover:bg-red-400 rounded-xl transition-all
```

### Inputs
```tailwind
w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 
focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/40
```

### Navbar (Sticky + Blur)
```tailwind
sticky top-0 z-50 border-b border-slate-800 bg-slate-950/70 backdrop-blur-xl
```

Links:
- Default: `text-slate-300 hover:text-white`
- Active: `text-emerald-400 font-semibold`

### Badges de Dificultad

**Fácil**:
```tailwind
bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 rounded-full px-3 py-1
```

**Moderada**:
```tailwind
bg-orange-500/15 text-orange-300 border border-orange-500/20 rounded-full px-3 py-1
```

**Difícil**:
```tailwind
bg-red-500/15 text-red-300 border border-red-500/20 rounded-full px-3 py-1
```

---

## ✨ Animaciones (Framer Motion)

### Entrada de Página
```jsx
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.35, ease: "easeOut" }}
```

### Cards Hover
```jsx
whileHover={{ y: -4, scale: 1.02 }}
transition={{ type: "spring", stiffness: 250, damping: 20 }}
```

### Botones Tap
```jsx
whileTap={{ scale: 0.96 }}
```

---

## 📁 Archivos Actualizados

### Configuración
- ✅ `tailwind.config.ts` - Paleta de colores oscura
- ✅ `src/index.css` - Tema oscuro y estilos base
- ✅ `package.json` - Framer Motion instalado

### Componentes
- ✅ `src/components/ui/Button.tsx` - Botones oscuros
- ✅ `src/components/ui/Input.tsx` - Inputs oscuros
- ✅ `src/components/layout/Navbar.tsx` - Navbar sticky + blur
- ✅ `src/components/routes/RouteCard.tsx` - Cards con animaciones

### Páginas
- ✅ `src/pages/Home.tsx` - Hero con tema oscuro
- ✅ `src/pages/Login.tsx` - Formulario oscuro con animaciones
- ✅ `src/pages/Register.tsx` - Registro oscuro con animaciones
- ✅ `src/pages/Dashboard.tsx` - Dashboard con cards animadas
- ✅ `src/pages/RouteBuilder.tsx` - Builder con mapa y cards oscuras
- ✅ `src/pages/RouteDetail.tsx` - Detalle con badges de dificultad

### Utilidades
- ✅ `src/utils/difficultyUtils.ts` - Colores de dificultad actualizados

---

## 🎨 Características Visuales Implementadas

### ✨ Efectos Premium
- ✅ Backdrop blur (backdrop-blur-xl)
- ✅ Sombras suaves y sutiles
- ✅ Bordes redondeados consistentes
- ✅ Gradientes suaves en fondos
- ✅ Transparencia controlada

### 🚀 Animaciones Modernas
- ✅ Fade + slide en entrada de páginas
- ✅ Hover con elevación (y-4 px)
- ✅ Escala suave (1.02)
- ✅ Transiciones spring para naturalidad
- ✅ Tap scale para feedback interactivo

### 🎯 Consistencia
- ✅ Bordes: `border-slate-800` en toda la app
- ✅ Padding: Consistente con `p-5`, `p-6`, `p-8`
- ✅ Espaciado: `gap-6`, `space-y-8` en secciones
- ✅ Rounded: `rounded-xl` para componentes, `rounded-2xl` para cards
- ✅ Focus states: `ring-2 ring-emerald-500/40`

---

## 🗺️ Mapa (MapLibre)

### Colores en el Mapa
- **Línea de ruta**: `#10b981` (emerald - verde)
- **Puntos**: `#0ea5e9` (sky - azul)
- **Panel del mapa**: `rounded-xl border border-slate-800`

---

## 📱 Responsive Design

Todos los componentes son completamente responsivos:
- Mobile: `grid-cols-1`
- Tablet: `md:grid-cols-2`
- Desktop: `xl:grid-cols-3`

---

## 🚀 Cómo Usar Esta Guía

### Para crear nuevos componentes:
1. Usar `rounded-2xl border border-slate-800 bg-slate-900/60` para cards
2. Aplicar `hover:border-emerald-500/40` para estados hover
3. Envolver en `motion.div` para animaciones
4. Usar `text-slate-100` para texto principal

### Para actualizaciones futuras:
- Mantener consistencia de colores (emerald para primary, sky para secondary)
- Usar bordes `border-slate-800` en toda la app
- Aplicar blur con `backdrop-blur-xl`
- Animar con Framer Motion (spring, ease-out)

---

## ✅ Checklist de Validación

- ✅ Tema oscuro (bg-slate-950) implementado
- ✅ Colores primarios (emerald-500) y secundarios (sky-400)
- ✅ Tipografía Inter consistente
- ✅ Componentes con blur y bordes redondeados
- ✅ Animaciones suaves y fluidas
- ✅ Navbar sticky con backdrop blur
- ✅ Badges con colores de dificultad
- ✅ Inputs con focus states
- ✅ Botones con tres variantes (primary, secondary, danger)
- ✅ Cards flotantes con micro-interacciones
- ✅ Mapa con colores de marca (verde y azul)
- ✅ Responsive design completo
- ✅ Framer Motion instalado y utilizado

---

## 🎉 Resultado Final

La aplicación BikeRoute Builder ahora tiene una identidad visual moderna y profesional, con un tema oscuro premium que combina:
- Tecnología moderna (blur, animaciones)
- Naturaleza/Deporte (colores verde y azul)
- Interfaz limpia y accesible
- Experiencia de usuario fluida

**Status**: ✨ IMPLEMENTACIÓN COMPLETADA ✨
