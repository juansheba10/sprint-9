import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './components/AppRoutes';
import NavBar from './components/NavBar'
import { AuthProvider } from './components/AuthContext';
import Footer from './components/Footer';


const App = () => {
  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <AppRoutes />
        <Footer />
      </AuthProvider>
    </Router>
  );
};

export default App;
