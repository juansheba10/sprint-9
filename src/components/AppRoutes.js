// AppRoutes.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './landingPage';
import SignUp from './signUp';
// Importa tus otros componentes aquí

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<SignUp />} />  // Página de registro
    <Route path="/landingPage" element={<LandingPage />} />  // Página principal
    {/* Agrega tus otras rutas aquí */}
  </Routes>
);

export default AppRoutes;
