import { LatLng } from '../types/route';

/**
 * Servicio de enrutamiento para bicicleta usando Cyclosm
 * Fork de OSRM optimizado para ciclismo - evita autopistas y autovías
 */

const CYCLOSM_BASE_URL = 'https://routing.openstreetmap.de/routed-bike/route/v1/bike';

export type BikeProfileType = 'balanced' | 'gravel' | 'road' | 'mtb';

interface OSRMLeg {
  distance: number;
  duration: number;
  steps: Array<any>;
}

interface OSRMRoute {
  legs: OSRMLeg[];
  distance: number;
  duration: number;
  geometry: {
    type: string;
    coordinates: [number, number][];
  };
}

interface OSRMResponse {
  code: string;
  routes: OSRMRoute[];
  waypoints: Array<{
    hint: string;
    distance: number;
    name: string;
    location: [number, number];
  }>;
}

/**
 * Calcula la ruta para bicicleta evitando autopistas y autovías
 * Usa Cyclosm (OSRM optimizado para ciclismo)
 * @param points Array de puntos (inicio, paradas intermedias, destino)
 * @param profile Tipo de perfil: 'balanced' | 'gravel' | 'road' | 'mtb'
 * @returns Array de coordenadas que forman la ruta, o null si hay error
 */
export async function calculateRoute(
  points: LatLng[],
  profile: BikeProfileType = 'balanced'
): Promise<LatLng[] | null> {
  if (points.length < 2) {
    console.warn('Se necesitan al menos 2 puntos para calcular una ruta');
    return null;
  }

  try {
    // Construir coordenadas en formato OSRM: lng,lat;lng,lat;...
    const coordinates = points
      .map(p => `${p.lng},${p.lat}`)
      .join(';');

    // URL con Cyclosm (optimizado para ciclismo)
    const url = `${CYCLOSM_BASE_URL}/${coordinates}?overview=full&geometries=geojson&steps=false`;

    console.log('📍 Requesting Cyclosm route (bike-optimized):', url);

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Error OSRM HTTP ${response.status}`);
      return null;
    }

    const data: OSRMResponse = await response.json();

    if (data.code !== 'Ok') {
      console.error(`Error OSRM: ${data.code}`);
      return null;
    }

    if (!data.routes || data.routes.length === 0) {
      console.warn('No routes found');
      return null;
    }

    // Extraer las coordenadas de la primera ruta
    const route = data.routes[0];
    const routePoints: LatLng[] = route.geometry.coordinates.map(([lng, lat]) => ({
      lat,
      lng,
    }));

    const distanceKm = (route.distance / 1000).toFixed(2);
    const durationMin = Math.round(route.duration / 60);

    console.log(
      `✅ Ruta calculada: ${routePoints.length} puntos, ${distanceKm} km, ${durationMin} min`
    );

    return routePoints;
  } catch (error) {
    console.error('❌ Error calculando ruta:', error);
    return null;
  }
}

/**
 * Calcula la distancia total de una ruta (en km)
 * @param points Array de puntos que forman la ruta
 * @returns Distancia en kilómetros
 */
export function calculateTotalDistance(points: LatLng[]): number {
  if (points.length < 2) return 0;

  let totalDistance = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const lat1 = (points[i].lat * Math.PI) / 180;
    const lat2 = (points[i + 1].lat * Math.PI) / 180;
    const lng1 = (points[i].lng * Math.PI) / 180;
    const lng2 = (points[i + 1].lng * Math.PI) / 180;

    const dLat = lat2 - lat1;
    const dLng = lng2 - lng1;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const R = 6371; // Radio de la Tierra en km

    totalDistance += R * c;
  }

  return totalDistance;
}
