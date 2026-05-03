import { useMemo, useState } from 'react';
import { LatLng } from '../types/route';
import { computeDistanceKm } from '../utils/geoUtils';

export function useMapRoute(initialPoints: LatLng[] = []) {
  const [points, setPoints] = useState<LatLng[]>(initialPoints);

  const totalDistance = useMemo(() => computeDistanceKm(points), [points]);

  const addPoint = (point: LatLng) => setPoints((prev) => [...prev, point]);
  const removeLastPoint = () => setPoints((prev) => prev.slice(0, -1));
  const reset = () => setPoints([]);

  return {
    points,
    totalDistance,
    addPoint,
    removeLastPoint,
    reset,
    setPoints,
  };
}
