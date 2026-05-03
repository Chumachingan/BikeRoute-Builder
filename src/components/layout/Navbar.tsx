import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="font-semibold text-lg text-emerald-400">BikeRoute Builder</Link>

        <nav className="flex items-center gap-6 text-sm text-slate-300">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-emerald-400 font-semibold' : 'hover:text-white transition-colors'}>Inicio</NavLink>
          {user && (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'text-emerald-400 font-semibold' : 'hover:text-white transition-colors'}>Dashboard</NavLink>
              <NavLink to="/builder" className={({ isActive }) => isActive ? 'text-emerald-400 font-semibold' : 'hover:text-white transition-colors'}>Route Builder</NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-slate-400">{user.email}</span>
              <button onClick={logout} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800 transition-all">Cerrar sesión</button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="rounded-xl bg-emerald-500 px-4 py-2 text-sm text-slate-950 font-semibold hover:bg-emerald-400 transition-all">Iniciar sesión</Link>
              <Link to="/register" className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800 transition-all">Registrarse</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
