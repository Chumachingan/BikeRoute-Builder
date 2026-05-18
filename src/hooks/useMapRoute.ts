import { useMemo, useState, useCallback } from 'react';
import { LatLng } from '../types/route';
import { computeDistanceKm } from '../utils/geoUtils';
import { calculateRoute, BikeProfileType } from '../services/routingService';

export function useMapRoute(initialPoints: LatLng[] = []) {
  const [waypoints, setWaypoints] = useState<LatLng[]>(initialPoints);
  const [routePoints, setRoutePoints] = useState<LatLng[]>(initialPoints);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [bikeProfile, setBikeProfile] = useState<BikeProfileType>('balanced');

  const totalDistance = useMemo(() => computeDistanceKm(routePoints), [routePoints]);

  const addPoint = useCallback(async (point: LatLng) => {
    setWaypoints((prev) => {
      const newWaypoints = [...prev, point];
      
      // Cuando se tienen exactamente 2 waypoints, calcular automáticamente la ruta
      if (newWaypoints.length === 2) {
        setIsCalculatingRoute(true);
        calculateRoute(newWaypoints, bikeProfile).then((calculatedRoute) => {
          if (calculatedRoute && calculatedRoute.length > 2) {
            console.log('✅ Ruta actualizada con', calculatedRoute.length, 'puntos');
            setRoutePoints(calculatedRoute);
          } else {
            console.warn('⚠️ Ruta vacía o muy corta, no se actualiza');
            setRoutePoints([]);
          }
          setIsCalculatingRoute(false);
        });
      } else if (newWaypoints.length > 2) {
        // Si se agregan más waypoints, recalcular la ruta
        setIsCalculatingRoute(true);
        calculateRoute(newWaypoints, bikeProfile).then((calculatedRoute) => {
          if (calculatedRoute && calculatedRoute.length > 2) {
            setRoutePoints(calculatedRoute);
          } else {
            setRoutePoints([]);
          }
          setIsCalculatingRoute(false);
        });
      }
      
      return newWaypoints;
    });
  }, [bikeProfile]);

  const removeLastPoint = useCallback(() => {
    setWaypoints((prev) => {
      const newWaypoints = prev.slice(0, -1);
      
      // Recalcular la ruta si aún hay al menos 2 puntos
      if (newWaypoints.length >= 2) {
        setIsCalculatingRoute(true);
        calculateRoute(newWaypoints, bikeProfile).then((calculatedRoute) => {
          if (calculatedRoute && calculatedRoute.length > 2) {
            setRoutePoints(calculatedRoute);
          } else {
            setRoutePoints([]);
          }
          setIsCalculatingRoute(false);
        });
      } else {
        setRoutePoints([]);
      }
      
      return newWaypoints;
    });
  }, [bikeProfile]);

  const reset = useCallback(() => {
    setWaypoints([]);
    setRoutePoints([]);
    setIsCalculatingRoute(false);
  }, []);

  const changeProfile = useCallback(async (newProfile: BikeProfileType) => {
    setBikeProfile(newProfile);
    
    // Recalcular la ruta con el nuevo perfil si hay waypoints
    if (waypoints.length >= 2) {
      setIsCalculatingRoute(true);
      const calculatedRoute = await calculateRoute(waypoints, newProfile);
      if (calculatedRoute && calculatedRoute.length > 2) {
        setRoutePoints(calculatedRoute);
      } else {
        setRoutePoints([]);
      }
      setIsCalculatingRoute(false);
    }
  }, [waypoints]);

  return {
    points: routePoints,
    waypoints,
    totalDistance,
    addPoint,
    removeLastPoint,
    reset,
    setPoints: setRoutePoints,
    isCalculatingRoute,
    bikeProfile,
    changeProfile,
  };
}
