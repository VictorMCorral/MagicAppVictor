import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Sparkles } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register(formData.email, formData.username, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)' }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="card-mtg-premium">
              <Card.Body className="p-4 p-md-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center rounded mb-3"
                    style={{ 
                      width: '56px', 
                      height: '56px', 
                      background: 'var(--mtg-gold-bright)' 
                    }}
                  >
                    <UserPlus size={32} style={{ color: 'var(--mtg-black)' }} />
                  </div>
                  <h2 className="h3 fw-bold" style={{ color: 'var(--mtg-gold-bright)' }}>
                    Crear Cuenta
                  </h2>
                  <p className="mt-2" style={{ color: 'var(--mtg-text-light)' }}>
                    ¿Ya tienes cuenta?{' '}
                    <Link 
                      to="/login" 
                      className="fw-semibold text-decoration-none"
                      style={{ color: 'var(--mtg-gold-bright)' }}
                    >
                      Inicia sesión aquí
                    </Link>
                  </p>
                </div>

                {/* Form */}
                <Form onSubmit={handleSubmit}>
                  {error && (
                    <Alert variant="danger" className="alert-mtg-danger">
                      ⚠️ {error}
                    </Alert>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-mtg">Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control-mtg"
                      placeholder="tu@email.com"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-mtg">Nombre de Usuario</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      autoComplete="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="form-control-mtg"
                      placeholder="usuario123"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-mtg">Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="form-control-mtg"
                      placeholder="••••••••"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="form-label-mtg">Confirmar Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="form-control-mtg"
                      placeholder="••••••••"
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="btn-mtg-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" />
                        <span>Creando cuenta...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        <span>Registrarse</span>
                      </>
                    )}
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

export default RegisterPage;
