import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';

const professionalSummary = [
  'Estudiante de DAW con base sólida en desarrollo frontend y backend, actualmente enfocado en productos web útiles y mantenibles.',
  'Experiencia previa en coordinación de equipos y gestión operativa, aportando organización, responsabilidad y mejora continua a entornos técnicos.',
  'Perfil creativo con formación en Bellas Artes y herramientas de diseño digital, aplicado a interfaces claras y experiencias de usuario consistentes.'
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

const AboutPage = () => {
  return (
    <div className="page-container bg-mtg-gradient py-5">
      <Container style={{ maxWidth: '1100px' }}>
        <Card className="card-mtg-premium shadow-lg">
          <Card.Body className="p-4 p-md-5">
            <Row className="g-4 align-items-center mb-4">
              <Col md={4} className="text-center">
                <img
                  src={`${process.env.PUBLIC_URL}/content/profile.jpg`}
                  alt="Foto de perfil de Víctor Corral"
                  className="img-fluid rounded-4 border border-warning shadow"
                  style={{ maxWidth: '280px' }}
                  onError={(event) => {
                    event.target.onerror = null;
                    event.target.src = `${process.env.PUBLIC_URL}/logo.jpg`;
                  }}
                />
              </Col>
              <Col md={8}>
                <p className="text-uppercase text-mtg-muted mb-1" style={{ letterSpacing: '0.2em' }}>Sobre mi</p>
                <h1 className="display-6 fw-bold text-mtg-gold mb-2">Víctor Manuel Corral Ruiz</h1>
                <p className="text-mtg-light mb-2">Desarrollador web en formación · Perfil técnico-creativo</p>
                <a className="btn btn-mtg-secondary" href={`${process.env.PUBLIC_URL}/content/victor_corral_cv.pdf`} target="_blank" rel="noreferrer">
                  Ver currículum completo (PDF)
                </a>
              </Col>
            </Row>

            <Row className="g-4">
              <Col lg={7}>
                <Card className="card-mtg h-100">
                  <Card.Body>
                    <h2 className="h5 text-mtg-gold mb-3">Perfil profesional</h2>
                    {professionalSummary.map((paragraph) => (
                      <p key={paragraph} className="text-mtg-light mb-3">{paragraph}</p>
                    ))}

                    <h3 className="h6 text-mtg-gold mt-4 mb-3">Experiencia destacada</h3>
                    {experience.map((item) => (
                      <div key={item.role} className="mb-3">
                        <p className="mb-1 text-mtg-light fw-semibold">{item.role} · {item.company}</p>
                        <small className="text-mtg-muted d-block mb-2">{item.period}</small>
                        <ul className="text-mtg-light mb-0">
                          {item.points.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={5}>
                <Card className="card-mtg mb-4">
                  <Card.Body>
                    <h2 className="h5 text-mtg-gold mb-3">Formación</h2>
                    <ul className="text-mtg-light mb-0">
                      {education.map((entry) => (
                        <li key={entry} className="mb-2">{entry}</li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>

                <Card className="card-mtg">
                  <Card.Body>
                    <h2 className="h5 text-mtg-gold mb-3">Competencias</h2>
                    <div className="d-flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span key={skill} className="badge text-bg-dark border border-warning-subtle">{skill}</span>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default AboutPage;
