import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import SidebarSecondOption from './components/SidebarSecondOption';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SubirPage from './pages/SubirPage';

function AppPrueba() {
  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* Barra lateral fija */}
        <SidebarSecondOption />

        {/* Contenido que se actualiza basado en las rutas */}
        <div style={{
          flexGrow: 1, 
          marginLeft: '30px',  /* Ajusta esto al ancho de tu barra lateral */
          padding: '20px'
        }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/nuevo" element={<SubirPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default AppPrueba;
