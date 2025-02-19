import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import "./CreateEstimationPopup.css";
import "./SidebarTopbar.css";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import { FaHome, FaFileImport, FaPlus, FaBook, FaFileAlt } from "react-icons/fa";

interface SidebarSecondOptionProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Topbar = () => {
  return (
    <header
      style={{
        backgroundColor: "#FFF",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "#bfbfbf",
        padding: "10px 20px",
        textAlign: "center",
        fontSize: "25px",
        fontWeight: "600",
        position: "fixed",
        width: "100%",
        top: 0,
      }}
    >
      Crear nueva estimación
    </header>
  );
};

const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

const SidebarSecondOption: React.FC<SidebarSecondOptionProps> = ({
  isCollapsed,
  setIsCollapsed,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Estado para el pop-up
  // const [isCollapsed, setIsCollapsed] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [csvContent, setCsvContent] = useState<string>("");
  const navigate = useNavigate(); // Hook para la redirección

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
        navigate("/crear", { state: { csvData: text } });
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
    <div
      className="layout-container"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      <Portal>
        {/* <div className="content-container"> */}
          <header className={`topbar-container ${isCollapsed ? "collapsed" : ""}`}>
            <div className="menu-icon" onClick={toggleSidebar}>
              ☰
            </div>
            <span>Crear nueva estimación</span>
          </header>
        {/* </div> */}
      </Portal>

      <Sidebar
        collapsed={isCollapsed}
        // crea su propio contexto de apilamiento
        style={{
          position: "fixed",
          height: "100vh",
        }}
        rootStyles={{
          // ajustar posible tema oscuro
          backgroundColor: "#fff",
        }}
        backgroundColor={"#fff"}
      >
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
        <Menu menuItemStyles={{ button: { [`&.active`]: { backgroundColor: "#A7DCC6" } } }}>
          <MenuItem icon={<FaFileImport />} onClick={openPopup}>+ Importar</MenuItem>
          <MenuItem icon={<FaHome />} component={<Link to="/" />}>Inicio</MenuItem>
          <MenuItem icon={<FaPlus />} component={<Link to="/seleccionar" />}>Nuevo</MenuItem>
          <MenuItem icon={<FaFileAlt />} component={<Link to="/crear" />}>Crear</MenuItem>
          <MenuItem icon={<FaBook />} component={<Link to="/manual" />}>Manual</MenuItem>
        </Menu>
        {isPopupOpen && (
          <Portal>
            <div className="popup">
              <div className="popup-content">
                <h2>Arrastra un archivo aquí</h2>
                <div
                  className={`dropzone ${dragOver ? "drag-over" : ""}`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("file-input")?.click()}
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
                    id="file-input"
                  />
                </div>
                <div className="popup-buttons">
                  <button onClick={handleAddFile}>Agregar</button>
                  <button onClick={closePopup}>Cancelar</button>
                  <button onClick={closePopup}>Desde Cero</button>
                </div>
              </div>
            </div>
          </Portal>
        )}
        {errorMessage && (
          <p className="popup" style={{ color: "red" }}>
            {errorMessage}
          </p>
        )}
      </Sidebar>
    </div>
  );
};

export default SidebarSecondOption;
