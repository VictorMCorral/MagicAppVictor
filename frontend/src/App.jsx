import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DeckBuilderPage from './pages/DeckBuilderPage';
import DeckViewPage from './pages/DeckViewPage';
import CardSearchPage from './pages/CardSearchPage';
import InventoryPage from './pages/InventoryPage';

// Componentes
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-mtg-bg-dark flex flex-col">
          <Navbar />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cards" element={<CardSearchPage />} />

            {/* Rutas protegidas */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <PrivateRoute>
                  <InventoryPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/deck/new"
              element={
                <PrivateRoute>
                  <DeckBuilderPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/deck/:id"
              element={
                <PrivateRoute>
                  <DeckViewPage />
                </PrivateRoute>
              }
            />

            {/* Ruta 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
      </Router>
    </AuthProvider>
  );
}

export default App;
