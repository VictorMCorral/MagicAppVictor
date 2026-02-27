import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Film, Play } from 'lucide-react';
import { visualStudiesVideos, visualStudySections } from '../data/visualStudies';

const VIDEO_BASE = `${process.env.PUBLIC_URL}/videos/visual-studies`;

const heroVideo = visualStudiesVideos.find((entry) => entry.number === 1);

const VISUAL_SECTIONS = visualStudySections.map((section) => ({
  ...section,
  videos: visualStudiesVideos.filter((video) => video.category === section.key)
}));

const VisualStudiesPage = () => {
  return (
    <div className="page-container bg-mtg-gradient py-5">
      <Container>
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-mtg-gold-subtle mb-3" style={{ width: '72px', height: '72px' }}>
            <Film size={32} className="text-mtg-gold" />
          </div>
          <p className="text-uppercase text-mtg-muted mb-1" style={{ letterSpacing: '0.3em' }}>Estudios Visuales</p>
          <h1 className="display-4 fw-bold text-mtg-gold">Biblioteca Multimedia</h1>
          <p className="text-mtg-light lead mx-auto" style={{ maxWidth: '720px' }}>
            Explora la evolución visual del proyecto: un demo destacado y 30 clips temáticos organizados por responsabilidad, accesibilidad y usabilidad.
          </p>
        </div>

        {/* Demo principal */}
        <Card className="card-mtg-premium shadow-lg mb-5">
          <Row className="g-0 align-items-center">
            <Col lg={6}>
              <div className="ratio ratio-16x9 rounded-start overflow-hidden">
                <video controls preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                  <source src={heroVideo ? `${VIDEO_BASE}/${heroVideo.filename}` : ''} />
                  Tu navegador no soporta video HTML5.
                </video>
              </div>
            </Col>
            <Col lg={6} className="p-4">
              <p className="text-mtg-muted mb-1">Demo principal</p>
              <h2 className="h3 fw-bold text-mtg-gold">{heroVideo?.title ?? 'Visión General'}</h2>
              <p className="text-mtg-light mb-0">{heroVideo?.description ?? 'Resumen completo del estado actual de la aplicación.'}</p>
            </Col>
          </Row>
        </Card>

        {VISUAL_SECTIONS.map((section) => (
          <section key={section.key} className="mb-5">
            <div className="d-flex align-items-center gap-3 mb-3">
              <Play size={20} className="text-mtg-gold" />
              <div>
                <h3 className="h4 text-mtg-gold fw-bold mb-0">{section.title}</h3>
                <p className="text-mtg-muted small mb-0">{section.summary}</p>
              </div>
            </div>
            <Row className="g-4">
              {section.videos.map((video) => (
                <Col key={video.number} xs={12} md={6} lg={4}>
                  <Card className="h-100 card-mtg shadow-sm">
                    <div className="ratio ratio-16x9 rounded-top overflow-hidden">
                      <video controls preload="none" style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                        <source src={`${VIDEO_BASE}/${video.filename}`} />
                        Tu navegador no soporta video HTML5.
                      </video>
                    </div>
                    <Card.Body>
                      <h4 className="h6 text-mtg-light mb-1">{video.title}</h4>
                      <p className="text-mtg-muted small mb-0">{video.description}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </section>
        ))}
      </Container>
    </div>
  );
};

export default VisualStudiesPage;
