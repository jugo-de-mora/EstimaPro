import React, { useState } from 'react';
import './App.css';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="logo">SEED E.M</div>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isSidebarOpen ? '←' : '→'}
        </button>
        {isSidebarOpen && (
          <>
            <button className="btn">+ Crear</button>
            <button className="btn">Inicio</button>
            <button className="btn">Reciente</button>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <input type="text" className="search-bar" placeholder="Buscar" />
          <div className="profile-icon"></div>
        </div>

        {/* Table */}
        <div className="table">
          <div className="table-header">
            <span>Nombre del cliente ↑</span>
            <span>Fecha de creación</span>
            <span>Creador</span>
          </div>

          <div className="table-row">
            <span>Universidad El Bosque</span>
            <span>6 abr 2024</span>
            <span>William Vera</span>
            <div className="dropdown">
              <button className="dropdown-btn">•••</button>
              <div className="dropdown-content">
                <a href="#">Abrir en otra pestaña</a>
                <a href="#">Renombrar</a>
                <a href="#">Eliminar</a>
              </div>
            </div>
          </div>

          <div className="table-row">
            <span>Universidad Los Andes</span>
            <span>6 abr 2024</span>
            <span>William Vera</span>
            <div className="dropdown">
              <button className="dropdown-btn">•••</button>
              <div className="dropdown-content">
                <a href="#">Abrir en otra pestaña</a>
                <a href="#">Renombrar</a>
                <a href="#">Eliminar</a>
              </div>
            </div>
          </div>

          <div className="table-row">
            <span>Gimnasio Moderno</span>
            <span>6 abr 2024</span>
            <span>William Vera</span>
            <div className="dropdown">
              <button className="dropdown-btn">•••</button>
              <div className="dropdown-content">
                <a href="#">Abrir en otra pestaña</a>
                <a href="#">Renombrar</a>
                <a href="#">Eliminar</a>
              </div>
            </div>
          </div>

          <div className="table-row">
            <span>Universidad Pedagógica</span>
            <span>6 abr 2024</span>
            <span>William Vera</span>
            <div className="dropdown">
              <button className="dropdown-btn">•••</button>
              <div className="dropdown-content">
                <a href="#">Abrir en otra pestaña</a>
                <a href="#">Renombrar</a>
                <a href="#">Eliminar</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
