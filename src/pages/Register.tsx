import { FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabaseClient';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-lg p-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-emerald-400">Crear cuenta</h1>
            <p className="mt-3 text-slate-400 text-lg">Únete a BikeRoute Builder</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">Nombre</label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" placeholder="Juan" required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">Apellido</label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" placeholder="Pérez" required />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">Email</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="tu@correo.com" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">Contraseña</label>
              <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" required />
            </div>

            <Button type="submit" disabled={loading} size="lg" className="w-full">
              {loading ? 'Creando cuenta...' : 'Crear mi cuenta'}
            </Button>
            {error && <p className="text-center text-base text-red-400 font-medium">{error}</p>}
          </form>

          <div className="mt-8 border-t border-slate-800 pt-6">
            <p className="text-center text-slate-400">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-emerald-400 font-semibold hover:text-emerald-300 transition">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
