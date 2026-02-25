import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner } from 'react-bootstrap';

const ABOUT_TXT_URL = `${process.env.PUBLIC_URL}/content/about-us.txt`;

const AboutPage = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      try {
        const response = await fetch(ABOUT_TXT_URL, { cache: 'no-cache' });
        if (!response.ok) {
          throw new Error('No se pudo cargar la descripción.');
        }
        const text = await response.text();
        if (isMounted) {
          setContent(text.trim());
        }
      } catch (err) {
        if (isMounted) {
          setError('No pudimos cargar la descripción. Revisa que el archivo exista en /public/content/about-us.txt');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="page-container bg-mtg-gradient py-5">
      <Container style={{ maxWidth: '900px' }}>
        <Card className="card-mtg-premium shadow-lg">
          <Card.Body className="p-5">
            <div className="mb-4 text-center">
              <p className="text-uppercase text-mtg-muted mb-1" style={{ letterSpacing: '0.25em' }}>About Us</p>
              <h1 className="display-5 fw-bold text-mtg-gold">Nuestra Historia</h1>
            </div>

            {loading && (
              <div className="text-center py-4">
                <Spinner animation="border" style={{ color: 'var(--mtg-gold-bright)' }} />
                <p className="mt-3 text-mtg-light">Cargando contenido...</p>
              </div>
            )}

            {!loading && error && (
              <div className="alert alert-mtg-danger" role="alert">
                {error}
              </div>
            )}

            {!loading && !error && (
              <article className="lead" style={{ color: 'var(--mtg-text-light)', whiteSpace: 'pre-wrap' }}>
                {content || 'Agrega tu historia en /public/content/about-us.txt'}
              </article>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default AboutPage;
