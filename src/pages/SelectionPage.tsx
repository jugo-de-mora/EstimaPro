import React, { useState } from "react";
import { Box, TextField } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import { Accordion, Card, Form, Button as ButtonB } from "react-bootstrap";
import { fetchNeo4jData } from "../services/neo4jService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Client {
  name: string;
  creationDate: string;
  creator: string;
}

interface Neo4jNode {
  nodos: [any];
  [key: string]: any;
}

function HomePage() {
  const [data, setData] = useState<Neo4jNode[] | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate(); // Hook para la redirección

  useEffect(() => {
    const getData = async () => {
      try {
        const neo4jData = await fetchNeo4jData();
        setData(neo4jData);
        console.log("Neo4j data:", neo4jData);
      } catch (error) {
        console.error("Error loading Neo4j data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  // useEffect(() => {
  //   if (data) {
  //     console.log("Neo4j data:", data);
  //     console.log("Categoría:", data[0].categoria);
  //   }
  // }, [data]);

  //   if (loading) {
  //     return <p>Loading...</p>;
  //   }

  const [selectedCards, setSelectedCards] = useState<{
    [key: string]: boolean;
  }>({});

  const handleCheckboxChange = (cardKey: string) => {
    setSelectedCards((prev) => ({
      ...prev,
      [cardKey]: !prev[cardKey],
    }));
  };

  const handleAccept = () => {
    const selectedItems: string[] = Object.keys(selectedCards).filter(
      (key) => selectedCards[key]
    );
    let jsonData: string[] = [];

    if (selectedItems.length > 0) {
      selectedItems.forEach((item) => {
        if (data) {
          jsonData.push(JSON.stringify(data[parseInt(item[0])].nodos[parseInt(item[2])]));
        }
        console.log("Selected item:", jsonData);
      })
    }

    navigate("/crear", { state: { jsonData: jsonData } }); 
  };

  // Tema de colores
  const themeStyles = {
    primary: "#A7DCC6", // Verde menta pastel
    secondary: "#F6EBD9", // Beige suave
    accent: "#CFEAD8", // Marrón claro
    background: "#FFFFFF", // Blanco
    text: "#374151", // Gris oscuro
    cardBackground: "#CFEAD8", // Verde claro
  };



  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: themeStyles.background,
      }}
    >
      <Box sx={{ padding: "20px", flexGrow: 1 }}>
        <h2 style={{fontWeight: "600", marginBottom: "25px"}}>Historias predefinidas</h2>
        {/* Placeholder de buscar */}
        <TextField
          label="Buscar"
          variant="outlined"
          fullWidth
          style={{
            marginBottom: "20px",
            backgroundColor: themeStyles.background,
            borderColor: themeStyles.accent,
          }}
        />
        <div>
          <Accordion defaultActiveKey="0">
            {/* Sección 1 */}
            {data?.map((item, index_section) => (
            <Accordion.Item eventKey={index_section.toString()}>
              <Accordion.Header
                style={{ backgroundColor: themeStyles.primary }}
              >
                {data && data?.length > 0 ? (
                  <p style={{ marginBottom: "0px" }}>{item.categoria}</p>
                ) : (
                  <p style={{ marginBottom: "0px" }}>
                    No hay datos disponibles
                  </p>
                )}
              </Accordion.Header>
              <Accordion.Body>
                {item.nodos?.map((item_nodo, index_nodo) => (
                  <Card
                    key={`sec${index_section}-${index_nodo}`}
                    className="mb-3"
                    style={{
                      backgroundColor: themeStyles.cardBackground,
                      borderColor: themeStyles.accent,
                    }}
                  >
                    <Card.Body>
                      <Form.Check
                        type="checkbox"
                        checked={selectedCards[`${index_section}-${index_nodo}`] || false}
                        onChange={() => handleCheckboxChange(`${index_section}-${index_nodo}`)}
                        style={{
                          display: "inline-block",
                          marginRight: "10px"
                        }}
                      />
                      <Card.Title style={{ color: themeStyles.text, display: "inline-block" }}>
                        {data && data?.length > 0 ? (
                          <p style={{ marginBottom: "0px" }}>
                            {item_nodo.historia_de_usuario}
                          </p>
                        ) : (
                          <p style={{ marginBottom: "0px" }}>
                            No hay datos disponibles
                          </p>
                        )}
                      </Card.Title>
                      <Card.Text style={{ color: themeStyles.text }}>
                        {data && data?.length > 0 ? (
                          <p style={{ marginBottom: "0px" }}>
                            {item_nodo.criterio_aceptacion}
                          </p>
                        ) : (
                          <p style={{ marginBottom: "0px" }}>
                            No hay datos disponibles
                          </p>
                        )}
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
                backgroundColor: themeStyles.cardBackground,
                borderColor: themeStyles.accent,
                color: themeStyles.text,
              }}
              onClick={handleAccept}
            >
              Aceptar
            </ButtonB>
          </div>
        </div>
      </Box>
    </Box>
  );
}

export default HomePage;
