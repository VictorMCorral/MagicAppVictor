import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Sparkles } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mtg-gradient flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Card Container */}
        <div className="card-premium">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-mtg-gold-bright rounded-lg">
                <LogIn className="h-8 w-8 text-mtg-black" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-mtg-gold-bright font-nexus">
              Iniciar Sesión
            </h2>
            <p className="mt-3 text-sm text-mtg-text-light">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-mtg-gold-bright hover:text-mtg-gold-dark font-semibold transition-colors">
                Regístrate aquí
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-mtg-red/20 border border-mtg-red text-mtg-red-deep px-4 py-3 rounded-lg text-sm">
                ⚠️ {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="label-form">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="label-form">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>{loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
