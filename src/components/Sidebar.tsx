import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import "./CreateEstimationPopup.css";

//------------------------------------------------ SideBar Verde -----------------------------------------------------\\


// Tipo para las props que recibe el botón de navegación
interface NavigateButtonProps {
  to: string;
  label: string;
  onClick?: () => void;
}

const NavigateButton: React.FC<NavigateButtonProps> = ({
  to,
  label,
  onClick,
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleButtonClick = () => {
    if (onClick) onClick(); // Llama a onClick para abrir el popup
    navigate(to); // Navega a la ruta indicada
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); // Abre el menú al pasar el cursor sobre el sub-botón
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Cierra el menú
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleButtonClick} // Llama a onClick y navega
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
        {label === "+ Crear" && (
          <Button
            onMouseEnter={handleMenuOpen} // Despliega el menú al pasar el cursor sobre este botón adicional
            style={{
              marginLeft: "10px",
              width: "1px",
              backgroundColor: "#8cdb96",
              color: "#000",
              padding: "1px",
              height: "15px",
            }}
          >
            ▼
          </Button>
        )}
      </Button>
      {label === "+ Crear" && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          MenuListProps={{ onMouseLeave: handleMenuClose }}
        >
          <MenuItem onClick={() => handleMenuItemClick("/Subir")}>
            Subir archivo
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("/nuevo")}>
            Crear nuevo en blanco
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("/Generar")}>
            Generar
          </MenuItem>
        </Menu>
      )}
    </>
  );
};

const Sidebar: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Estado para el pop-up
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setFile(null); // Resetea archivo si se cancela
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
      // className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}
    >
      <NavigateButton to="/about" label="SEED E.M" />
      <NavigateButton
        to=""
        label={isSidebarOpen ? "←" : "→"}
        onClick={toggleSidebar}
      />
      <NavigateButton to="/" label="+ Crear" onClick={openPopup} />
      <NavigateButton to="/" label="Inicio" />
      <NavigateButton to="/manual" label="Manual" />
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
              <button onClick={handleAddFile}>Agregar</button>
              <button onClick={closePopup}>Cancelar</button>
              <button onClick={closePopup}>Desde Cero</button>
            </div>
          </div>
        </div>
      )}
    </Box>
  );
};

export default Sidebar;
