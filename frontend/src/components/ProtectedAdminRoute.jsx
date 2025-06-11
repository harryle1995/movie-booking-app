// src/routes/ProtectedAdminRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

function ProtectedAdminRoute({ children }) {
  const { user } = useContext(UserContext);

  if (!user?.token || !user?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;
