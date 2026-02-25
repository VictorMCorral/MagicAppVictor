import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SitemapPage.css';
import { resolveFlowPath } from '../utils/versionRouting';

const SitemapPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMap, setActiveMap] = useState('hierarchical');
  const toFlowPath = (path) => resolveFlowPath(path, location.pathname);

  const sitemapTree = [
    {
      title: 'Inicio',
      path: '/home',
      children: [
        {
          title: 'Autenticación',
          children: [
            { title: 'Iniciar sesión', path: '/login' },
            { title: 'Registrarse', path: '/register' }
          ]
        },
        {
          title: 'Info proyecto',
          children: [
            { title: 'Sobre mí', path: '/about' },
            { title: 'Estudios visuales', path: '/visual-studies' },
            { title: 'Mapa web', path: '/sitemap' }
          ]
        },
        {
          title: 'Herramientas',
          children: [
            {
              title: 'Buscar cartas',
              path: '/cards',
              children: [
                { title: 'Resultados de búsqueda', path: '/cards' },
                { title: 'Detalle de carta', path: '/cards' }
              ]
            },
            {
              title: 'Mazos',
              path: '/dashboard',
              children: [
                { title: 'Dashboard de mazos', path: '/dashboard' },
                { title: 'Detalle del mazo', path: '/decks/:id' },
                { title: 'Importar mazo', path: '/decks/:id#import' },
                { title: 'Exportar mazo', path: '/decks/:id#export' }
              ]
            },
            {
              title: 'Inventario',
              path: '/inventory',
              children: [
                { title: 'Vista de inventario', path: '/inventory' },
                { title: 'Escanear carta (cámara)', path: '/inventory#scan' },
                { title: 'Subir imagen (OCR)', path: '/inventory#upload' },
                { title: 'Seleccionar carta detectada', path: '/inventory#select' }
              ]
            }
          ]
        }
      ]
    }
  ];

  const flattenNodes = (items, acc = []) => {
    items.forEach((item) => {
      acc.push({ title: item.title, path: item.path });
      if (item.children?.length) {
        flattenNodes(item.children, acc);
      }
    });
    return acc;
  };

  const uniqueByTitle = new Map();
  flattenNodes(sitemapTree).forEach((item) => {
    if (!item.title) return;
    const key = item.title.toLowerCase();
    if (!uniqueByTitle.has(key)) {
      uniqueByTitle.set(key, item);
    }
  });

  const alphabeticalMap = Array.from(uniqueByTitle.values()).sort((first, second) =>
    first.title.localeCompare(second.title, 'es')
  );

  const navigateToPath = (path) => {
    if (!path) return;
    if (path.includes(':') || path.includes('#')) return;
    navigate(toFlowPath(path));
  };

  const renderTree = (items) => (
    <ol className="sitemap-tree-list">
      {items.map((item) => (
        <li key={`${item.title}-${item.path || 'group'}`}>
          {item.path ? (
            <button className="sitemap-link" onClick={() => navigateToPath(item.path)}>
              {item.title}
            </button>
          ) : (
            <span className="sitemap-text">{item.title}</span>
          )}

          {item.children?.length ? renderTree(item.children) : null}
        </li>
      ))}
    </ol>
  );

  return (
    <main className="sitemap-page" aria-labelledby="sitemap-title">
      <header className="sitemap-header">
        <p className="sitemap-site-name">MagicApp</p>
        <h1 id="sitemap-title">Mapa del sitio</h1>
        <p className="sitemap-description">Estructura completa de navegación de la aplicación.</p>
      </header>

      <nav className="sitemap-breadcrumbs" aria-label="Migas de pan">
        Estás en: <span>MagicApp</span> &gt; <span>Mapa del sitio</span> &gt;{' '}
        <strong>{activeMap === 'hierarchical' ? 'Mapa jerárquico del sitio web' : 'Mapa alfabético del sitio web'}</strong>
      </nav>

      <section className="sitemap-panel" aria-label="Selector de vista del mapa web">
        <button
          className={`sitemap-view-button ${activeMap === 'alphabetical' ? 'active' : ''}`}
          onClick={() => setActiveMap('alphabetical')}
          aria-pressed={activeMap === 'alphabetical'}
        >
          Mapa alfabético del sitio web
        </button>
        <button
          className={`sitemap-view-button ${activeMap === 'hierarchical' ? 'active' : ''}`}
          onClick={() => setActiveMap('hierarchical')}
          aria-pressed={activeMap === 'hierarchical'}
        >
          Mapa jerárquico del sitio web
        </button>
      </section>

      <section className="sitemap-content" aria-live="polite">
        <h2>{activeMap === 'hierarchical' ? 'Mapa jerárquico del sitio web' : 'Mapa alfabético del sitio web'}</h2>

        {activeMap === 'hierarchical' ? (
          renderTree(sitemapTree)
        ) : (
          <ol className="sitemap-tree-list sitemap-alphabetical-list">
            {alphabeticalMap.map((item) => (
              <li key={`alpha-${item.title}`}>
                {item.path ? (
                  <button className="sitemap-link" onClick={() => navigateToPath(item.path)}>
                    {item.title}
                  </button>
                ) : (
                  <span className="sitemap-text">{item.title}</span>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>

      <footer className="sitemap-footer">
        <p>Número de páginas y vistas representadas: {alphabeticalMap.length}</p>
        <p>Consejo: usa este mapa para revisar navegación, jerarquía y cobertura funcional.</p>
      </footer>
    </main>
  );
};

export default SitemapPage;
