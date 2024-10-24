import React, { useState } from 'react';
import './CreateEstimationPopup.css';
// import { Routes, Route } from 'react-router-dom';
// import MainPage from './App';
// import PageCreacion from './Page-Creacion';
// import { Link } from 'react-router-dom';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState([false, false, false, false]);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Estado para el pop-up
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null); // Estado para el archivo arrastrado



  // const App = () => {
  //   return (
  //     <Routes>
  //       <Route path="/" element={<MainPage />} />
  //       <Route path="/newpage" element={<PageCreacion />} />
  //     </Routes>
  //   );
  // };


  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = (index: number) => {
    setOpenDropdowns(openDropdowns.map((isOpen, i) => (i === index ? !isOpen : isOpen)));
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setFile(null); // Resetear archivo si se cancela
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleAddFile = () => {
    if (file) {
      console.log('Archivo agregado:', file.name);
      // Lógica para agregar el archivo
      closePopup();
    }
  };

  return (
    <div className="container">
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="logo">SEED E.M</div>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isSidebarOpen ? '←' : '→'}
        </button>
        {isSidebarOpen && (
          <>
            <button className="btn" onClick={openPopup}>+ Crear</button>
            {/* <Link to="/Page-Creacion">  */}
              <button className="btn">Inicio</button>
            {/* </Link>  */}
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
            <span>+</span>
          </div>

          {["Universidad El Bosque", "Universidad Los Andes", "Gimnasio Moderno", "Universidad Pedagógica"].map((cliente, index) => (
            <div className="table-row" key={index}>
              <span>{cliente}</span>
              <span>6 abr 2024</span>
              <span>William Vera</span>
              <div className="dropdown">
                <button className="dropdown-btn" onClick={() => toggleDropdown(index)}>•••</button>
                <div className={`dropdown-content ${openDropdowns[index] ? 'open' : 'closed'}`}>
                  <a href="#">Abrir en otra pestaña</a>
                  <a href="#">Renombrar</a>
                  <a href="#">Eliminar</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup para arrastrar archivos */}
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Arrastra un archivo aquí</h2>
            <div
              className={`dropzone ${dragOver ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {file ? (
                <p>Archivo seleccionado: {file.name}</p>
              ) : (
                <p>Arrastra y suelta un archivo aquí, o haz clic para seleccionarlo</p>
              )}
              <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
            </div>
            <div className="popup-buttons">
              <button className="popup-buttons" onClick={handleAddFile}>Agregar</button>
              <button className="popup-buttons" onClick={closePopup}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;