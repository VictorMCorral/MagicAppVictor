import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Search, BookOpen, LogIn, LogOut, User, Wand2, Map, Info, Film } from 'lucide-react';
import { Navbar as BsNavbar, Nav, Container, Button } from 'react-bootstrap';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setExpanded(false);
  };

  const closeMenu = () => setExpanded(false);

  return (
    <BsNavbar
      expand="lg"
      className="navbar-mtg py-3"
      expanded={expanded}
      onToggle={(value) => setExpanded(value)}
    >
      <Container>
        {/* Logo y Título */}
        <BsNavbar.Brand as={Link} to="/" className="d-flex align-items-center" onClick={closeMenu}>
          <div className="bg-mtg-gold rounded me-2 overflow-hidden" style={{width: '48px', height: '48px'}}>
            <img 
              src={`${process.env.PUBLIC_URL}/logo.jpg`}
              alt="MTG Nexus" 
              className="w-100 h-100"
              style={{objectFit: 'cover'}}
              onError={(e) => { e.target.onerror = null; e.target.src = `${process.env.PUBLIC_URL}/mtg-nexus-logo.svg`; }}
            />
          </div>
          <div className="d-flex flex-column">
            <span className="fw-bold text-mtg-gold">MTG NEXUS</span>
            <span className="text-mtg-gold-dark small">Hub v2.0</span>
          </div>
        </BsNavbar.Brand>

        <BsNavbar.Toggle aria-controls="basic-navbar-nav" className="border-0">
          <span className="navbar-toggler-icon" style={{filter: 'invert(1)'}}></span>
        </BsNavbar.Toggle>

        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            <Nav.Link as={Link} to="/" className="nav-link-mtg d-flex align-items-center gap-2" onClick={closeMenu}>
              <Home size={18} />
              <span>Inicio</span>
            </Nav.Link>

            <Nav.Link as={Link} to="/cards" className="nav-link-mtg d-flex align-items-center gap-2" onClick={closeMenu}>
              <Search size={18} />
              <span>Buscar</span>
            </Nav.Link>

            <Nav.Link as={Link} to="/about" className="nav-link-mtg d-flex align-items-center gap-2" onClick={closeMenu}>
              <Info size={18} />
              <span>About Us</span>
            </Nav.Link>

            <Nav.Link as={Link} to="/visual-studies" className="nav-link-mtg d-flex align-items-center gap-2" onClick={closeMenu}>
              <Film size={18} />
              <span>Estudios Visuales</span>
            </Nav.Link>

            <Nav.Link as={Link} to="/sitemap" className="nav-link-mtg d-flex align-items-center gap-2" onClick={closeMenu}>
              <Map size={18} />
              <span>Mapa Web</span>
            </Nav.Link>

            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/dashboard" className="nav-link-mtg d-flex align-items-center gap-2" onClick={closeMenu}>
                  <BookOpen size={18} />
                  <span>Mazos</span>
                </Nav.Link>

                <Nav.Link as={Link} to="/inventory" className="nav-link-mtg d-flex align-items-center gap-2" onClick={closeMenu}>
                  <Wand2 size={18} />
                  <span>Inventario</span>
                </Nav.Link>

                <div className="d-flex align-items-center gap-3 ps-3 border-start border-mtg-gold-subtle">
                  <div className="d-flex align-items-center gap-2 text-mtg-light">
                    <User size={18} className="text-mtg-gold" />
                    <span className="small fw-medium">{user?.username}</span>
                  </div>
                  <Button
                    variant="link"
                    onClick={handleLogout}
                    className="text-danger d-flex align-items-center gap-1 p-0 text-decoration-none"
                  >
                    <LogOut size={18} />
                    <span className="small fw-medium">Salir</span>
                  </Button>
                </div>
              </>
            ) : (
              <Button
                as={Link}
                to="/login"
                className="btn-mtg-primary d-flex align-items-center gap-2"
                onClick={closeMenu}
              >
                <LogIn size={16} />
                Iniciar Sesión
              </Button>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;
