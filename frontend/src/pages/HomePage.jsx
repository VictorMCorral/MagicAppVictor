import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Search, Upload, Download } from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            MTG Nexus Hub
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            Tu plataforma integral para Magic: The Gathering
          </p>
          <div className="flex justify-center space-x-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
                Ir a Mis Mazos
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg px-8 py-3">
                  Comenzar Gratis
                </Link>
                <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <div className="card text-center">
            <Search className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Buscador Scryfall</h3>
            <p className="text-gray-600">
              Busca entre miles de cartas con la potente API de Scryfall
            </p>
          </div>

          <div className="card text-center">
            <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Creador de Mazos</h3>
            <p className="text-gray-600">
              Crea y gestiona tus mazos con estadísticas en tiempo real
            </p>
          </div>

          <div className="card text-center">
            <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Importar Mazos</h3>
            <p className="text-gray-600">
              Importa listas de mazos desde archivos .txt fácilmente
            </p>
          </div>

          <div className="card text-center">
            <Download className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Exportar Mazos</h3>
            <p className="text-gray-600">
              Exporta tus mazos en formato estándar para compartir
            </p>
          </div>
        </div>

        {/* Version Info */}
        <div className="mt-20 text-center">
          <p className="text-gray-500 text-sm">
            Version 1.0.0 - MVP Core
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Próximamente: Escaneo OCR, Gestión de Colecciones y Tablero Virtual
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
