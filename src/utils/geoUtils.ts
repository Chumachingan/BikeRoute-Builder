import { LatLng } from '../types/route';

const EARTH_RADIUS_KM = 6371;

function radians(value: number) {
  return (value * Math.PI) / 180;
}

export function haversineDistance(a: LatLng, b: LatLng) {
  const dLat = radians(b.lat - a.lat);
  const dLon = radians(b.lng - a.lng);
  const lat1 = radians(a.lat);
  const lat2 = radians(b.lat);

  const sinLat = Math.sin(dLat / 2) ** 2;
  const sinLon = Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon), Math.sqrt(1 - sinLat - Math.cos(lat1) * Math.cos(lat2) * sinLon));

  return EARTH_RADIUS_KM * c;
}

export function computeDistanceKm(points: LatLng[]) {
  return points.reduce((distance, point, index) => {
    if (index === 0) return 0;
    return distance + haversineDistance(points[index - 1], point);
  }, 0);
}

export function formatDistance(value: number) {
  return `${value.toFixed(2)} km`;
}
