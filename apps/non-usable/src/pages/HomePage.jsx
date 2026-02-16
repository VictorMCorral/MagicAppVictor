import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Search, Upload, Download, Camera, TrendingUp, Sparkles } from 'lucide-react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  
  // Estilo global forzado para no-responsividad en esta página
  React.useEffect(() => {
    document.body.style.minWidth = '1400px';
    document.body.style.overflowX = 'scroll';
    return () => {
      document.body.style.minWidth = '';
      document.body.style.overflowX = '';
    };
  }, []);

  return (
    <div className="page-container bg-mtg-gradient" style={{ width: '1400px', margin: '0 auto' }}>
      <Container fluid className="p-0">
        {/* Hero Section */}
        <div className="text-center py-5">
          <div className="d-flex justify-content-center mb-4">
            <div 
              className="rounded-3 overflow-hidden mana-pulse"
              style={{
                width: '96px', 
                height: '96px',
                border: '2px solid var(--mtg-gold-bright)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
              }}
            >
              <img 
                src="/logo.jpg" 
                alt="MTG Nexus" 
                className="w-100 h-100"
                style={{objectFit: 'cover'}}
              />
            </div>
          </div>
          <h1 className="display-3 fw-bold text-mtg-gold mb-3">MTG NEXUS HUB</h1>
          <p className="fs-4 text-mtg-light mb-2">Tu Plataforma Integral para Magic: The Gathering</p>
          <p className="text-mtg-secondary mb-4 mx-auto" style={{maxWidth: '600px', lineHeight: '1.6'}}>
            Gestiona mazos, analiza tu colección y escanea cartas con inteligencia artificial
          </p>
          
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            {isAuthenticated ? (
              <>
                <Button as={Link} to="/dashboard" className="btn-mtg-primary px-4 py-2 d-flex align-items-center gap-2">
                  <BookOpen size={20} />
                  Mis Mazos
                </Button>
                <Button as={Link} to="/inventory" className="btn-mtg-secondary px-4 py-2 d-flex align-items-center gap-2">
                  <TrendingUp size={20} />
                  Mi Inventario
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/register" className="btn-mtg-primary px-4 py-2 d-flex align-items-center gap-2">
                  <Sparkles size={20} />
                  Comenzar Gratis
                </Button>
                <Button as={Link} to="/login" className="btn-mtg-secondary px-4 py-2">
                  Iniciar Sesión
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Features v1.0 */}
        <div style={{ width: '100%', marginTop: '3rem' }}>
          <div style={{ width: '800px', margin: '0 auto' }}> 
            <h2 className="text-mtg-gold fw-bold text-center mb-4">✨ Características v1.0 - MVP Core</h2>
            <div className="d-flex flex-column gap-3">
              <button className="btn btn-mtg-primary d-flex align-items-center gap-3 p-3 w-100 text-start" style={{ cursor: 'default' }}>
                <Search size={24} className="text-mtg-gold flex-shrink-0 mt-1" />
                <div>
                  <h5 className="text-white fw-bold mb-1">Buscador Scryfall</h5>
                  <p className="text-white-50 mb-0">Busca entre miles de cartas con la potente API de Scryfall</p>
                </div>
              </button>
              <button className="btn btn-mtg-primary d-flex align-items-center gap-3 p-3 w-100 text-start" style={{ cursor: 'default' }}>
                <BookOpen size={24} className="text-mtg-gold flex-shrink-0 mt-1" />
                <div>
                  <h5 className="text-white fw-bold mb-1">Creador de Mazos</h5>
                  <p className="text-white-50 mb-0">Crea y gestiona tus mazos con estadísticas en tiempo real</p>
                </div>
              </button>
              <button className="btn btn-mtg-primary d-flex align-items-center gap-3 p-3 w-100 text-start" style={{ cursor: 'default' }}>
                <Upload size={24} className="text-mtg-gold flex-shrink-0 mt-1" />
                <div>
                  <h5 className="text-white fw-bold mb-1">Importar Mazos</h5>
                  <p className="text-white-50 mb-0">Importa listas de mazos desde archivos .txt fácilmente</p>
                </div>
              </button>
              <button className="btn btn-mtg-primary d-flex align-items-center gap-3 p-3 w-100 text-start" style={{ cursor: 'default' }}>
                <Download size={24} className="text-mtg-gold flex-shrink-0 mt-1" />
                <div>
                  <h5 className="text-white fw-bold mb-1">Exportar Mazos</h5>
                  <p className="text-white-50 mb-0">Exporta tus mazos en formato estándar para compartir</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Features v2.0 */}
        <div style={{ width: '100%', marginTop: '3rem' }}>
          <div style={{ width: '800px', margin: '0 auto' }}>
            <h2 className="text-mtg-gold fw-bold text-center mb-4">🚀 Próximas Características v2.0</h2>
            <div className="d-flex flex-column gap-3">
              <button className="btn btn-mtg-secondary d-flex align-items-center gap-3 p-3 w-100 text-start" style={{ cursor: 'pointer' }}>
                <Camera size={24} className="text-mtg-gold flex-shrink-0 mt-1" />
                <div>
                  <h5 className="text-white fw-bold mb-1">Escaneo OCR</h5>
                  <p className="text-white-50 mb-0">Identifica cartas automáticamente usando la cámara con IA</p>
                </div>
              </button>
              <button className="btn btn-mtg-secondary d-flex align-items-center gap-3 p-3 w-100 text-start" style={{ cursor: 'pointer' }}>
                <TrendingUp size={24} className="text-mtg-gold flex-shrink-0 mt-1" />
                <div>
                  <h5 className="text-white fw-bold mb-1">Gestión de Colecciones</h5>
                  <p className="text-white-50 mb-0">Organiza tu colección y obtén el valor total estimado</p>
                </div>
              </button>
              <button className="btn btn-mtg-secondary d-flex align-items-center gap-3 p-3 w-100 text-start" style={{ cursor: 'pointer' }}>
                <TrendingUp size={24} className="text-mtg-gold flex-shrink-0 mt-1" />
                <div>
                  <h5 className="text-white fw-bold mb-1">Sincronización Precios</h5>
                  <p className="text-white-50 mb-0">Precios en tiempo real de Cardmarket integrados</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Version Info */}
        <div className="text-center mt-5 pt-4 border-top border-mtg-gold-subtle">
          <p className="text-mtg-gold fw-bold mb-1">Versión 2.0.0 - Inventory & Scan Edition</p>
          <p className="text-mtg-muted small">Construído con React.js, Node.js, PostgreSQL y la API de Scryfall</p>
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
