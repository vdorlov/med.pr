import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ClinicPricePage from './pages/ClinicPricePage';
import NomenclaturePage from './pages/NomenclaturePage';
import ERUPage from './pages/ERUPage';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clinic/:clinicId"
            element={
              <ProtectedRoute>
                <ClinicPricePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/price-list/:clinicId"
            element={
              <ProtectedRoute>
                <ClinicPricePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reference/804n"
            element={
              <ProtectedRoute>
                <NomenclaturePage />
              </ProtectedRoute>
            }
          />
          <Route path="/nomenclature" element={<NomenclaturePage />} />
          <Route path="/eru" element={<ERUPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;