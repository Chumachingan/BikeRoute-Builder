import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
import { motion } from 'framer-motion';
import { getRouteById } from '../services/routesService';
import { exportGPX } from '../services/gpxService';
import { RouteRecord } from '../types/route';
import { Button } from '../components/ui/Button';
import { formatDistance } from '../utils/geoUtils';
import { useGPS } from '../hooks/useGPS';
import { GPSTracker } from '../components/GPSTracker';
import { MapFallback } from '../components/MapFallback';

const MAP_STYLES = {
  voyager: {
    name: 'Voyager (Detallado)',
    url: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
  },
  positron: {
    name: 'Positron (Minimalista)',
    url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  },
  positron_nolabels: {
    name: 'Positron Sin Etiquetas',
    url: 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json',
  },
  osm_bright: {
    name: 'OSM Bright',
    url: 'https://tiles.stadiamaps.com/styles/osm_bright.json',
  },
  stamen_terrain: {
    name: 'Terreno (Stamen)',
    url: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
  },
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'fácil':
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20';
    case 'moderada':
      return 'bg-orange-500/15 text-orange-300 border-orange-500/20';
    case 'difícil':
      return 'bg-red-500/15 text-red-300 border-red-500/20';
    default:
      return 'bg-slate-500/15 text-slate-300 border-slate-500/20';
  }
};

export default function RouteDetail() {
  const { id } = useParams();
  const [route, setRoute] = useState<RouteRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mapError, setMapError] = useState(false);
  const [mapStyle, setMapStyle] = useState<keyof typeof MAP_STYLES>('voyager');
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const gpsMarkerRef = useRef<maplibregl.Marker | null>(null);

  const { gpsState, routeProgress, startTracking, stopTracking } = useGPS(
    route?.coordinates || []
  );

  useEffect(() => {
    if (!id) return;

    getRouteById(id)
      .then(setRoute)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!route || !mapContainer.current || mapRef.current) return;
    
    try {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: MAP_STYLES[mapStyle].url,
        center: [route.coordinates[0].lng, route.coordinates[0].lat],
        zoom: 10,
      });

      map.addControl(new maplibregl.NavigationControl(), 'top-right');
      map.on('load', () => {
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: route.coordinates.map((point) => [point.lng, point.lat]),
                },
              },
            ],
          },
        });

        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          paint: {
            'line-color': '#10b981',
            'line-width': 6,
          },
        });
      });

      mapRef.current = map;
    } catch (err: any) {
      const errorMsg = err?.message || 'Error al cargar el mapa';
      setMapError(true);
      console.error('Map initialization error:', err);
    }
  }, [route, mapStyle]);

  // Manejar actualizaciones del marcador GPS
  useEffect(() => {
    if (!mapRef.current || !gpsState.currentLocation) return;

    if (gpsMarkerRef.current) {
      gpsMarkerRef.current.setLngLat([gpsState.currentLocation.lng, gpsState.currentLocation.lat]);
    } else {
      // Crear marcador GPS
      const el = document.createElement('div');
      el.className = 'gps-marker';
      el.innerHTML = `
        <div class="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 border-2 border-white shadow-lg flex items-center justify-center">
          <div class="w-2 h-2 rounded-full bg-white"></div>
        </div>
      `;

      gpsMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([gpsState.currentLocation.lng, gpsState.currentLocation.lat])
        .addTo(mapRef.current);
    }

    // Auto-centrar en la ubicación actual (opcional)
    // mapRef.current.flyTo({
    //   center: [gpsState.currentLocation.lng, gpsState.currentLocation.lat],
    //   zoom: 15,
    //   duration: 1000,
    // });
  }, [gpsState.currentLocation]);

  const handleExport = () => {
    if (!route) return;
    const gpx = exportGPX(route.coordinates, route.name);
    const blob = new Blob([gpx], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${route.name.replace(/\s+/g, '_')}.gpx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-lg p-8 text-slate-400">Cargando ruta...</div>;
  }

  if (error || !route) {
    return <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-lg p-8 text-red-400">{error || 'Ruta no encontrada'}</div>;
  }

  return (
    <motion.section 
      className="space-y-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-lg p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">Detalle de ruta</p>
            <div className="mt-2 flex items-center gap-3">
              <h1 className="text-3xl font-semibold text-slate-100">{route.name}</h1>
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getDifficultyColor(route.difficulty)}`}>
                {route.difficulty}
              </span>
            </div>
          </div>
          <Button onClick={handleExport}>Exportar GPX</Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        {mapError ? (
          <MapFallback 
            coordinates={route.coordinates}
            routeName={route.name}
            distanceKm={route.distance_km}
          />
        ) : (
          <motion.div 
            className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-lg p-6"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
          >
            <div className="h-[520px] overflow-hidden rounded-xl border border-slate-800 shadow-lg">
              <div ref={mapContainer} className="h-full w-full" />
            </div>
          </motion.div>
        )}

        <div className="space-y-6">
          <GPSTracker 
            gpsState={gpsState}
            routeProgress={routeProgress}
            onStartTracking={startTracking}
            onStopTracking={stopTracking}
          />

          <motion.div 
            className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-lg p-6"
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
          >
            <h2 className="text-xl font-semibold text-slate-100">Estadísticas</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-5">
                <p className="text-sm text-slate-400">Distancia</p>
                <p className="mt-2 text-2xl font-semibold text-slate-100">{formatDistance(route.distance_km)}</p>
              </div>
              <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-5">
                <p className="text-sm text-slate-400">Desnivel</p>
                <p className="mt-2 text-2xl font-semibold text-slate-100">{route.elevation_gain_m} m</p>
              </div>
              <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-5">
                <p className="text-sm text-slate-400">Superficie gravel + dirt</p>
                <p className="mt-2 text-2xl font-semibold text-slate-100">{route.surface_stats.gravel + route.surface_stats.dirt}%</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-lg p-6"
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
          >
            <h2 className="text-xl font-semibold text-slate-100">Distribución por superficie</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-400">
              <div className="flex items-center justify-between gap-4">
                <span>Asfalto</span>
                <span className="font-semibold text-slate-100">{route.surface_stats.asphalt}%</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Gravel</span>
                <span className="font-semibold text-slate-100">{route.surface_stats.gravel}%</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Dirt</span>
                <span className="font-semibold text-slate-100">{route.surface_stats.dirt}%</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Desconocido</span>
                <span className="font-semibold text-slate-100">{route.surface_stats.unknown}%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
