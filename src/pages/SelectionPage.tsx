import { useState } from "react";
import { Box, TextField } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import { Accordion, Card, Form, Button as ButtonB } from "react-bootstrap";
import { obtenerEstimaciones } from "../services/neo4jService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Neo4jNode {
  nodos: [any];
  [key: string]: any;
}

function SelectionPage() {
  const [datos, setDatos] = useState<Neo4jNode[] | null>();
  const [nombreProyecto, setNombreProyecto] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(true);
  const navegar = useNavigate(); // Hook para la redirección
  const [itemsSeleccionados, setItemsSeleccionados] = useState<string[]>([]);
  const [termBusqueda, setTermBusqueda] = useState<string>(""); // Estado para la búsqueda
  const datosFiltrados = datos
    ?.map((section) => ({
      categoria: section.categoria, // Explicitly include categoria
      ...section,
      nodos: section.nodos.filter((nodo) => {
        const termBusquedaMinusculas = termBusqueda.toLowerCase();
        return (
          // Search in historia_de_usuario
          nodo?.nodo.historia_de_usuario
            ?.toLowerCase()
            .includes(termBusquedaMinusculas) ||
          // Search in criterio_aceptacion
          nodo?.nodo.criterio_aceptacion
            ?.toLowerCase()
            .includes(termBusquedaMinusculas) ||
          // Search in categoria
          section.categoria.toLowerCase().includes(termBusquedaMinusculas)
        );
      }),
    }))
    .filter((section) => section.nodos.length > 0);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const neo4jData = await obtenerEstimaciones();
        setDatos(neo4jData);
        console.log("Neo4j data:", neo4jData);
      } catch (error) {
        console.error("Error loading Neo4j data:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, []);

  const cambiarNombreProyecto = (value: string) => {
    setNombreProyecto(value);
    localStorage.setItem("projectName", value);
  };

  const seleccionarCheckbox = (cardKey: string) => {
    setItemsSeleccionados((prevItems) =>
      prevItems.includes(cardKey)
        ? prevItems.filter((item) => item !== cardKey)
        : [...prevItems, cardKey]
    );
  };

  const aceptar = () => {
    let jsonData: string[] = [];

    if (itemsSeleccionados.length > 0) {
      itemsSeleccionados.forEach((item) => {
        if (datos) {
          datos.forEach((categoria) => {
            categoria.nodos.forEach((nodo) => {
              if (nodo.id === item) {
                jsonData.push(JSON.stringify(nodo.nodo));
              }
            });
          });
        }
      });
    }

    navegar("/crear", {
      state: {
        nombreProyecto: nombreProyecto,
        jsonData: jsonData,
        modo: "crear",
      },
    });
  };

  // Tema de colores
  const estilos = {
    primario: "#A7DCC6", // Verde menta pastel
    secundario: "#F6EBD9", // Beige suave
    acento: "#CFEAD8", // Marrón claro
    fondo: "#FFFFFF", // Blanco
    texto: "#374151", // Gris oscuro
    fondoTarjeta: "#CFEAD8", // Verde claro
    fondoBoton: "#C2EDCE", // Verde claro
  };

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: estilos.fondo,
      }}
    >
      <Box sx={{ padding: "20px", flexGrow: 1 }}>
        <TextField
          label="🔎 Buscar..."
          variant="outlined"
          fullWidth
          value={termBusqueda}
          onChange={(e) => setTermBusqueda(e.target.value)}
          style={{
            marginBottom: "20px",
            backgroundColor: estilos.fondo,
            borderColor: estilos.acento,
          }}
        />
        <hr />
        <h4 style={{ fontWeight: "400", marginBottom: "25px" }}>
          Nombre del proyecto
        </h4>
        <TextField
          label="Nombre..."
          variant="outlined"
          style={{
            marginBottom: "20px",
            backgroundColor: estilos.fondo,
            borderColor: estilos.acento,
          }}
          onChange={(event) => cambiarNombreProyecto(event.target.value)}
        />
        <hr />
        <div>
          <Accordion defaultActiveKey="0">
            {/* Sección 1 */}
            {datosFiltrados?.map((item, index_section) => (
              <Accordion.Item eventKey={index_section.toString()} key={index_section.toString()}>
                <Accordion.Header style={{ backgroundColor: estilos.primario }}>
                  {item?.categoria || "No hay datos disponibles"}
                </Accordion.Header>
                <Accordion.Body>
                  {item.nodos?.map((item_nodo, index_nodo) => (
                    <Card
                      key={item_nodo.id}
                      className="mb-3"
                      style={{
                        backgroundColor: estilos.fondoTarjeta,
                        borderColor: estilos.acento,
                      }}
                    >
                      <Card.Body>
                        <Form.Check
                          type="checkbox"
                          checked={itemsSeleccionados.includes(item_nodo.id)}
                          onChange={() => seleccionarCheckbox(item_nodo.id)}
                          style={{
                            display: "inline-block",
                            marginRight: "10px",
                          }}
                        />
                        <Card.Title
                          style={{
                            color: estilos.texto,
                            display: "inline-block",
                          }}
                        >
                          {datos && datos?.length > 0 ? (
                            <p style={{ marginBottom: "0px" }}>
                              {item_nodo.nodo.historia_de_usuario}
                            </p>
                          ) : (
                            <p style={{ marginBottom: "0px" }}>
                              No hay datos disponibles
                            </p>
                          )}
                        </Card.Title>
                        <Card.Text style={{ color: estilos.texto }}>
                          {datos && datos?.length > 0
                            ? item_nodo.nodo.criterio_aceptacion
                            : "No hay datos disponibles"}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>

          <div
            style={{
              margin: "auto",
              marginTop: "20px",
              width: "150px",
            }}
          >
            <ButtonB
              style={{
                backgroundColor: estilos.fondoBoton,
                borderColor: estilos.acento,
                color: estilos.texto,
              }}
              onClick={aceptar}
              disabled={
                nombreProyecto === "" || itemsSeleccionados.length === 0
              }
            >
              Aceptar
            </ButtonB>
          </div>
        </div>
      </Box>
    </Box>
  );
}

export default SelectionPage;
