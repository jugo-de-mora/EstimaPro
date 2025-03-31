import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import "./CreateEstimationPopup.css";
import "./SidebarTopbar.css";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import {
  FaHome,
  FaFileImport,
  FaPlus,
  FaBook,
} from "react-icons/fa";
import { Cancel } from "@mui/icons-material";
import { red } from "@mui/material/colors";

interface SidebarSecondOptionProps {
  estaColapsado: boolean;
  setEstaColapsado: React.Dispatch<React.SetStateAction<boolean>>;
}

const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

const SidebarSecondOption: React.FC<SidebarSecondOptionProps> = ({
  estaColapsado,
  setEstaColapsado,
}) => {
  const [abrirPopup, setAbrirPopup] = useState(false);
  const [abrirPopupError, setAbrirPopupError] = useState(false);
  const [arrastrar, setArrastrar] = useState(false);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [mensajeError, setMensajeError] = useState<string>("");
  // const [csvContent, setCsvContent] = useState<string>("");
  const navegar = useNavigate(); // Hook para la redirección
  const ubicacion = useLocation(); // Obtener la ubicación actual

  const titulosRuta: { [key: string]: string } = {
    "/": "Inicio",
    "/seleccionar": "Seleccionar tipo de estimación",
    "/crear": "Datos del proyecto",
    "/manual": "Manual de usuario",
  };

  const cerrarPopup = () => {
    setAbrirPopup(false);
    setArchivo(null); // Resetea archivo si se cancela
  };

  const arrastrarArchivo = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setArrastrar(true);
  };

  const soltarArchivo = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setArrastrar(false);
    const archivoSoltado = e.dataTransfer.files[0];
    setArchivo(archivoSoltado);
  };

  const cambiarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setArchivo(e.target.files[0]);
    }
  };

  const añadirArchivo = () => {
    const extensionesPermitidas = ["csv"];
    const extension = archivo?.name?.split(".").pop()?.toLowerCase();

    // Verificar si la extensión está permitida
    if (extension && extensionesPermitidas.includes(extension)) {
      console.log("Archivo agregado:", archivo?.name);
      const lector = new FileReader();

      // Leer el archivo y procesarlo
      lector.onload = (event) => {
        const csvData = event.target?.result as string;
        // setCsvContent(text);
        console.log("Contenido del archivo CSV:", csvData);
        // Get file name without extension
        const nombreProyecto = archivo?.name.split(".").slice(0, -1).join(".");
        navegar("/crear", {
          state: { csvData: csvData, nombreProyecto: nombreProyecto, modo: "crear" },
        });
      };

      // lector.onerror = () => {
      //   console.error("Hubo un error al leer el archivo.");
      // };

      if (archivo) {
        lector.readAsText(archivo); // Leer el archivo como texto
      }
      setMensajeError(""); // Limpiar mensajes de error
    } else {
      setArchivo(null); // Limpiar archivo
      setMensajeError(
        `Extensión no permitida. Solo se aceptan: ${extensionesPermitidas.join(
          ", "
        )}`
      );
      setAbrirPopupError(true);
    }
    cerrarPopup();
  };

  const activarBarraLateral = () => {
    setEstaColapsado(!estaColapsado);
  };

  return (
    <div
      className="layout-container"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      <Portal>
        {/* <div className="content-container"> */}
        <header
          className={`topbar-container ${estaColapsado ? "collapsed" : ""}`}
        >
          <div className="menu-icon" onClick={activarBarraLateral}>
            ☰
          </div>
          <span style={{ paddingLeft: "50px" }}>
            {titulosRuta[ubicacion.pathname] || "Crear nueva estimación"}
          </span>
        </header>
        {/* </div> */}
      </Portal>

      <Sidebar
        collapsed={estaColapsado}
        // crea su propio contexto de apilamiento
        style={{
          position: "fixed",
          height: "100vh",
        }}
        rootStyles={{
          // ajustar posible tema oscuro
          backgroundColor: "#fff",
        }}
        backgroundColor={"#dcf6e4"}
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
        <Menu
          menuItemStyles={{
            button: {
              [`&.active`]: {
                backgroundColor: "#A7DCC6",
              },
              "&:hover": {
                backgroundColor: "#b4e3c2", // Add hover effect with the specified color
              },
            },
          }}
        >
          <MenuItem icon={<FaFileImport />} onClick={() => setAbrirPopup(true)}>
            Importar
          </MenuItem>
          <MenuItem icon={<FaHome />} component={<Link to="/" />}>
            Inicio
          </MenuItem>
          <MenuItem icon={<FaPlus />} component={<Link to="/seleccionar" />}>
            Nuevo
          </MenuItem>
          {/* <MenuItem icon={<FaFileAlt />} component={<Link to="/crear" />}>
            Crear
          </MenuItem> */}
          <MenuItem icon={<FaBook />} component={<Link to="/manual" />}>
            Manual
          </MenuItem>
        </Menu>
        {abrirPopup && (
          <Portal>
            <div className="popup">
              <div className="popup-content">
                <h2>Arrastra un archivo aquí</h2>
                <div
                  className={`dropzone ${arrastrar ? "drag-over" : ""}`}
                  onDragOver={arrastrarArchivo}
                  onDrop={soltarArchivo}
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  {archivo ? (
                    <p>Archivo seleccionado: {archivo.name}</p>
                  ) : (
                    <p>
                      Arrastra y suelta un archivo aquí, o haz clic para
                      seleccionarlo
                    </p>
                  )}
                  <input
                    type="file"
                    accept=".csv"
                    onChange={cambiarArchivo}
                    style={{ display: "none" }}
                    id="file-input"
                  />
                </div>
                <div className="popup-buttons">
                  <button onClick={añadirArchivo}>Agregar</button>
                  <button onClick={cerrarPopup}>Cancelar</button>
                </div>
              </div>
            </div>
          </Portal>
        )}
      </Sidebar>
      <Dialog
        open={abrirPopupError}
        onClose={() => setAbrirPopupError(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Cancel sx={{ color: red[500], fontSize: 30 }} />
          ¡Error!
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            component="div" // Esto permite renderizar elementos HTML
          >
            {mensajeError}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setAbrirPopupError(false)}
            sx={{
              color: "white",
              backgroundColor: red[500],
              "&:hover": {
                backgroundColor: red[700],
              },
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SidebarSecondOption;
