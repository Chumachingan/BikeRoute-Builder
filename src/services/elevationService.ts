import { LatLng } from '../types/route';

// Usar Open-Elevation API que tiene CORS habilitado
const OPEN_ELEVATION_URL = 'https://open-elevation.com/api/v1/lookup';

export async function fetchElevations(coordinates: LatLng[]) {
  if (coordinates.length === 0) return { elevations: [], gain: 0 };

  try {
    const locations = coordinates.map((coord) => ({ latitude: coord.lat, longitude: coord.lng }));
    
    // Timeout de 5 segundos para no bloquear la app
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(OPEN_ELEVATION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locations }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    const elevations = (data.results ?? []).map((item: any) => Number(item.elevation ?? 0));

    let gain = 0;
    for (let i = 1; i < elevations.length; i += 1) {
      const diff = elevations[i] - elevations[i - 1];
      if (diff > 0) gain += diff;
    }

    return { elevations, gain: Math.round(gain) };
  } catch (error) {
    console.warn('Elevation API unavailable, continuing without elevation data:', error);
    // Calcular elevación estimada basada en la distancia (aproximación)
    const estimatedGain = Math.max(coordinates.length * 2, 50); // Estimación simple
    return { elevations: Array(coordinates.length).fill(0), gain: estimatedGain };
  }
}
