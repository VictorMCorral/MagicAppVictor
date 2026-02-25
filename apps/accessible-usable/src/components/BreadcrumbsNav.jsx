import React from 'react';
import { Breadcrumb, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { normalizeAppPath, resolveFlowPath } from '../utils/versionRouting';

const ROUTE_LABELS = {
  home: 'Inicio',
  login: 'Iniciar Sesión',
  register: 'Registro',
  cards: 'Buscar Cartas',
  about: 'Sobre Mi',
  'visual-studies': 'Estudios Visuales',
  sitemap: 'Mapa Web',
  dashboard: 'Mazos',
  decks: 'Mazos',
  inventory: 'Inventario',
  deck: 'Mazo'
};

const buildCrumbs = (pathname) => {
  const normalizedPath = normalizeAppPath(pathname);
  const segments = normalizedPath.split('/').filter(Boolean);

  if (!segments.length) {
    return [{ label: 'Inicio', path: '/home' }];
  }

  if (normalizedPath === '/home') {
    return [{ label: 'Inicio', path: '/home' }];
  }

  if (normalizedPath === '/deck/new') {
    return [
      { label: 'Inicio', path: '/home' },
      { label: 'Mazos', path: '/dashboard' },
      { label: 'Nuevo Mazo', path: '/deck/new' }
    ];
  }

  if (segments[0] === 'decks' && segments[1]) {
    return [
      { label: 'Inicio', path: '/home' },
      { label: 'Mazos', path: '/dashboard' },
      { label: 'Detalle del Mazo', path: `/decks/${segments[1]}` }
    ];
  }

  const crumbs = [{ label: 'Inicio', path: '/home' }];
  let currentPath = '';

  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = ROUTE_LABELS[segment] || segment;

    if (segment === 'home') return;

    crumbs.push({
      label,
      path: currentPath
    });
  });

  return crumbs;
};

const BreadcrumbsNav = () => {
  const location = useLocation();
  const crumbs = buildCrumbs(location.pathname);

  return (
    <div className="breadcrumbs-wrapper py-2">
      <Container>
        <Breadcrumb className="mb-0 breadcrumbs-mtg">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            const flowPath = resolveFlowPath(crumb.path, location.pathname);

            return (
              <Breadcrumb.Item
                key={`${crumb.path}-${crumb.label}`}
                active={isLast}
                linkAs={isLast ? 'span' : Link}
                linkProps={isLast ? undefined : { to: flowPath }}
              >
                {crumb.label}
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
      </Container>
    </div>
  );
};

export default BreadcrumbsNav;
