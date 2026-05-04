# Funcionalidad GPS en Rutas

## Descripción

Se ha implementado una funcionalidad completa de GPS que permite seguir tu ubicación en tiempo real mientras recorres una ruta guardada. El sistema muestra:

- **Ubicación actual** (Latitud y Longitud)
- **Precisión del GPS** (margen de error)
- **Velocidad de desplazamiento** (en km/h)
- **Dirección de viaje** (brújula visual)
- **Progreso en la ruta** (distancia recorrida, distancia faltante, porcentaje completado)
- **Marcador en el mapa** (punto azul-cyan que se actualiza en tiempo real)

## Cómo usar

### Acceder a la función GPS

1. Ve a la página de detalle de una ruta guardada
2. Verás un nuevo panel llamado "Seguimiento GPS" en el lado derecho del mapa
3. El mapa mostrará la ruta en verde

### Activar el GPS

1. Haz clic en el botón **"Iniciar"** del panel GPS
2. Tu navegador te pedirá permisos para acceder a tu ubicación
3. **Acepta los permisos** para comenzar el seguimiento

### Durante el recorrido

Una vez activado el GPS:
- Tu ubicación se mostrará como un **marcador azul-cyan** en el mapa
- Se actualizará automáticamente cada pocos segundos
- Verás un **progreso visual** con:
  - Barra de progreso animada
  - Kilómetros recorridos
  - Porcentaje completado
  - Kilómetros faltantes

### Información en tiempo real

El panel muestra:
- **Coordenadas exactas** de tu posición
- **Precisión** del GPS en metros
- **Velocidad actual** en km/h
- **Brújula visual** que indica tu dirección de viaje
- **Progreso completo** de la ruta

### Detener el GPS

1. Haz clic en el botón **"Detener"** para finalizar el seguimiento
2. El marcador desaparecerá del mapa
3. Puedes reiniciar en cualquier momento

## Características técnicas

### Archivo: `useGPS.ts`
Hook personalizado que maneja:
- Seguimiento de ubicación con `navigator.geolocation.watchPosition()`
- Cálculo automático del progreso en la ruta
- Detección del punto más cercano en la ruta
- Manejo de errores de GPS

### Archivo: `GPSTracker.tsx`
Componente que muestra:
- Panel de control (Iniciar/Detener)
- Información de ubicación y precisión
- Brújula visual interactiva
- Barra de progreso animada

### Archivo: `Compass.tsx`
Componente visual que muestra:
- Brújula 3D con aguja animada
- Puntos cardinales (N, NE, E, etc.)
- Ángulo en grados

### Archivo: `RouteDetail.tsx`
Página actualizada que incluye:
- Integración del hook useGPS
- Marcador GPS en el mapa
- Panel del componente GPSTracker

## Requisitos

- Navegador moderno con soporte para Geolocation API
- Permisos de ubicación activados en el dispositivo
- Conexión GPS activa (especialmente en dispositivos móviles)

## Notas importantes

1. **Precisión**: La precisión del GPS depende de:
   - Dispositivo usado (móvil, tablet, laptop con GPS)
   - Condiciones externas (interior vs exterior)
   - Señal satelital disponible

2. **Batería**: El seguimiento GPS consume batería. Considera esto en viajes largos.

3. **Privacidad**: Tu ubicación se procesa localmente en el navegador. No se almacena en el servidor.

4. **Offline**: El GPS funciona sin necesidad de conexión a internet (aunque el mapa sí la necesita).

## Cálculo de progreso

El sistema calcula tu progreso mediante:

1. **Punto más cercano**: Encuentra el punto más próximo en la ruta
2. **Distancia recorrida**: Suma las distancias de todos los puntos hasta el más cercano
3. **Distancia total**: Suma de toda la ruta
4. **Porcentaje**: (Distancia recorrida / Distancia total) × 100

## Mejoras futuras posibles

- Guardado de estadísticas del recorrido (tiempo, velocidad promedio, etc.)
- Alertas cuando te desacerques de la ruta
- Registro GPX del recorrido completado
- Estimación del tiempo de llegada
- Comparativa con otros usuarios
