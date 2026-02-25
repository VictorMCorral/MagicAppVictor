import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BreadcrumbsNav from './BreadcrumbsNav';

describe('BreadcrumbsNav', () => {
  it('muestra breadcrumb de inicio en home', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <Routes>
          <Route path="*" element={<BreadcrumbsNav />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Inicio')).toBeInTheDocument();
  });

  it('construye rutas de breadcrumb manteniendo el flujo por sufijo', () => {
    render(
      <MemoryRouter initialEntries={['/decks-no-usable/123']}>
        <Routes>
          <Route path="*" element={<BreadcrumbsNav />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Mazos')).toBeInTheDocument();
    expect(screen.getByText('Detalle del Mazo')).toBeInTheDocument();

    const homeLink = screen.getByRole('link', { name: 'Inicio' });
    const decksLink = screen.getByRole('link', { name: 'Mazos' });

    expect(homeLink).toHaveAttribute('href', '/home-no-usable');
    expect(decksLink).toHaveAttribute('href', '/dashboard-no-usable');
  });
});
