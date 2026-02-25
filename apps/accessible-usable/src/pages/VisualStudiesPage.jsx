import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Film, Play } from 'lucide-react';

const VIDEO_BASE = `${process.env.PUBLIC_URL}/videos/visual-studies`;

const demoVideo = `${VIDEO_BASE}/demo.mp4`;

const SECTION_BLUEPRINT = [
  { title: 'Sección 1: Responsabilidad', key: 'responsabilidad' },
  { title: 'Sección 2: Usabilidad', key: 'usabilidad' },
  { title: 'Sección 3: Accesibilidad', key: 'accesibilidad' }
];

const buildSections = () =>
  SECTION_BLUEPRINT.map((section) => ({
    ...section,
    videos: Array.from({ length: 10 }, (_, idx) => {
      const count = String(idx + 1).padStart(2, '0');
      return {
        id: `${section.key}-${count}`,
        title: `${section.title} · Clip ${idx + 1}`,
        src: `${VIDEO_BASE}/${section.key}-${count}.mp4`
      };
    })
  }));

const VISUAL_SECTIONS = buildSections();

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
            Explora la evolución visual del proyecto: un demo destacado y 30 clips temáticos organizados por responsabilidad, usabilidad y accesibilidad.
          </p>
        </div>

        {/* Demo principal */}
        <Card className="card-mtg-premium shadow-lg mb-5">
          <Row className="g-0 align-items-center">
            <Col lg={6}>
              <div className="ratio ratio-16x9 rounded-start overflow-hidden">
                <video controls poster={`${VIDEO_BASE}/demo-poster.jpg`} style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                  <source src={demoVideo} type="video/mp4" />
                  Tu navegador no soporta video HTML5.
                </video>
              </div>
            </Col>
            <Col lg={6} className="p-4">
              <p className="text-mtg-muted mb-1">Demo principal</p>
              <h2 className="h3 fw-bold text-mtg-gold">Visión General 4K</h2>
              <p className="text-mtg-light mb-0">
                Este video resume la narrativa completa: valores de marca, experiencia inmersiva y los aprendizajes clave de los distintos estudios.
              </p>
            </Col>
          </Row>
        </Card>

        {VISUAL_SECTIONS.map((section) => (
          <section key={section.key} className="mb-5">
            <div className="d-flex align-items-center gap-3 mb-3">
              <Play size={20} className="text-mtg-gold" />
              <div>
                <h3 className="h4 text-mtg-gold fw-bold mb-0">{section.title}</h3>
                <p className="text-mtg-muted small mb-0">10 clips curados para este eje temático</p>
              </div>
            </div>
            <Row className="g-4">
              {section.videos.map((video) => (
                <Col key={video.id} xs={12} md={6} lg={4}>
                  <Card className="h-100 card-mtg shadow-sm">
                    <div className="ratio ratio-16x9 rounded-top overflow-hidden">
                      <video controls preload="none" poster={`${VIDEO_BASE}/${video.id}.jpg`} style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                        <source src={video.src} type="video/mp4" />
                        Tu navegador no soporta video HTML5.
                      </video>
                    </div>
                    <Card.Body>
                      <h4 className="h6 text-mtg-light mb-1">{video.title}</h4>
                      <p className="text-mtg-muted small mb-0">Disponible en /public/videos/visual-studies</p>
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
