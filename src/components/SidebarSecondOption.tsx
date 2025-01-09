import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import "./CreateEstimationPopup.css";
import axios from "axios";

const SidebarSecondOption = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Estado para el pop-up
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [csvContent, setCsvContent] = useState<string>("");

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
    const allowedExtensions = ["csv"];
    const fileExtension = file?.name?.split(".").pop()?.toLowerCase();

    // Verificar si la extensión está permitida
    if (fileExtension && allowedExtensions.includes(fileExtension)) {
      console.log("Archivo agregado:", file?.name);
      const reader = new FileReader();

      // Leer el archivo y procesarlo
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCsvContent(text);
        console.log("Contenido del archivo CSV:", text); // Mostrar contenido en consola
      };

      reader.onerror = () => {
        console.error("Hubo un error al leer el archivo.");
      };

      if (file) {
        reader.readAsText(file); // Leer el archivo como texto
      }
      setErrorMessage(""); // Limpiar mensajes de error
    } else {
      setFile(null); // Limpiar archivo
      setErrorMessage(
        `Extensión no permitida. Solo se aceptan: ${allowedExtensions.join(
          ", "
        )}`
      );
    }
    closePopup();
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Sidebar collapsed={isCollapsed}>
      <button
        onClick={toggleSidebar}
        style={{
          fontFamily: "monospace",
          fontSize: "20px",
          opacity: isCollapsed ? "0" : "1",
          position: "absolute",
          top: "10px",
          right: "5px",
          backgroundColor: "transparent",
          color: "#696969",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          transition: "right 0.3s ease",
        }}
      >
        {"<"}
      </button>
      <div
        style={{
          padding: "0 24px",
          marginBottom: "20px",
          marginTop: "20px",
        }}
      >
        SEED E.M
      </div>
      {/* <div style={{ padding: "0 24px", marginBottom: "8px" }}>General</div> */}
      <Menu
        menuItemStyles={{
          button: {
            // the active class will be added automatically by react router
            // so we can use it to style the active menu item
            [`&.active`]: {
              backgroundColor: "#13395e",
              color: "#b6c8d9",
            },
          },
        }}
      >
        {/* <MenuItem component={<Link to="/about" />}> SEED E.M</MenuItem> */}
        <MenuItem onClick={openPopup}>+ Crear</MenuItem>
        <MenuItem component={<Link to="/" />}> Inicio</MenuItem>
        <MenuItem component={<Link to="/nuevo" />}> Manual</MenuItem>
      </Menu>
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Arrastra un archivo aquí</h2>
            <div
              className={`dropzone ${dragOver ? "drag-over" : ""}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.querySelector("input")?.click()}
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
                accept=".csv"
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
      {errorMessage && (
        <p className="popup" style={{ color: "red" }}>
          {errorMessage}
        </p>
      )}
    </Sidebar>
  );
};

export default SidebarSecondOption;
