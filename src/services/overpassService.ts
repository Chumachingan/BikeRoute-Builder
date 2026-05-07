import { SurfaceType } from '../types/surface';
import { LatLng, SurfaceStats } from '../types/route';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
// Proxy CORS para evitar problemas de CORS
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

function classifySurface(tags: Record<string, string | undefined>): SurfaceType {
  const surface = tags.surface?.toLowerCase() ?? '';
  const highway = tags.highway?.toLowerCase() ?? '';
  const tracktype = tags.tracktype?.toLowerCase() ?? '';

  if (surface.includes('asphalt') || highway === 'cycleway') return 'asphalt';
  if (surface.includes('gravel') || tracktype === 'grade2') return 'gravel';
  if (surface.includes('dirt') || surface.includes('unpaved') || highway === 'track') return 'dirt';
  return 'unknown';
}

export async function analyzeSurface(coordinates: LatLng[]): Promise<SurfaceStats> {
  if (coordinates.length < 2) {
    return { asphalt: 0, gravel: 0, dirt: 0, unknown: 100 };
  }

  const bbox = coordinates.reduce(
    (acc, coord) => ({
      minLat: Math.min(acc.minLat, coord.lat),
      minLng: Math.min(acc.minLng, coord.lng),
      maxLat: Math.max(acc.maxLat, coord.lat),
      maxLng: Math.max(acc.maxLng, coord.lng),
    }),
    {
      minLat: coordinates[0].lat,
      minLng: coordinates[0].lng,
      maxLat: coordinates[0].lat,
      maxLng: coordinates[0].lng,
    }
  );

  const query = `[
  out:json][timeout:25];
  (
    way[highway](${bbox.minLat},${bbox.minLng},${bbox.maxLat},${bbox.maxLng});
  );
  out tags;`;

  try {
    // Intentar con CORS proxy primero
    const response = await fetch(`${CORS_PROXY}${OVERPASS_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!response.ok) throw new Error('CORS proxy failed');
    const payload = await response.json();
    
    const counts: Record<SurfaceType, number> = { asphalt: 0, gravel: 0, dirt: 0, unknown: 0 };
    const items = payload.elements ?? [];

    items.forEach((item: any) => {
      const type = classifySurface(item.tags || {});
      counts[type] += 1;
    });

    const total = Math.max(Object.values(counts).reduce((sum, value) => sum + value, 0), 1);

    return {
      asphalt: Math.round((counts.asphalt / total) * 100),
      gravel: Math.round((counts.gravel / total) * 100),
      dirt: Math.round((counts.dirt / total) * 100),
      unknown: Math.round((counts.unknown / total) * 100),
    };
  } catch (error) {
    // Si falla el análisis de superficie, devolver valores por defecto
    console.error('Error analyzing surface:', error);
    return { asphalt: 50, gravel: 25, dirt: 15, unknown: 10 };
  }
}
