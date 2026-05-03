import { motion } from 'framer-motion';
import { RouteRecord } from '../../types/route';
import { difficultyColor } from '../../utils/difficultyUtils';

type Props = {
  route: RouteRecord;
  onDelete: (id: string) => void;
};

export function RouteCard({ route, onDelete }: Props) {
  const difficultyClass = difficultyColor(route.difficulty);

  return (
    <motion.div 
      className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-lg p-6"
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-100">{route.name}</h3>
          <p className="mt-2 text-sm text-slate-400">Creada el {new Date(route.created_at).toLocaleDateString()}</p>
        </div>
        <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${difficultyClass}`}>{route.difficulty}</div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-400 sm:grid-cols-4">
        <div>
          <span className="block text-slate-100 font-semibold">{route.distance_km.toFixed(1)} km</span>
          Distancia
        </div>
        <div>
          <span className="block text-slate-100 font-semibold">{route.elevation_gain_m} m</span>
          Desnivel
        </div>
        <div>
          <span className="block text-slate-100 font-semibold">{route.surface_stats.gravel + route.surface_stats.dirt}%</span>
          Off-road
        </div>
        <div>
          <span className="block text-slate-100 font-semibold">{route.surface_stats.asphalt}%</span>
          Asfalto
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={`/route/${route.id}`}
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-all active:scale-95"
        >
          Ver detalle
        </a>
        <button
          onClick={() => onDelete(route.id)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800 transition-all"
        >
          Borrar ruta
        </button>
      </div>
    </motion.div>
  );
}
