import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-3 flex items-center justify-between gap-2 sm:gap-3">
        <Link to="/" className="font-semibold text-base sm:text-lg text-emerald-400 shrink-0">BikeRoute</Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-xs sm:text-sm text-slate-300">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-emerald-400 font-semibold whitespace-nowrap' : 'hover:text-white transition-colors whitespace-nowrap'}>Inicio</NavLink>
          {user && (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'text-emerald-400 font-semibold whitespace-nowrap' : 'hover:text-white transition-colors whitespace-nowrap'}>Dashboard</NavLink>
              <NavLink to="/builder" className={({ isActive }) => isActive ? 'text-emerald-400 font-semibold whitespace-nowrap' : 'hover:text-white transition-colors whitespace-nowrap'}>Builder</NavLink>
            </>
          )}
        </nav>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          {user ? (
            <>
              <span className="text-xs text-slate-400 truncate max-w-[150px]">{user.email}</span>
              <button onClick={logout} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 hover:bg-slate-800 transition-all whitespace-nowrap">Salir</button>
            </>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link to="/login" className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs text-slate-950 font-semibold hover:bg-emerald-400 transition-all whitespace-nowrap">Iniciar</Link>
              <Link to="/register" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 hover:bg-slate-800 transition-all whitespace-nowrap">Registrar</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-1.5 rounded-lg hover:bg-slate-800 transition-colors ml-auto"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/50">
          <nav className="px-3 py-3 space-y-2 text-xs sm:text-sm text-slate-300">
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
          
          <div className="border-t border-slate-800 px-3 py-3 space-y-2">
            {user ? (
              <>
                <p className="text-xs text-slate-400 truncate break-all">Email: {user.email}</p>
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 hover:bg-slate-800 transition-all"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-1.5">
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-center rounded-lg bg-emerald-500 px-3 py-2 text-xs text-slate-950 font-semibold hover:bg-emerald-400 transition-all"
                >
                  Iniciar sesión
                </Link>
                <Link 
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-center rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 hover:bg-slate-800 transition-all"
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
