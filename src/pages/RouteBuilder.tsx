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
  const { points, totalDistance, addPoint, removeLastPoint, reset, setPoints } = useMapRoute();
  const [routeName, setRouteName] = useState('Mi ruta de bici');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('Haz clic en el mapa para agregar puntos.');
  const [mapStyle, setMapStyle] = useState<keyof typeof MAP_STYLES>('voyager');

  const pointLayerData = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: points.map((point) => ({
        type: 'Feature' as const,
        properties: null,
        geometry: {
          type: 'Point' as const,
          coordinates: [point.lng, point.lat],
        },
      })),
    }),
    [points]
  );

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
        center: [-58.3816, -34.6037],
        zoom: 3,
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
  }, [points, pointLayerData, routeLine]);

  const handleSave = async () => {
    if (!user) return;
    if (points.length < 2) {
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
      className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-lg p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">Route Builder</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-100">Dibuja tu ruta en el mapa</h1>
          </div>
          <div className="space-x-3">
            <Button variant="secondary" onClick={removeLastPoint} disabled={points.length === 0}>Borrar último punto</Button>
            <Button variant="secondary" onClick={reset} disabled={points.length === 0}>Reiniciar ruta</Button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">Estilo de mapa:</label>
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

        <div className="h-[520px] overflow-hidden rounded-xl border border-slate-800 shadow-lg">
          <div ref={mapContainer} className="h-full w-full" />
        </div>
      </div>

      <div className="space-y-6">
        <motion.div 
          className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-lg p-6"
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 250, damping: 20 }}
        >
          <h2 className="text-xl font-semibold text-slate-100">Resumen de la ruta</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Nombre de la ruta</label>
              <input
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-4">
                <p className="text-sm text-slate-400">Puntos</p>
                <p className="mt-2 text-2xl font-semibold text-slate-100">{points.length}</p>
              </div>
              <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-4">
                <p className="text-sm text-slate-400">Distancia</p>
                <p className="mt-2 text-2xl font-semibold text-slate-100">{totalDistance.toFixed(2)} km</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button onClick={handleSave} disabled={saving || points.length < 2}>Guardar ruta</Button>
            <p className={`text-sm ${saving ? 'text-slate-400' : message.includes('Error') ? 'text-red-400' : 'text-slate-400'}`}>{message}</p>
          </div>
        </motion.div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-100">Instrucciones</h2>
          <ul className="mt-4 space-y-3 text-slate-400">
            <li>Haz clic en el mapa para crear puntos.</li>
            <li>Se dibujará automáticamente la línea de tu ruta.</li>
            <li>Guarda la ruta para calcular elevación, superficie y dificultad.</li>
          </ul>
        </div>
      </div>
    </motion.section>
  );
}
