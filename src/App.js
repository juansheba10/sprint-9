import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './components/AppRoutes';
import NavBar from './components/NavBar'
import { AuthProvider } from './components/AuthContext';


const App = () => {
  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
