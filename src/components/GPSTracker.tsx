import { motion } from 'framer-motion';
import { GPSState, RouteProgress } from '../hooks/useGPS';
import { Compass } from './Compass';

interface GPSTrackerProps {
  gpsState: GPSState;
  routeProgress: RouteProgress;
  onStartTracking: () => void;
  onStopTracking: () => void;
}

export function GPSTracker({
  gpsState,
  routeProgress,
  onStartTracking,
  onStopTracking,
}: GPSTrackerProps) {
  return (
    <motion.div
      className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-lg p-6 space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">Seguimiento GPS</h3>
        <button
          onClick={gpsState.isTracking ? onStopTracking : onStartTracking}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            gpsState.isTracking
              ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
          }`}
        >
          {gpsState.isTracking ? 'Detener' : 'Iniciar'}
        </button>
      </div>

      {gpsState.error && (
        <div className="space-y-2 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
          <p className="font-medium">⚠️ {gpsState.error}</p>
          {gpsState.error.includes('denegados') && (
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Chrome/Edge: Configuración → Privacidad → Permisos → Ubicación</li>
              <li>Firefox: Preferencias → Privacidad → Permisos → Ubicación</li>
              <li>Safari: Preferencias → Seguridad → Ubicación</li>
            </ul>
          )}
          {gpsState.error.includes('aire libre') && (
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Sal a un área abierta sin techos</li>
              <li>Espera de 30-60 segundos para mejor señal</li>
              <li>Intenta de nuevo</li>
            </ul>
          )}
          {gpsState.error.includes('Reintentando') && (
            <p className="text-xs animate-pulse">Intentando conectar con el GPS...</p>
          )}
        </div>
      )}

      {gpsState.currentLocation && (
        <div className="space-y-3">
          {/* Ubicación Actual */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <p className="text-xs text-slate-400 mb-1">Latitud</p>
              <p className="font-mono text-sm text-slate-100">
                {gpsState.currentLocation.lat.toFixed(6)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <p className="text-xs text-slate-400 mb-1">Longitud</p>
              <p className="font-mono text-sm text-slate-100">
                {gpsState.currentLocation.lng.toFixed(6)}
              </p>
            </div>
          </div>

          {/* Precisión */}
          {gpsState.accuracy !== null && (
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <p className="text-xs text-slate-400 mb-1">Precisión</p>
              <p className="text-sm text-slate-100">±{gpsState.accuracy.toFixed(1)} metros</p>
            </div>
          )}

          {/* Velocidad */}
          {gpsState.speed !== null && (
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <p className="text-xs text-slate-400 mb-1">Velocidad</p>
              <p className="text-sm text-slate-100">{gpsState.speed.toFixed(1)} km/h</p>
            </div>
          )}

          {/* Brújula */}
          {gpsState.heading !== null && (
            <div className="flex justify-center p-3">
              <Compass heading={gpsState.heading} />
            </div>
          )}
        </div>
      )}

      {/* Progreso de la Ruta */}
      {gpsState.currentLocation && routeProgress && (
        <div className="space-y-3 border-t border-slate-700/50 pt-4">
          <h4 className="font-semibold text-slate-100">Progreso de la Ruta</h4>

          {/* Barra de progreso */}
          <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden border border-slate-700/50">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
              animate={{ width: `${routeProgress.percentageComplete}%` }}
              transition={{ type: 'spring', damping: 20 }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <p className="text-xs text-slate-400 mb-1">Recorrido</p>
              <p className="font-semibold text-emerald-400">
                {routeProgress.distanceFromStart.toFixed(1)} km
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <p className="text-xs text-slate-400 mb-1">Progreso</p>
              <p className="font-semibold text-cyan-400">
                {routeProgress.percentageComplete.toFixed(0)}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <p className="text-xs text-slate-400 mb-1">Falta</p>
              <p className="font-semibold text-orange-400">
                {routeProgress.distanceToEnd.toFixed(1)} km
              </p>
            </div>
          </div>
        </div>
      )}

      {!gpsState.currentLocation && !gpsState.error && (
        <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm text-center">
          🔍 Buscando señal GPS... Por favor, espera.
        </div>
      )}

      {gpsState.isTracking && !gpsState.currentLocation && !gpsState.error && (
        <div className="flex justify-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!gpsState.currentLocation && !gpsState.error && !gpsState.isTracking && (
        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 text-sm text-center">
          Presiona "Iniciar" para comenzar el seguimiento GPS
        </div>
      )}
    </motion.div>
  );
}
