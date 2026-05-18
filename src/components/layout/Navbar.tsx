import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="font-semibold text-lg sm:text-xl text-emerald-400">BikeRoute Builder</Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-emerald-400 font-semibold' : 'hover:text-white transition-colors'}>Inicio</NavLink>
          {user && (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'text-emerald-400 font-semibold' : 'hover:text-white transition-colors'}>Dashboard</NavLink>
              <NavLink to="/builder" className={({ isActive }) => isActive ? 'text-emerald-400 font-semibold' : 'hover:text-white transition-colors'}>Route Builder</NavLink>
            </>
          )}
        </nav>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-slate-400 truncate">{user.email}</span>
              <button onClick={logout} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800 transition-all whitespace-nowrap">Cerrar sesión</button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="rounded-xl bg-emerald-500 px-4 py-2 text-sm text-slate-950 font-semibold hover:bg-emerald-400 transition-all whitespace-nowrap">Iniciar sesión</Link>
              <Link to="/register" className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800 transition-all whitespace-nowrap">Registrarse</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/50">
          <nav className="px-4 py-4 space-y-3 text-sm text-slate-300">
            <NavLink 
              to="/" 
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => `block py-2 ${isActive ? 'text-emerald-400 font-semibold' : 'hover:text-white transition-colors'}`}
            >
              Inicio
            </NavLink>
            {user && (
              <>
                <NavLink 
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => `block py-2 ${isActive ? 'text-emerald-400 font-semibold' : 'hover:text-white transition-colors'}`}
                >
                  Dashboard
                </NavLink>
                <NavLink 
                  to="/builder"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => `block py-2 ${isActive ? 'text-emerald-400 font-semibold' : 'hover:text-white transition-colors'}`}
                >
                  Route Builder
                </NavLink>
              </>
            )}
          </nav>
          
          <div className="border-t border-slate-800 px-4 py-4 space-y-3">
            {user ? (
              <>
                <p className="text-xs text-slate-400 truncate">Email: {user.email}</p>
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800 transition-all"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-center rounded-xl bg-emerald-500 px-4 py-2 text-sm text-slate-950 font-semibold hover:bg-emerald-400 transition-all"
                >
                  Iniciar sesión
                </Link>
                <Link 
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-center rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800 transition-all"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
