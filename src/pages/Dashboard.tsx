import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useRoutes } from '../hooks/useRoutes';
import { RouteCard } from '../components/routes/RouteCard';
import { Button } from '../components/ui/Button';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { routes, loading, error, refresh, remove } = useRoutes(user?.id);

  const totalRoutes = useMemo(() => routes.length, [routes]);

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
            <p className="text-xs uppercase tracking-widest text-slate-500">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-100">Tus rutas guardadas</h1>
            <p className="mt-2 text-slate-400">Revisa el estado de tus rutas y gestiona tu planificación ciclista.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={refresh}>Actualizar</Button>
            <Button onClick={() => navigate('/builder')}>Nueva ruta</Button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <motion.div 
            className="rounded-2xl bg-gradient-to-br from-emerald-500/20 to-sky-500/10 border border-emerald-500/20 p-6"
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
          >
            <span className="block text-xs uppercase tracking-widest text-slate-400">Rutas totales</span>
            <p className="mt-4 text-4xl font-semibold text-slate-100">{totalRoutes}</p>
          </motion.div>
        </div>
      </div>

      <div className="space-y-5">
        {loading && <p className="text-slate-400">Cargando rutas...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && routes.length === 0 && <p className="text-slate-400">Aún no tienes rutas. Crea tu primera ruta en el constructor.</p>}
        <div className="grid gap-5">
          {routes.map((route) => (
            <RouteCard key={route.id} route={route} onDelete={remove} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
