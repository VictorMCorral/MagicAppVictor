import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Sparkles } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register(formData.email, formData.username, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar usuario');
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
                <UserPlus className="h-8 w-8 text-mtg-black" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-mtg-gold-bright font-nexus">
              Crear Cuenta
            </h2>
            <p className="mt-3 text-sm text-mtg-text-light">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-mtg-gold-bright hover:text-mtg-gold-dark font-semibold transition-colors">
                Inicia sesión aquí
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
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="username" className="label-form">
                  Nombre de Usuario
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="usuario123"
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="label-form">
                  Confirmar Contraseña
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
              <span>{loading ? 'Creando cuenta...' : 'Registrarse'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
