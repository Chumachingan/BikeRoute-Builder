import { motion } from 'framer-motion';
import { LatLng } from '../types/route';
import { formatDistance, computeDistanceKm } from '../utils/geoUtils';

interface MapFallbackProps {
  coordinates: LatLng[];
  routeName: string;
  distanceKm: number;
}

/**
 * Componente alternativo cuando WebGL/MapLibre no está disponible
 */
export function MapFallback({ coordinates, routeName, distanceKm }: MapFallbackProps) {
  return (
    <motion.div
      className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-amber-500/20 border border-amber-500/30">
          <p className="text-sm text-amber-200">
            ⚠️ El mapa no está disponible en tu navegador (WebGL deshabilitado). Pero puedes ver los detalles de la ruta.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-slate-100">Información de la ruta</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <p className="text-xs text-slate-400">Nombre</p>
              <p className="font-semibold text-slate-100 truncate">{routeName}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <p className="text-xs text-slate-400">Distancia</p>
              <p className="font-semibold text-emerald-400">{formatDistance(distanceKm)}</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <p className="text-xs text-slate-400 mb-2">Puntos de la ruta ({coordinates.length})</p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {coordinates.map((point, index) => (
                <div
                  key={index}
                  className="text-xs font-mono p-2 bg-slate-900/50 rounded border border-slate-700/30"
                >
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">#{index + 1}</span>
                    <span className="text-cyan-400">{point.lat.toFixed(6)}</span>
                    <span className="text-emerald-400">{point.lng.toFixed(6)}</span>
                  </div>
                  {index < coordinates.length - 1 && (
                    <div className="text-xs text-slate-500 mt-1">
                      ↓ {computeDistanceKm([point, coordinates[index + 1]]).toFixed(2)} km
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-400">
          💡 Intenta:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Habilitar la aceleración de hardware en tu navegador</li>
            <li>Usar Chrome, Firefox, Safari o Edge</li>
            <li>Actualizar tu navegador</li>
            <li>Reiniciar el navegador</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
