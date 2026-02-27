import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Search, Upload, Download, Camera, TrendingUp, Sparkles, Clock3 } from 'lucide-react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { resolveFlowPath } from '../utils/versionRouting';
import { isNoUsableFlow } from '../utils/flowMode';
import roadmap from '../config/roadmap.json';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const toFlowPath = (path) => resolveFlowPath(path, location.pathname);
  const isNoUsable = isNoUsableFlow(location.pathname);

  return (
    <div className="page-container bg-mtg-gradient">
      <Container>
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
                src={`${process.env.PUBLIC_URL}/logo.jpg`}
                alt="MTG Nexus" 
                className="w-100 h-100"
                style={{objectFit: 'cover'}}
                onError={(e) => { e.target.onerror = null; e.target.src = `${process.env.PUBLIC_URL}/mtg-nexus-logo.svg`; }}
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
                <Button as={Link} to={toFlowPath('/dashboard')} className="btn-mtg-primary px-4 py-2 d-flex align-items-center gap-2">
                  <BookOpen size={20} />
                  Mis Mazos
                </Button>
                <Button as={Link} to={toFlowPath('/inventory')} className="btn-mtg-secondary px-4 py-2 d-flex align-items-center gap-2">
                  <TrendingUp size={20} />
                  Mi Inventario
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to={toFlowPath('/register')} className="btn-mtg-primary px-4 py-2 d-flex align-items-center gap-2">
                  <Sparkles size={20} />
                  Comenzar Gratis
                </Button>
                <Button as={Link} to={toFlowPath('/login')} className="btn-mtg-secondary px-4 py-2">
                  Iniciar Sesión
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Features Ya implantadas */}
        <Row className="justify-content-center mt-5">
          <Col lg={8}>
            <h2 className="text-mtg-gold fw-bold text-center mb-4">✨ {roadmap.implemented.title}</h2>
            <div className="d-flex flex-column gap-3">
              {roadmap.implemented.features.map((feature, index) => {
                const icons = [Search, BookOpen, Upload, Download, Camera, TrendingUp, TrendingUp];
                const FeatureIcon = icons[index] || Sparkles;
                return (
                  <div
                    className={`d-flex align-items-start gap-3 ${isNoUsable ? 'no-usable-feature-button' : ''}`}
                    key={feature}
                  >
                    <FeatureIcon size={24} className="text-mtg-gold flex-shrink-0 mt-1" />
                    <div>
                      <h5 className="text-mtg-light fw-bold mb-0">{feature}</h5>
                    </div>
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>

        {/* Features v3.0 */}
        <Row className="justify-content-center mt-5">
          <Col lg={8}>
            <Card className="card-mtg">
              <Card.Body>
                <h2 className="text-mtg-gold fw-bold text-center mb-4">⏳ {roadmap.upcoming.title}</h2>
                <div className="d-flex flex-column gap-3">
                  {roadmap.upcoming.features.map((feature) => (
                    <div
                      className={`d-flex align-items-start gap-3 ${isNoUsable ? 'no-usable-feature-button' : ''}`}
                      key={feature}
                    >
                      <Clock3 size={24} className="text-mtg-gold flex-shrink-0 mt-1" />
                      <div>
                        <h5 className="text-mtg-light fw-bold mb-0">{feature}</h5>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

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
