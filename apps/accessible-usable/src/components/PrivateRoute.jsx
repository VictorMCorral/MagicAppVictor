import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { applyFlowSuffix, getFlowSuffixFromPath } from '../utils/versionRouting';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="fs-5 mt-3">Cargando...</p>
        </div>
      </div>
    );
  }

  const loginPath = applyFlowSuffix('/login', getFlowSuffixFromPath(location.pathname));
  return isAuthenticated ? children : <Navigate to={loginPath} replace />;
};

export default PrivateRoute;
