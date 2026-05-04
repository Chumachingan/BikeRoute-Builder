import { useState, useEffect, useRef } from 'react';
import { LatLng } from '../types/route';
import { computeDistanceKm } from '../utils/geoUtils';

export interface GPSState {
  currentLocation: LatLng | null;
  accuracy: number | null;
  heading: number | null;
  speed: number | null;
  isTracking: boolean;
  error: string | null;
}

export interface RouteProgress {
  distanceFromStart: number;
  distanceToEnd: number;
  percentageComplete: number;
  nearestPointIndex: number;
}

export function useGPS(routeCoordinates: LatLng[] = []) {
  const [gpsState, setGpsState] = useState<GPSState>({
    currentLocation: null,
    accuracy: null,
    heading: null,
    speed: null,
    isTracking: false,
    error: null,
  });

  const [routeProgress, setRouteProgress] = useState<RouteProgress>({
    distanceFromStart: 0,
    distanceToEnd: 0,
    percentageComplete: 0,
    nearestPointIndex: 0,
  });

  const watchIdRef = useRef<number | null>(null);

  // Iniciar seguimiento GPS
  const startTracking = () => {
    if (!navigator.geolocation) {
      setGpsState((prev) => ({
        ...prev,
        error: 'Geolocalización no soportada en tu navegador',
      }));
      return;
    }

    setGpsState((prev) => ({ ...prev, isTracking: true, error: null }));

    // Intentar primero con alta precisión, pero con timeout más largo
    const highAccuracyOptions = {
      enableHighAccuracy: true,
      timeout: 15000, // 15 segundos
      maximumAge: 0,
    };

    // Si falla, reintentar con opciones más relajadas
    let retryCount = 0;
    const maxRetries = 2;

    const attemptWatch = (options: PositionOptions) => {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy, heading, speed } = position.coords;
          const currentLocation = { lat: latitude, lng: longitude };

          setGpsState((prev) => ({
            ...prev,
            currentLocation,
            accuracy,
            heading,
            speed: speed ? speed * 3.6 : null, // Convertir m/s a km/h
            error: null,
          }));

          // Calcular progreso en la ruta
          if (routeCoordinates.length > 0) {
            updateRouteProgress(currentLocation, routeCoordinates);
          }
        },
        (error) => {
          let errorMessage = 'Error desconocido al obtener ubicación';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permisos de ubicación denegados. Ve a configuración del navegador y habilita el acceso a ubicación.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Ubicación no disponible. Asegúrate de tener GPS habilitado y estar al aire libre.';
              break;
            case error.TIMEOUT:
              // Reintentar con opciones más flexibles
              if (retryCount < maxRetries && options.enableHighAccuracy) {
                retryCount++;
                const relaxedOptions = {
                  enableHighAccuracy: false,
                  timeout: 20000, // 20 segundos
                  maximumAge: 60000, // Aceptar posición de hasta 1 minuto
                };
                setGpsState((prev) => ({
                  ...prev,
                  error: `Reintentando (intento ${retryCount + 1})...`,
                }));
                attemptWatch(relaxedOptions);
                return;
              }
              errorMessage = 'Tiempo de espera agotado. Intenta en un área abierta con mejor señal GPS.';
              break;
          }
          
          if (retryCount === maxRetries || error.code !== error.TIMEOUT) {
            setGpsState((prev) => ({
              ...prev,
              error: errorMessage,
              isTracking: false,
            }));
          }
        },
        options
      );
    };

    attemptWatch(highAccuracyOptions);
  };

  // Detener seguimiento GPS
  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setGpsState((prev) => ({ ...prev, isTracking: false }));
  };

  // Calcular progreso en la ruta
  const updateRouteProgress = (currentLocation: LatLng, coordinates: LatLng[]) => {
    if (coordinates.length === 0) return;

    // Encontrar el punto más cercano en la ruta
    let nearestIndex = 0;
    let minDistance = Infinity;

    coordinates.forEach((point, index) => {
      const distance = computeDistanceKm([currentLocation, point]);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    });

    // Calcular distancia desde el inicio hasta el punto actual
    const coordinatesUntilNearest = coordinates.slice(0, nearestIndex + 1);
    const distanceFromStart = computeDistanceKm(coordinatesUntilNearest);

    // Calcular distancia total y distancia restante
    const totalDistance = computeDistanceKm(coordinates);
    const distanceToEnd = totalDistance - distanceFromStart;

    // Calcular porcentaje completado
    const percentageComplete = totalDistance > 0 ? (distanceFromStart / totalDistance) * 100 : 0;

    setRouteProgress({
      distanceFromStart,
      distanceToEnd,
      percentageComplete: Math.min(percentageComplete, 100), // No superar 100%
      nearestPointIndex: nearestIndex,
    });
  };

  // Obtener ubicación única
  const getCurrentLocation = () => {
    return new Promise<LatLng>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true }
      );
    });
  };

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    gpsState,
    routeProgress,
    startTracking,
    stopTracking,
    getCurrentLocation,
  };
}
