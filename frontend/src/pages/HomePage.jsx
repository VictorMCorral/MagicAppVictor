import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Search, Upload, Download, Camera, TrendingUp, Sparkles } from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-mtg-gradient flex flex-col">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-24 flex-1">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-mtg-gold-bright rounded-2xl flex items-center justify-center shadow-2xl mana-pulse overflow-hidden border-2 border-mtg-gold-bright">
              <img 
                src="/logo.jpg" 
                alt="MTG Nexus" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-7xl font-bold text-mtg-gold-bright mb-4 font-nexus drop-shadow-lg">
            MTG NEXUS HUB
          </h1>
          <p className="text-2xl text-mtg-text-light mb-4 font-magic">
            Tu Plataforma Integral para Magic: The Gathering
          </p>
          <p className="text-lg text-mtg-text-muted mb-10 max-w-2xl mx-auto">
            Gestiona mazos, analiza tu colección y escanea cartas con inteligencia artificial
          </p>
          <div className="flex justify-center space-x-4 flex-wrap gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
                  <BookOpen className="w-5 h-5 inline mr-2" />
                  Mis Mazos
                </Link>
                <Link to="/inventory" className="btn-secondary text-lg px-8 py-3">
                  <TrendingUp className="w-5 h-5 inline mr-2" />
                  Mi Inventario
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg px-8 py-3">
                  <Sparkles className="w-5 h-5 inline mr-2" />
                  Comenzar Gratis
                </Link>
                <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features v1.0 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-mtg-gold-bright text-center mb-12 font-nexus">
            Características v1.0 - MVP Core
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card text-center hover:border-mtg-gold-bright">
              <Search className="w-12 h-12 text-mtg-gold-bright mx-auto mb-4" />
              <h3 className="text-xl font-bold text-mtg-text-light mb-2">Buscador Scryfall</h3>
              <p className="text-mtg-text-muted">
                Busca entre miles de cartas con la potente API de Scryfall
              </p>
            </div>

            <div className="card text-center hover:border-mtg-gold-bright">
              <BookOpen className="w-12 h-12 text-mtg-gold-bright mx-auto mb-4" />
              <h3 className="text-xl font-bold text-mtg-text-light mb-2">Creador de Mazos</h3>
              <p className="text-mtg-text-muted">
                Crea y gestiona tus mazos con estadísticas en tiempo real
              </p>
            </div>

            <div className="card text-center hover:border-mtg-gold-bright">
              <Upload className="w-12 h-12 text-mtg-gold-bright mx-auto mb-4" />
              <h3 className="text-xl font-bold text-mtg-text-light mb-2">Importar Mazos</h3>
              <p className="text-mtg-text-muted">
                Importa listas de mazos desde archivos .txt fácilmente
              </p>
            </div>

            <div className="card text-center hover:border-mtg-gold-bright">
              <Download className="w-12 h-12 text-mtg-gold-bright mx-auto mb-4" />
              <h3 className="text-xl font-bold text-mtg-text-light mb-2">Exportar Mazos</h3>
              <p className="text-mtg-text-muted">
                Exporta tus mazos en formato estándar para compartir
              </p>
            </div>
          </div>
        </div>

        {/* Features v2.0 - Coming Soon */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-mtg-gold-bright text-center mb-12 font-nexus">
            🚀 Próximas Características v2.0 - Inventory & Scan
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card-premium text-center border-2 border-mtg-gold-bright">
              <Camera className="w-12 h-12 text-mtg-gold-bright mx-auto mb-4" />
              <h3 className="text-xl font-bold text-mtg-gold-bright mb-2">Escaneo OCR</h3>
              <p className="text-mtg-text-light">
                Identifica cartas automáticamente usando la cámara de tu dispositivo con IA
              </p>
            </div>

            <div className="card-premium text-center border-2 border-mtg-gold-bright">
              <TrendingUp className="w-12 h-12 text-mtg-gold-bright mx-auto mb-4" />
              <h3 className="text-xl font-bold text-mtg-gold-bright mb-2">Gestión de Colecciones</h3>
              <p className="text-mtg-text-light">
                Organiza tu colección personal y obtén el valor total estimado
              </p>
            </div>

            <div className="card-premium text-center border-2 border-mtg-gold-bright">
              <TrendingUp className="w-12 h-12 text-mtg-gold-bright mx-auto mb-4" />
              <h3 className="text-xl font-bold text-mtg-gold-bright mb-2">Sincronización Precios</h3>
              <p className="text-mtg-text-light">
                Precios en tiempo real de Cardmarket integrados en tu inventario
              </p>
            </div>
          </div>
        </div>

        {/* Version Info */}
        <div className="mt-16 text-center border-t border-mtg-gold-bright/30 pt-8">
          <p className="text-mtg-gold-bright text-lg font-bold mb-2">
            Versión 2.0.0 - Inventory & Scan Edition
          </p>
          <p className="text-mtg-text-muted">
            Construído con React.js, Node.js, PostgreSQL y la API de Scryfall
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
