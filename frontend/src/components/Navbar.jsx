import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Search, BookOpen, LogIn, LogOut, User, Wand2 } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-mtg-bg-dark border-b-2 border-mtg-gold-bright shadow-2xl">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo y Título */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-mtg-gold-bright rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <img 
                src="/mtg-nexus-logo.svg" 
                alt="MTG Nexus" 
                className="w-10 h-10"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-mtg-gold-bright font-nexus">MTG NEXUS</span>
              <span className="text-xs text-mtg-gold-dark font-magic">Hub v2.0</span>
            </div>
          </Link>

          {/* Links de navegación */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-1 text-mtg-text-light hover:text-mtg-gold-bright transition-colors duration-200 group"
            >
              <Home className="w-5 h-5 group-hover:text-mtg-gold-dark" />
              <span className="text-sm font-medium">Inicio</span>
            </Link>

            <Link
              to="/cards"
              className="flex items-center space-x-1 text-mtg-text-light hover:text-mtg-gold-bright transition-colors duration-200 group"
            >
              <Search className="w-5 h-5 group-hover:text-mtg-gold-dark" />
              <span className="text-sm font-medium">Buscar</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 text-mtg-text-light hover:text-mtg-gold-bright transition-colors duration-200 group"
                >
                  <BookOpen className="w-5 h-5 group-hover:text-mtg-gold-dark" />
                  <span className="text-sm font-medium">Mazos</span>
                </Link>

                <Link
                  to="/inventory"
                  className="flex items-center space-x-1 text-mtg-text-light hover:text-mtg-gold-bright transition-colors duration-200 group"
                >
                  <Wand2 className="w-5 h-5 group-hover:text-mtg-gold-dark" />
                  <span className="text-sm font-medium">Inventario</span>
                </Link>

                <div className="flex items-center space-x-4 border-l border-mtg-gold pl-6">
                  <div className="flex items-center space-x-2 text-mtg-text-light">
                    <User className="w-5 h-5 text-mtg-gold-bright" />
                    <span className="text-sm font-medium">{user?.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-mtg-red hover:text-mtg-red-deep transition-colors duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Salir</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-mtg-gold-bright text-mtg-black font-bold rounded-lg hover:bg-mtg-gold-dark transition-all duration-200 hover:shadow-lg text-sm"
              >
                <LogIn className="w-4 h-4 inline mr-1" />
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
