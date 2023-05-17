// AppRoutes.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './landingPage';
import SignUp from './signUp';
import MovieDetails from './MovieDetails';
import SignIn from './signIn';
import ProtectedRoute from './ProtectedRoute';
// Importa tus otros componentes aquí

const AppRoutes = () => (
  <Routes>
     <Route path="/" element={<LandingPage />} />
    <Route path="/signUp" element={<SignUp />} />
    <Route path="/signIn" element={<SignIn />} />
     <Route path="/movie/:id" element={
      <ProtectedRoute>
        <MovieDetails />
      </ProtectedRoute>
    }/>
  </Routes>
);

export default AppRoutes;
