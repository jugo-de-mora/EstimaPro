import { useEffect, useState } from "react";
import { CheckCircleOutline, Cancel, InfoOutlined } from "@mui/icons-material";
import { green, red } from "@mui/material/colors";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Typography,
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import {
  obtenerProyectos,
  obtenerProyectoPorId,
  eliminarProyectoPorId,
} from "../services/neo4jService";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";

const StyledText = styled("span")({
  textDecoration: "none",
  color: "inherit",
  cursor: "pointer",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    width: 0,
    height: "1px",
    bottom: 0,
    left: 0,
    backgroundColor: "currentColor",
    transition: "width 0.3s ease",
  },
  "&:hover::after": {
    width: "100%",
  },
});

function HomePage() {
  const [datos, setDatos] = useState<any[]>();
  const navegar = useNavigate(); // Hook para la redirección
  const [termBusqueda, setTermBusqueda] = useState<string>(""); // Estado para la búsqueda
  const [esExitoso, setEsExitoso] = useState(true);
  const [mensajeCargaDeDatos, setMensajeCargaDeDatos] = useState<string>(
    "Cargando proyectos..."
  ); // Estado para la búsqueda
  const datosFiltrados = datos?.filter((project) => {
    const textoEnMinuscula = termBusqueda.toLowerCase();
    return (
      project?.nombre?.toLowerCase().includes(textoEnMinuscula) ||
      project?.creado_en?.toLowerCase().includes(textoEnMinuscula)
    );
  });
  const [mensajePopup, setMensajePopup] = useState<string | JSX.Element>("");
  const [mensajeConfirmacionPopup, setMensajeConfirmacionPopup] = useState<
    string | JSX.Element
  >("¿Está seguro que desea eliminar este proyecto?");
  const [abrirPopupResultado, setAbrirPopupResultado] = useState(false);
  const [abrirPopupConfirmacion, setAbrirPopupConfirmacion] = useState(false);
  const [proyectoAEliminar, setProyectoAEliminar] = useState<{
    nombre: string;
    uuid: string;
  } | null>(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const neo4jData = await obtenerProyectos();
        setDatos(neo4jData);
        setMensajeCargaDeDatos("No hay proyectos registrados aún");
        // console.log("Neo4j data:", neo4jData);
      } catch (error) {
        console.error("Error loading Neo4j data:", error);
      }
    };

    obtenerDatos();
  }, []);

  const abrirProyecto = async (_: any, projectName: string, uuid: string) => {
    try {
      // Show loading indicator
      setCargando(true);

      let jsonData: string[] = [];
      const neo4jData = await obtenerProyectoPorId(uuid);
      // console.log("neo4j", neo4jData);
      neo4jData?.historias_usuario?.forEach((h: any) => {
        jsonData.push(JSON.stringify(h));
      });

      let comentarios = neo4jData.comentarios.map((comentario: string) => [
        comentario,
      ]);

      setCargando(false);

      navegar("/crear", {
        state: {
          nombreProyecto: projectName,
          jsonData: jsonData,
          comentariosGuardados: comentarios,
          modo: "editar",
          proyectoID: uuid,
        },
      });
    } catch (error) {
      setCargando(false);

      setMensajePopup(
        <p>
          Proyecto <span style={{ fontWeight: "600" }}>{projectName}</span> no
          ha sido encontrado intente más tarde.
        </p>
      );
      setAbrirPopupResultado(true);
      setEsExitoso(false);
    }
  };

  const eliminarProyecto = async (
    projectName: string,
    uuid: string
  ) => {
    try {
      setCargando(true);
      console.log(projectName, uuid);
      const deleteResponse = await eliminarProyectoPorId(uuid);
      // console.log(deleteResponse);

      if (deleteResponse) {
        const neo4jData = await obtenerProyectos();
        // console.log(neo4jData);
        setDatos(neo4jData);

        setCargando(false);
        setMensajePopup(
          <p>
            Proyecto <span style={{ fontWeight: "600" }}>{projectName}</span> ha
            sido eliminado exitosamente.
          </p>
        );
        setAbrirPopupResultado(true);
        setEsExitoso(true);
      }
    } catch (error) {
      setCargando(false);
      setMensajePopup(
        <p>
          Proyecto <span style={{ fontWeight: "600" }}>{projectName}</span> no
          ha sido eliminado intente más tarde.
        </p>
      );
      setAbrirPopupResultado(true);
      setEsExitoso(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Main Content (Contenido a la derecha) */}
      <Box sx={{ padding: "20px", flexGrow: 1 }}>
        <TextField
          label="🔎 Buscar..."
          variant="outlined"
          fullWidth
          style={{ marginBottom: "20px" }}
          onChange={(e) => setTermBusqueda(e.target.value)}
        />

        <TableContainer
          component={Paper}
          sx={{ backgroundColor: "white", border: "1px solid #b8f2c9" }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#b4e3c2" }}>
                <TableCell sx={{ borderBottom: "1px solid #b8f2c9" }}>
                  Nombre del cliente
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid #b8f2c9" }}>
                  Fecha de creación
                </TableCell>
                <TableCell
                  sx={{ borderBottom: "1px solid #b8f2c9" }}
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datosFiltrados && datosFiltrados.length > 0 ? (
                datosFiltrados.map((p) => (
                  <TableRow
                    key={p.uuid}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#dcf6e4",
                      },
                    }}
                  >
                    <TableCell sx={{ borderBottom: "1px solid #b8f2c9" }}>
                      <StyledText
                        onClick={(e: any) => abrirProyecto(e, p.nombre, p.uuid)}
                      >
                        {p.nombre}
                      </StyledText>
                    </TableCell>
                    <TableCell sx={{ borderBottom: "1px solid #b8f2c9" }}>
                      {p.creado_en.substring(0, 10)}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "1px solid #b8f2c9" }}>
                      <Button
                        // onClick={(e: any) =>
                        //   eliminarProyecto(e, p.nombre, p.uuid)
                        // }
                        onClick={() => {
                          setProyectoAEliminar({ nombre: p.nombre, uuid: p.uuid });
                          setAbrirPopupConfirmacion(true);
                        }}
                        style={{
                          color: "#d6676e",
                          minWidth: "24px",
                          width: "30px",
                          height: "30px",
                          padding: "4px",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FaTrashAlt size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    align="center"
                    sx={{
                      padding: "30px",
                      color: "gray",
                      borderBottom: "1px solid #b8f2c9",
                      fontSize: "16px",
                    }}
                  >
                    {mensajeCargaDeDatos}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* Loading Backdrop */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: "column",
          gap: 2,
        }}
        open={cargando}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" component="div">
          Cargando...
        </Typography>
      </Backdrop>
      <Dialog
        open={abrirPopupResultado}
        onClose={() => setAbrirPopupResultado(false)}
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
          {esExitoso ? (
            <CheckCircleOutline sx={{ color: green[500], fontSize: 30 }} />
          ) : (
            <Cancel sx={{ color: red[500], fontSize: 30 }} />
          )}
          {esExitoso ? "¡Éxito!" : "¡Error!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            component="div" // Esto permite renderizar elementos HTML
          >
            {mensajePopup}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setAbrirPopupResultado(false)}
            sx={{
              color: "white",
              backgroundColor: esExitoso ? green[500] : red[500],
              "&:hover": {
                backgroundColor: esExitoso ? green[700] : red[700],
              },
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={abrirPopupConfirmacion}
        onClose={() => setAbrirPopupConfirmacion(false)}
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
          <InfoOutlined sx={{ color: red[500], fontSize: 30 }} />
          Atención
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" component="div">
            {mensajeConfirmacionPopup}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setAbrirPopupConfirmacion(false)}
            sx={{
              color: "#555",
              backgroundColor: "#e0e0e0",
              "&:hover": {
                backgroundColor: "#d0d0d0",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              eliminarProyecto(proyectoAEliminar?.nombre || "", proyectoAEliminar?.uuid || "");
              setAbrirPopupConfirmacion(false);
            }}
            sx={{
              color: "white",
              backgroundColor: red[500],
              "&:hover": {
                backgroundColor: red[700],
              },
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default HomePage;
