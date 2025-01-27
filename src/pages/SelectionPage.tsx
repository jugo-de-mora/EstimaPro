import React, { useState } from "react";
import { Box, TextField } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import { Accordion, Card, Form, Button as ButtonB } from "react-bootstrap";
import { fetchNeo4jData } from "../services/neo4jService";
import { useEffect } from "react";

interface Client {
  name: string;
  creationDate: string;
  creator: string;
}

interface Neo4jNode {
  [key: string]: any;
}

function HomePage() {
  const [data, setData] = useState<Neo4jNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const neo4jData = await fetchNeo4jData();
        console.log("Neo4j data:", neo4jData);
        setData(neo4jData);
      } catch (error) {
        console.error("Error loading Neo4j data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

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
    const selectedItems = Object.keys(selectedCards).filter(
      (key) => selectedCards[key]
    );
    alert(`Has seleccionado: ${selectedItems.join(", ")}`);
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
            <Accordion.Item eventKey="0">
              <Accordion.Header
                style={{ backgroundColor: themeStyles.primary }}
              >
                Sección 1
              </Accordion.Header>
              <Accordion.Body>
                {[1, 2, 3].map((index) => (
                  <Card
                    key={`sec1-${index}`}
                    className="mb-3"
                    style={{
                      backgroundColor: themeStyles.cardBackground,
                      borderColor: themeStyles.accent,
                    }}
                  >
                    <Card.Body>
                      <Card.Title style={{ color: themeStyles.text }}>
                        Card {index} - Sección 1
                      </Card.Title>
                      <Card.Text style={{ color: themeStyles.text }}>
                        Contenido de la tarjeta {index}.
                      </Card.Text>
                      <Form.Check
                        type="checkbox"
                        label="Seleccionar"
                        checked={selectedCards[`sec1-${index}`] || false}
                        onChange={() => handleCheckboxChange(`sec1-${index}`)}
                      />
                    </Card.Body>
                  </Card>
                ))}
              </Accordion.Body>
            </Accordion.Item>

            {/* Sección 2 */}
            <Accordion.Item eventKey="1">
              <Accordion.Header
                style={{ backgroundColor: themeStyles.primary }}
              >
                Sección 2
              </Accordion.Header>
              <Accordion.Body>
                {[1, 2, 3].map((index) => (
                  <Card
                    key={`sec2-${index}`}
                    className="mb-3"
                    style={{
                      backgroundColor: themeStyles.cardBackground,
                      borderColor: themeStyles.accent,
                    }}
                  >
                    <Card.Body>
                      <Card.Title style={{ color: themeStyles.text }}>
                        Card {index} - Sección 2
                      </Card.Title>
                      <Card.Text style={{ color: themeStyles.text }}>
                        Contenido de la tarjeta {index}.
                      </Card.Text>
                      <Form.Check
                        type="checkbox"
                        label="Seleccionar"
                        checked={selectedCards[`sec2-${index}`] || false}
                        onChange={() => handleCheckboxChange(`sec2-${index}`)}
                      />
                    </Card.Body>
                  </Card>
                ))}
              </Accordion.Body>
            </Accordion.Item>

            {/* Sección 3 */}
            <Accordion.Item eventKey="2">
              <Accordion.Header
                style={{ backgroundColor: themeStyles.primary }}
              >
                Sección 3
              </Accordion.Header>
              <Accordion.Body>
                {[1, 2, 3].map((index) => (
                  <Card
                    key={`sec3-${index}`}
                    className="mb-3"
                    style={{
                      backgroundColor: themeStyles.cardBackground,
                      borderColor: themeStyles.accent,
                    }}
                  >
                    <Card.Body>
                      <Card.Title style={{ color: themeStyles.text }}>
                        Card {index} - Sección 3
                      </Card.Title>
                      <Card.Text style={{ color: themeStyles.text }}>
                        Contenido de la tarjeta {index}.
                      </Card.Text>
                      <Form.Check
                        type="checkbox"
                        label="Seleccionar"
                        checked={selectedCards[`sec3-${index}`] || false}
                        onChange={() => handleCheckboxChange(`sec3-${index}`)}
                      />
                    </Card.Body>
                  </Card>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          {/* Botón de Aceptar al final */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "20px",
            }}
          >
            <ButtonB
              style={{
                backgroundColor: themeStyles.cardBackground,
                borderColor: themeStyles.accent,
                color: themeStyles.text,
              }}
              size="lg"
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
