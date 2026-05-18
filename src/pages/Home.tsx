import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <motion.section 
      className="grid gap-6 sm:gap-8 py-6 sm:py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div>
        <span className="inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs sm:text-sm font-semibold text-emerald-300 border border-emerald-500/20">BikeRoute Builder</span>
        <h1 className="mt-4 sm:mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-100">Diseña, guarda y analiza rutas ciclistas con un mapa inteligente.</h1>
        <p className="mt-4 sm:mt-6 max-w-xl text-base sm:text-lg leading-7 sm:leading-8 text-slate-400">
          Registra tu ruta, analiza superficies, calcula dificultad y exporta GPX. Todo integrado con Supabase y MapLibre para una experiencia profesional.
        </p>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
          <Link to="/register" className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-all active:scale-95">
            Crear cuenta
          </Link>
          <Link to="/login" className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-800 transition-all">
            Iniciar sesión
          </Link>
        </div>
      </div>

      <motion.div 
        className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-lg p-6 sm:p-8"
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      >
        <h2 className="text-lg sm:text-xl font-semibold text-slate-100">Funcionalidades clave</h2>
        <ul className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 text-sm sm:text-base text-slate-400">
          <li>Creación de rutas con puntos interactivos en el mapa</li>
          <li>Análisis de superficie y elevación por tramo</li>
          <li>Cálculo automático de dificultad</li>
          <li>Exportación/Importación GPX</li>
          <li>Dashboard de rutas personales</li>
        </ul>
      </motion.div>
    </motion.section>
  );
}
