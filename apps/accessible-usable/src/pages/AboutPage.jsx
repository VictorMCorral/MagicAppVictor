import React from 'react';
import { Badge, Card, Col, Container, Row } from 'react-bootstrap';

const professionalSummary = [
  'Estudiante de DAW con base sólida en desarrollo frontend y backend, centrado en productos web con impacto medible y mantenibilidad real.',
  'Experiencia en coordinación de equipos logísticos: planificación, liderazgo y adopción de procesos que escalan a entornos técnicos.',
  'Perfil creativo (Bellas Artes + diseño digital) que se traduce en interfaces claras, storytelling visual y obsesión por los detalles de UX.'
];

const metrics = [
  {
    value: '4+ años',
    label: 'Coordinando equipos',
    helper: 'Operaciones y logística'
  },
  {
    value: '3 stacks',
    label: 'Especialización web',
    helper: 'React · Node · PostgreSQL'
  },
  {
    value: '∞',
    label: 'Curiosidad creativa',
    helper: 'Arte, motion & UX'
  }
];

const experience = [
  {
    period: '2021 - 2025',
    role: 'Jefe de almacén',
    company: 'Distribuciones Sacra · Miguelturra',
    points: [
      'Coordinación de equipos de almacén y reparto.',
      'Control de stock y planificación de pedidos a distribuidores.'
    ]
  },
  {
    period: '2019 - 2021',
    role: 'Mozo de almacén',
    company: 'Distribuciones Sacra · Miguelturra',
    points: [
      'Preparación de cargas para reparto y manejo de carretilla elevadora.',
      'Gestión de pedidos y soporte operativo diario.'
    ]
  }
];

const education = [
  'DAW (Desarrollo de Aplicaciones Web) · Instituto Gregorio Prieto (actualidad).',
  'Máster en modelado y animación 3D Maya · CICE.',
  'Licenciatura en Bellas Artes · UCLM.'
];

const skills = ['React', 'Node.js', 'Bootstrap', 'Express', 'Prisma', 'PostgreSQL', 'Microsoft Excel', 'Adobe After Effects', 'Photoshop'];

const creativeHighlights = [
  {
    title: 'Diseño narrativo',
    detail: 'Uso recursos visuales para explicar decisiones técnicas a personas no técnicas.'
  },
  {
    title: 'Mentor encubierto',
    detail: 'Me gusta documentar procesos para que cualquiera pueda continuar el trabajo.'
  },
  {
    title: 'Flow centrado en la persona',
    detail: 'Pruebo cada pantalla en distintos contextos de accesibilidad y dispositivos.'
  }
];

const toolbelt = [
  {
    title: 'Stack web',
    chips: ['React 18', 'React Router', 'Node.js', 'Express', 'Prisma', 'PostgreSQL']
  },
  {
    title: 'Diseño digital',
    chips: ['Figma', 'Adobe CC', 'Motion graphics', 'Fotografía']
  },
  {
    title: 'Operaciones & métricas',
    chips: ['OKRs', 'Excel avanzado', 'Automatización', 'Gestión de equipos']
  }
];

const AboutPage = () => {
  return (
    <div className="page-container bg-mtg-gradient py-5">
      <Container style={{ maxWidth: '1150px' }}>
        <div className="about-hero card-mtg-premium p-4 p-md-5 mb-4">
          <div className="about-hero__layer about-hero__layer--one" />
          <div className="about-hero__layer about-hero__layer--two" />
          <Row className="align-items-center g-4 position-relative">
            <Col md={4} className="text-center">
              <div className="about-portrait">
                <img
                  src={`${process.env.PUBLIC_URL}/content/profile.jpg`}
                  alt="Foto de perfil de Víctor Corral"
                  onError={(event) => {
                    event.target.onerror = null;
                    event.target.src = `${process.env.PUBLIC_URL}/logo.jpg`;
                  }}
                />
                <div className="about-portrait__glow" />
              </div>
            </Col>
            <Col md={8}>
              <p className="text-uppercase text-mtg-muted mb-2 tracking-wide">Sobre mí</p>
              <h1 className="display-5 fw-bold text-mtg-gold mb-3">Víctor Manuel Corral Ruiz</h1>
              <p className="lead text-mtg-light mb-4">
                Desarrollador web en formación con ADN técnico-creativo. Combino lógica, procesos y narrativa visual para construir productos accesibles que resistan el paso del tiempo.
              </p>
              <div className="d-flex flex-wrap gap-3 align-items-center">
                <a className="btn btn-mtg-secondary" href={`${process.env.PUBLIC_URL}/content/victor_corral_cv.pdf`} target="_blank" rel="noreferrer">
                  Ver currículum completo (PDF)
                </a>
                <div className="d-flex flex-column gap-1 text-mtg-light">
                  <span className="about-tag">Disponible para colaboraciones remotas</span>
                  <span className="about-tag">Foco en accesibilidad y performance</span>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="g-3 mt-4">
            {metrics.map((metric) => (
              <Col key={metric.label} md={4}>
                <div className="about-metric card-mtg">
                  <p className="about-metric__value">{metric.value}</p>
                  <p className="about-metric__label">{metric.label}</p>
                  <span className="about-metric__helper">{metric.helper}</span>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        <Row className="g-4">
          <Col lg={8}>
            <Card className="card-mtg h-100">
              <Card.Body className="p-4 p-md-5">
                <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                  <h2 className="h4 text-mtg-gold mb-0">Perfil profesional</h2>
                  <Badge bg="dark" className="border border-warning-subtle text-uppercase">Full-stack en formación</Badge>
                </div>

                {professionalSummary.map((paragraph) => (
                  <p key={paragraph} className="text-mtg-light mb-3">{paragraph}</p>
                ))}

                <div className="about-divider my-4" />

                <h3 className="h6 text-mtg-gold mb-3">Experiencia destacada</h3>
                <div className="about-timeline">
                  {experience.map((item) => (
                    <div key={item.role} className="about-timeline__item">
                      <div className="about-timeline__bullet" />
                      <div className="about-timeline__content">
                        <div className="d-flex justify-content-between flex-wrap gap-2 mb-1">
                          <p className="mb-0 text-mtg-light fw-semibold">{item.role}</p>
                          <small className="text-mtg-muted">{item.period}</small>
                        </div>
                        <p className="text-mtg-muted small mb-2">{item.company}</p>
                        <ul className="text-mtg-light about-timeline__list">
                          {item.points.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="about-divider my-4" />

                <h3 className="h6 text-mtg-gold mb-3">Mi mezcla técnico-creativa</h3>
                <Row className="g-3">
                  {creativeHighlights.map((highlight) => (
                    <Col key={highlight.title} md={4}>
                      <div className="about-highlight card-mtg h-100">
                        <p className="fw-semibold text-mtg-gold mb-1">{highlight.title}</p>
                        <p className="text-mtg-light small mb-0">{highlight.detail}</p>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="card-mtg mb-4">
              <Card.Body>
                <h2 className="h5 text-mtg-gold mb-3">Formación</h2>
                <ul className="text-mtg-light mb-0 about-list">
                  {education.map((entry) => (
                    <li key={entry} className="mb-2">{entry}</li>
                  ))}
                </ul>
              </Card.Body>
            </Card>

            <Card className="card-mtg mb-4">
              <Card.Body>
                <h2 className="h5 text-mtg-gold mb-3">Competencias rápidas</h2>
                <div className="d-flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="about-chip">{skill}</span>
                  ))}
                </div>
              </Card.Body>
            </Card>

            <Card className="card-mtg">
              <Card.Body>
                <h2 className="h5 text-mtg-gold mb-3">Kit de herramientas</h2>
                <div className="d-flex flex-column gap-3">
                  {toolbelt.map((section) => (
                    <div key={section.title}>
                      <p className="text-mtg-light fw-semibold mb-2">{section.title}</p>
                      <div className="d-flex flex-wrap gap-2">
                        {section.chips.map((chip) => (
                          <span key={chip} className="about-chip about-chip--ghost">{chip}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutPage;
