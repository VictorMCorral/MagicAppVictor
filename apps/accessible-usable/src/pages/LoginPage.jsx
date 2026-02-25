import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Sparkles } from 'lucide-react';
import { Container, Row, Col, Card, Form, Button, Alert, ButtonGroup } from 'react-bootstrap';

const FIELD_LABELS = {
  email: 'Email',
  password: 'Contraseña'
};

const KNOWN_LOGIN_MESSAGES = {
  'Error al iniciar sesión': 'El servidor encontró un error al intentar iniciar tu sesión. Intenta nuevamente en unos minutos.'
};

const ACCESSIBILITY_OPTIONS = [
  {
    id: 'accessible',
    label: 'Accesible y Usable',
    helper: 'La experiencia se siente clara y usable para todos los jugadores.'
  },
  {
    id: 'not-accessible',
    label: 'No Accesible',
    helper: 'La presentación no cumple con criterios básicos de acceso para personas con discapacidad.'
  },
  {
    id: 'not-usable',
    label: 'No Usable',
    helper: 'El flujo actual no permite completar las tareas básicas de acceso al sistema.'
  }
];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedbackMessages, setFeedbackMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAccessibility, setSelectedAccessibility] = useState(
    ACCESSIBILITY_OPTIONS[0].id
  );
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const getDetailedLoginFeedback = (err) => {
    const responseData = err.response?.data;
    const statusCode = err.response?.status;
    const messages = [];

    if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
      responseData.errors.forEach((errorItem) => {
        if (!errorItem?.msg) return;
        let fieldLabel = FIELD_LABELS[errorItem.path] || errorItem.path;

        if (!fieldLabel) {
          if (/email/i.test(errorItem.msg)) fieldLabel = 'Email';
          if (/contraseña|password/i.test(errorItem.msg)) fieldLabel = 'Contraseña';
        }

        if (fieldLabel) {
          messages.push(`${fieldLabel}: ${errorItem.msg}`);
          return;
        }
        messages.push(errorItem.msg);
      });
    }

    if (responseData?.message) {
      messages.push(KNOWN_LOGIN_MESSAGES[responseData.message] || responseData.message);
    }

    if (!messages.length && !err.response) {
      messages.push('No fue posible conectar con el servidor. Verifica tu conexión a internet e inténtalo de nuevo.');
    }

    if (!messages.length && statusCode >= 500) {
      messages.push('El servidor encontró un error al intentar iniciar tu sesión. Intenta nuevamente en unos minutos.');
    }

    if (!messages.length) {
      messages.push('No se pudo completar el inicio de sesión. Revisa los datos ingresados e inténtalo nuevamente.');
    }

    return [...new Set(messages)];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedbackMessages([]);
    setLoading(true);

    try {
      await login(email, password);
      // authService/login ya persiste token y usuario en localStorage via AuthContext
      
      let targetPort = '3000';
      if (selectedAccessibility === 'not-accessible') targetPort = '3001';
      if (selectedAccessibility === 'not-usable') targetPort = '3002';

      if (window.location.port === targetPort) {
        navigate('/dashboard');
      } else {
        // Redirigir con token en URL para mantener sesión
        // Obtenemos los datos directos del localStorage que acaba de ser actualizado por authService
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
           const userStr = encodeURIComponent(storedUser);
           window.location.href = `http://localhost:${targetPort}/dashboard?token=${storedToken}&user=${userStr}`;
        } else {
           // Fallback si algo falló con localStorage
           window.location.href = `http://localhost:${targetPort}/dashboard`;
        }
      }
    } catch (err) {
      setFeedbackMessages(getDetailedLoginFeedback(err));
    } finally {
      setLoading(false);
    }
  };

  const selectedOption =
    ACCESSIBILITY_OPTIONS.find((option) => option.id === selectedAccessibility) ||
    ACCESSIBILITY_OPTIONS[0];

  return (
    <div className="page-container bg-mtg-gradient d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="card-mtg-premium p-4">
              <Card.Body>
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="d-inline-flex p-3 rounded mb-3" style={{background: 'var(--mtg-gold-bright)'}}>
                    <LogIn size={32} color="#150B00" />
                  </div>
                  <h2 className="text-mtg-gold fw-bold mb-2">Iniciar Sesión</h2>
                  <p className="text-mtg-muted mb-0">
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" className="text-mtg-gold text-decoration-none fw-semibold">
                      Regístrate aquí
                    </Link>
                  </p>
                </div>

                {/* Error Alert */}
                {feedbackMessages.length > 0 && (
                  <Alert variant="danger" className="alert-mtg-danger">
                    <p className="fw-semibold mb-2">Se detectaron errores al iniciar sesión</p>
                    <ul className="mb-0 ps-3 small" style={{lineHeight: '1.6'}}>
                      {feedbackMessages.map((message, index) => (
                        <li key={`${message}-${index}`}>{message}</li>
                      ))}
                    </ul>
                  </Alert>
                )}

                {/* Accessibility Options */}
                <div className="mb-4">
                  <p className="small fw-semibold text-mtg-light mb-3">Estado de accesibilidad</p>
                  <ButtonGroup className="d-flex flex-wrap gap-2 mb-2">
                    {ACCESSIBILITY_OPTIONS.map((option) => {
                      const isSelected = selectedAccessibility === option.id;
                      return (
                        <Button
                          key={option.id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => setSelectedAccessibility(option.id)}
                          variant={isSelected ? 'warning' : 'outline-secondary'}
                          size="sm"
                          className={`rounded-pill ${isSelected ? 'text-dark fw-semibold' : 'text-mtg-light border-mtg-gold-subtle'}`}
                        >
                          {option.label}
                        </Button>
                      );
                    })}
                  </ButtonGroup>
                  <p className="text-mtg-muted small mb-0" aria-live="polite">
                    {selectedOption.helper}
                  </p>
                </div>

                {/* Login Form */}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-mtg">Email o usuario</Form.Label>
                    <Form.Control
                      type="text"
                      id="email"
                      name="email"
                      autoComplete="username"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control-mtg"
                      placeholder="tu@email.com o admin"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="form-label-mtg">Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      id="password"
                      name="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control-mtg"
                      placeholder="••••••••"
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="btn-mtg-primary w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                  >
                    <Sparkles size={20} />
                    <span>{loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}</span>
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
