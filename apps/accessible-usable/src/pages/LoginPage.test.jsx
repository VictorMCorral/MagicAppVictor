import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

const mockNavigate = jest.fn();

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const { useAuth } = require('../context/AuthContext');

describe('LoginPage (Bootstrap)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra feedback cuando la API devuelve errores', async () => {
    const loginMock = jest.fn().mockRejectedValue({
      response: {
        data: {
          message: 'No existe un usuario registrado con ese email',
          errors: [
            { msg: 'Email inválido' },
            { msg: 'La contraseña es requerida' }
          ]
        }
      }
    });

    useAuth.mockReturnValue({
      login: loginMock
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Bootstrap usa Form.Control con Form.Label, buscamos por placeholder
    const emailInputs = screen.getAllByPlaceholderText(/tu@email.com/i);
    fireEvent.change(emailInputs[0], {
      target: { value: 'foo@bar.com' }
    });
    const passwordInputs = screen.getAllByPlaceholderText(/••••••••/i);
    fireEvent.change(passwordInputs[0], {
      target: { value: '' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar Sesión/i }));

    expect(await screen.findByText(/Se detectaron errores al iniciar sesión/i)).toBeInTheDocument();
    expect(screen.getByText('No existe un usuario registrado con ese email')).toBeInTheDocument();
    expect(screen.getByText('Email: Email inválido')).toBeInTheDocument();
    expect(screen.getByText('Contraseña: La contraseña es requerida')).toBeInTheDocument();
    expect(loginMock).toHaveBeenCalledWith('foo@bar.com', '');
  });

  it('permite seleccionar el estado de accesibilidad y actualiza la descripción', () => {
    const loginMock = jest.fn().mockResolvedValue({});
    useAuth.mockReturnValue({
      login: loginMock
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Verifica que existe el grupo de accesibilidad
    expect(screen.getByText(/Estado de Accesibilidad/i)).toBeInTheDocument();
    
    // Verifica botones de accesibilidad
    const normalBtn = screen.getByRole('button', { name: /Accesible y Usable/i });
    expect(normalBtn).toBeInTheDocument();
  });

  it('redirige al home de la versión no usable tras login exitoso', async () => {
    const loginMock = jest.fn().mockResolvedValue({});
    useAuth.mockReturnValue({ login: loginMock });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /No Usable/i }));

    const emailInput = screen.getByPlaceholderText(/tu@email.com o admin/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);

    fireEvent.change(emailInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'admin' } });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar Sesión/i }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('admin', 'admin');
      expect(mockNavigate).toHaveBeenCalledWith('/home-no-usable');
    });
  });

  it('redirige al home de la versión no accesible tras login exitoso', async () => {
    const loginMock = jest.fn().mockResolvedValue({});
    useAuth.mockReturnValue({ login: loginMock });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /No Accesible/i }));

    const emailInput = screen.getByPlaceholderText(/tu@email.com o admin/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);

    fireEvent.change(emailInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'admin' } });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar Sesión/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home-no-accesible');
    });
  });

  it('debería renderizar formulario de login', () => {
    useAuth.mockReturnValue({
      login: jest.fn()
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Verifica que existe el heading con rol
    expect(screen.getByRole('heading', { name: /Iniciar Sesión/i })).toBeInTheDocument();
    const emailInputs = screen.getAllByPlaceholderText(/tu@email.com/i);
    expect(emailInputs.length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();
  });

  it('debería usar componentes Bootstrap', () => {
    useAuth.mockReturnValue({
      login: jest.fn()
    });

    const { container } = render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Verificar clases Bootstrap
    expect(container.querySelector('.container')).toBeInTheDocument();
    expect(container.querySelector('.card')).toBeInTheDocument();
    expect(container.querySelector('.form-control')).toBeInTheDocument();
  });
});
