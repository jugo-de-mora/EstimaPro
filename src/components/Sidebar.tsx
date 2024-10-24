import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Button,
  Menu,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import "./CreateEstimationPopup.css";

// Definimos el tipo para las props que recibe el botón de navegación
interface NavigateButtonProps {
  to: string; // La ruta a la que el botón debe navegar
  label: string; // El texto del botón
  onClick?: () => void; // El texto del botón
}

const NavigateButton: React.FC<NavigateButtonProps> = ({
  to,
  label,
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(); // Ejecuta la función pasada como parámetro si existe
    }
    navigate(to); // Navega a la ruta indicada sin refrescar la página
  };

  return (
    <Button
      variant="contained"
      onClick={handleClick}
      style={{
        marginBottom: "10px",
        backgroundColor: "#c2edce",
        color: "#000",
        padding: "10px",
        margin: "5px",
        cursor: "pointer",
      }}
    >
      {label}
    </Button>
  );
};

const Sidebar: React.FC = () => {
  // return (
  //   <div style={{
  //     width: '200px',
  //     backgroundColor: '#a7d6a0',
  //     padding: '20px',
  //     position: 'fixed',
  //     height: '100%',
  //     display: 'flex',
  //     flexDirection: 'column'
  //   }}>
  //     <nav>
  //       <ul style={{ listStyleType: 'none', padding: 0 }}>
  //         <li style={{ marginBottom: '10px' }}>
  //           <Link to="/">Inicio</Link>
  //         </li>
  //         <li style={{ marginBottom: '10px' }}>
  //           <Link to="/about">Acerca de</Link>
  //         </li>
  //         <li style={{ marginBottom: '10px' }}>
  //           <Link to="/contact">Contacto</Link>
  //         </li>
  //       </ul>
  //     </nav>
  //   </div>
  // );
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Estado para el pop-up
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null); // Estado para el archivo arrastrado

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = (index: number) => {
    setOpenDropdowns(
      openDropdowns.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
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
      console.log("Archivo agregado:", file.name);
      // Lógica para agregar el archivo
      closePopup();
    }
  };

  return (
    <Box
      sx={{
        width: "200px",
        backgroundColor: "#b1dcc0",
        padding: "20px",
        position: "fixed",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* <Button variant="contained" style={{ marginBottom: "10px", backgroundColor: "#4d8c90", color: "#fff" }} href="/">
         <Link to="/">+ Crear</Link>
         SEED E.M
      </Button> */}
      <NavigateButton to="/about" label="SEED E.M" />
      <NavigateButton to="/" label="+ Crear" onClick={openPopup} />
      <NavigateButton to="/" label="Inicio" />
      <NavigateButton to="/contact" label="Reciente" />
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Arrastra un archivo aquí</h2>
            <div
              className={`dropzone ${dragOver ? "drag-over" : ""}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {file ? (
                <p>Archivo seleccionado: {file.name}</p>
              ) : (
                <p>
                  Arrastra y suelta un archivo aquí, o haz clic para
                  seleccionarlo
                </p>
              )}
              <input
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
            <div className="popup-buttons">
              <button className="popup-buttons" onClick={handleAddFile}>
                Agregar
              </button>
              <button className="popup-buttons" onClick={closePopup}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </Box>
  );
};

export default Sidebar;
