import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut, User, Wand2, Info, ChevronRight } from 'lucide-react';
import { Navbar as BsNavbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { resolveFlowPath } from '../utils/versionRouting';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [isMobileView, setIsMobileView] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 992;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 992);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toFlowPath = (path) => resolveFlowPath(path, location.pathname);

  const handleLogout = () => {
    logout();
    navigate(toFlowPath('/home'));
    setExpanded(false);
  };

  const closeMenu = () => setExpanded(false);

  const infoItems = [
    { label: 'Sobre mi', path: '/about' },
    { label: 'Estudios visuales', path: '/visual-studies' },
    { label: 'Mapa Web', path: '/sitemap' }
  ];

  const toolItems = [
    { label: 'Inventario', path: '/inventory' },
    { label: 'Buscar carta', path: '/cards' },
    { label: 'Mazos', path: '/dashboard' }
  ];

  return (
    <BsNavbar
      expand="lg"
      className="navbar-mtg py-3"
      expanded={expanded}
      onToggle={(value) => setExpanded(value)}
    >
      <Container>
        {/* Logo y Título */}
        <BsNavbar.Brand as={Link} to={toFlowPath('/home')} className="d-flex align-items-center" onClick={closeMenu}>
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
            {isMobileView ? (
              <div className="mobile-nav-groups w-100">
                <div className="mobile-nav-group">
                  <div className="mobile-nav-group-title">
                    <Info size={18} />
                    <span>Info Proyecto</span>
                  </div>
                  <div className="mobile-nav-submenu">
                    {infoItems.map((item) => (
                      <Nav.Link
                        key={item.path}
                        as={Link}
                        to={toFlowPath(item.path)}
                        className="mobile-nav-subitem"
                        onClick={closeMenu}
                      >
                        <ChevronRight size={14} className="mobile-nav-subicon" />
                        <span>{item.label}</span>
                      </Nav.Link>
                    ))}
                  </div>
                </div>

                <div className="mobile-nav-group">
                  <div className="mobile-nav-group-title">
                    <Wand2 size={18} />
                    <span>Herramientas</span>
                  </div>
                  <div className="mobile-nav-submenu">
                    {toolItems.map((item) => (
                      <Nav.Link
                        key={item.path}
                        as={Link}
                        to={toFlowPath(item.path)}
                        className="mobile-nav-subitem"
                        onClick={closeMenu}
                      >
                        <ChevronRight size={14} className="mobile-nav-subicon" />
                        <span>{item.label}</span>
                      </Nav.Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <NavDropdown
                  title={<span className="d-inline-flex align-items-center gap-2 text-mtg-light"><Info size={18} />Info Proyecto</span>}
                  id="info-proyecto-dropdown"
                  menuVariant="dark"
                  className="nav-link-mtg"
                >
                  {infoItems.map((item) => (
                    <NavDropdown.Item key={item.path} as={Link} to={toFlowPath(item.path)} onClick={closeMenu}>
                      {item.label}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>

                <NavDropdown
                  title={<span className="d-inline-flex align-items-center gap-2 text-mtg-light"><Wand2 size={18} />Herramientas</span>}
                  id="herramientas-dropdown"
                  menuVariant="dark"
                  className="nav-link-mtg"
                >
                  {toolItems.map((item) => (
                    <NavDropdown.Item key={item.path} as={Link} to={toFlowPath(item.path)} onClick={closeMenu}>
                      {item.label}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              </>
            )}

            {isAuthenticated ? (
              <>
                <div className="navbar-auth-zone d-flex align-items-center gap-3 ps-3 border-start border-mtg-gold-subtle">
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
                to={toFlowPath('/login')}
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
