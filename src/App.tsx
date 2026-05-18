import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Navbar } from './components/layout/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import RouteBuilder from './pages/RouteBuilder';
import RouteDetail from './pages/RouteDetail';
import Login from './pages/Login';
import Register from './pages/Register';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">Cargando...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/builder"
            element={
              <PrivateRoute>
                <RouteBuilder />
              </PrivateRoute>
            }
          />
          <Route
            path="/route/:id"
            element={
              <PrivateRoute>
                <RouteDetail />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
