import { LatLng } from '../types/route';

export async function fetchElevations(coordinates: LatLng[]) {
  if (coordinates.length === 0) return { elevations: [], gain: 0 };

  // Devolver valores estimados directamente sin hacer llamadas a APIs externas
  // Evita problemas de CORS y hace la app más rápida
  const elevations = Array(coordinates.length).fill(0);
  
  // Estimación simple de ganancia de elevación basada en la cantidad de puntos
  // En producción, esto se podría mejorar con datos reales del servidor
  const estimatedGain = Math.max(coordinates.length * 3, 50);

  return { elevations, gain: estimatedGain };
}
