// AppRoutes.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './landingPage';
import SignUp from './signUp';
import MovieDetails from './MovieDetails';
import SignIn from './signIn';
import ProtectedRoute from './ProtectedRoute';
import SeriesTv from './SeriesTV';
import SeriesDetails from './SeriesDetails';
import CreateProfile from './Profile';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path='/Series' element={<SeriesTv/> } />
    <Route path="/signUp" element={<SignUp />} />
    <Route path="/signIn" element={<SignIn />} />
     <Route path="/movie/:id" element={
      <ProtectedRoute>
        <MovieDetails />
      </ProtectedRoute>
    } />
    <Route path="/tv/:id" element={
      <ProtectedRoute>
        <SeriesDetails />
      </ProtectedRoute>
    } />
    <Route path='/profile' element={
      <ProtectedRoute>
        <CreateProfile />
      </ProtectedRoute>
    }
    />
  </Routes>
);

export default AppRoutes;
