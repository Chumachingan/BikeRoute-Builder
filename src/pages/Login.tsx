import { FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabaseClient';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-lg p-6 sm:p-10">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-emerald-400">Iniciar sesión</h1>
            <p className="mt-2 sm:mt-3 text-slate-400 text-sm sm:text-lg">Accede a tu cuenta para administrar rutas</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label className="mb-2 sm:mb-3 block text-sm font-semibold text-slate-300">Email</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="tu@correo.com"
                required
              />
            </div>
            <div>
              <label className="mb-2 sm:mb-3 block text-sm font-semibold text-slate-300">Contraseña</label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" disabled={loading} size="lg" className="w-full">
              {loading ? 'Validando...' : 'Ingresar a tu cuenta'}
            </Button>
            {error && <p className="text-center text-sm sm:text-base text-red-400 font-medium">{error}</p>}
          </form>

          <div className="mt-6 sm:mt-8 border-t border-slate-800 pt-6">
            <p className="text-center text-sm sm:text-base text-slate-400">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-emerald-400 font-semibold hover:text-emerald-300 transition">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
