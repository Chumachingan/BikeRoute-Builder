import { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useMapRoute } from '../hooks/useMapRoute';
import { analyzeSurface } from '../services/overpassService';
import { createRoute } from '../services/routesService';
import { fetchElevations } from '../services/elevationService';
import { computeDifficulty } from '../utils/difficultyUtils';
import { LatLng } from '../types/route';

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

export default function RouteBuilder() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { points, waypoints, totalDistance, addPoint, removeLastPoint, reset, isCalculatingRoute, bikeProfile, changeProfile } = useMapRoute();
  const [routeName, setRouteName] = useState('Mi ruta de bici');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('Haz clic en el mapa para agregar 2 puntos y la ruta se trazará automáticamente.');
  const [mapStyle, setMapStyle] = useState<keyof typeof MAP_STYLES>('voyager');

  // Usar waypoints para mostrar los puntos en el mapa (solo inicio y final)
  const pointLayerData = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: waypoints.map((point) => ({
        type: 'Feature' as const,
        properties: null,
        geometry: {
          type: 'Point' as const,
          coordinates: [point.lng, point.lat],
        },
      })),
    }),
    [waypoints]
  );

  // Usar points para dibujar la línea completa de la ruta
  const routeLine = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          properties: null,
          geometry: {
            type: 'LineString' as const,
            coordinates: points.map((point) => [point.lng, point.lat]),
          },
        },
      ],
    }),
    [points]
  );

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: MAP_STYLES[mapStyle].url,
        center: [-3.8100, 43.4600], // Santander, España
        zoom: 11,
      });

      map.addControl(new maplibregl.NavigationControl(), 'top-right');
      map.on('click', (event) => {
        const newPoint: LatLng = { lat: event.lngLat.lat, lng: event.lngLat.lng };
        addPoint(newPoint);
      });

      map.on('load', () => {
        map.addSource('route', { type: 'geojson', data: routeLine });
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          paint: {
            'line-color': '#10b981',
            'line-width': 5,
          },
        });
        map.addSource('points', { type: 'geojson', data: pointLayerData });
        map.addLayer({
          id: 'route-points',
          type: 'circle',
          source: 'points',
          paint: {
            'circle-radius': 6,
            'circle-color': '#0ea5e9',
            'circle-stroke-color': '#fff',
            'circle-stroke-width': 2,
          },
        });
      });

      mapRef.current = map;
    } catch (err: any) {
      const errorMsg = err?.message || 'Error al cargar el mapa';
      setMessage(`Error: No se puede inicializar el mapa. ${errorMsg}`);
      console.error('Map initialization error:', err);
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    map.setStyle(MAP_STYLES[mapStyle].url);
  }, [mapStyle]);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (!map.getSource('route')) return;
    const routeSource = map.getSource('route') as maplibregl.GeoJSONSource;
    routeSource.setData(routeLine);
    const pointSource = map.getSource('points') as maplibregl.GeoJSONSource;
    pointSource?.setData(pointLayerData);
  }, [waypoints, pointLayerData, routeLine]);

  const handleSave = async () => {
    if (!user) return;
    if (waypoints.length < 2) {
      setMessage('Agrega al menos 2 puntos para guardar una ruta.');
      return;
    }

    setSaving(true);
    setMessage('Guardando ruta...');

    try {
      const surface_stats = await analyzeSurface(points);
      const { gain } = await fetchElevations(points);
      const difficulty = computeDifficulty(totalDistance, gain, surface_stats);

      await createRoute({
        user_id: user.id,
        name: routeName,
        coordinates: points,
        distance_km: Number(totalDistance.toFixed(2)),
        elevation_gain_m: gain,
        difficulty,
        surface_stats,
      });

      setMessage('Ruta guardada con éxito. Redirigiendo al dashboard...');
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (error) {
      setMessage(`Error al guardar la ruta: ${(error as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.section 
      className="space-y-4 sm:space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Instrucciones al inicio */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-100 flex items-center gap-2">
          <span>ℹ️ Instrucciones</span>
        </h2>
        <ul className="mt-4 space-y-2 sm:space-y-3 text-sm sm:text-base text-slate-400 list-disc list-inside">
          <li>Haz clic en el mapa para crear un punto de inicio</li>
          <li>Haz clic en otro punto para crear el destino</li>
          <li>La ruta se trazará automáticamente por la ruta más corta 🚴</li>
          <li>Puedes agregar más puntos de parada si lo deseas</li>
          <li>Usa los botones para borrar puntos o reiniciar</li>
          <li>Guarda la ruta para calcular elevación y superficie</li>
        </ul>
      </div>

      {/* Configuración y controles */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-lg p-4 sm:p-6">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Nombre de la ruta</label>
            <input
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/40"
              placeholder="Mi ruta de bici"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">Estilo de mapa:</label>
            <select
              value={mapStyle}
              onChange={(e) => setMapStyle(e.target.value as keyof typeof MAP_STYLES)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/40"
            >
              {Object.entries(MAP_STYLES).map(([key, { name }]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">Tipo de bicicleta:</label>
            <select
              value={bikeProfile}
              onChange={(e) => changeProfile(e.target.value as 'balanced' | 'gravel' | 'road' | 'mtb')}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/40"
            >
              <option value="balanced">🚴 Balanceada (carreteras locales + caminos)</option>
              <option value="road">🏁 Ruta (carreteras asfaltadas)</option>
              <option value="gravel">🏞️ Gravel (grava + caminos de tierra)</option>
              <option value="mtb">⛰️ MTB (senderos y pistas de montaña)</option>
            </select>
          </div>

          <div className="grid gap-3 grid-cols-2">
            <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-slate-400">Puntos</p>
              <p className="mt-2 text-xl sm:text-2xl font-semibold text-slate-100">{waypoints.length}</p>
            </div>
            <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-slate-400">Distancia</p>
              <p className="mt-2 text-xl sm:text-2xl font-semibold text-slate-100">{totalDistance.toFixed(2)} km</p>
            </div>
          </div>

          {isCalculatingRoute && (
            <div className="rounded-xl bg-blue-900/30 border border-blue-500/50 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-blue-300 flex items-center gap-2">
                <span className="animate-spin">🔄</span> Calculando ruta más corta...
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              variant="danger" 
              onClick={removeLastPoint} 
              disabled={waypoints.length === 0}
              size="sm"
              className="flex-1"
            >
              Borrar último
            </Button>
            <Button 
              variant="ghost" 
              onClick={reset} 
              disabled={waypoints.length === 0}
              size="sm"
              className="flex-1"
            >
              Reiniciar
            </Button>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-lg p-4 sm:p-6">
        <div className="h-[400px] sm:h-[500px] overflow-hidden rounded-xl border border-slate-800 shadow-lg">
          <div ref={mapContainer} className="h-full w-full" />
        </div>
      </div>

      {/* Resumen y guardar */}
      <motion.div 
        className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-lg p-4 sm:p-6"
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      >
        <h2 className="text-lg sm:text-xl font-semibold text-slate-100">Guardar ruta</h2>
        <p className="mt-2 text-sm text-slate-400">Necesitas mínimo 2 puntos para guardar</p>
        
        <div className="mt-4 sm:mt-6 flex flex-col gap-3">
          <Button onClick={handleSave} disabled={saving || waypoints.length < 2} size="lg" className="w-full">
            {saving ? 'Guardando...' : 'Guardar ruta'}
          </Button>
          <p className={`text-xs sm:text-sm ${saving ? 'text-slate-400' : message.includes('Error') ? 'text-red-400' : 'text-emerald-400'}`}>{message}</p>
        </div>
      </motion.div>
    </motion.section>
  );
}
