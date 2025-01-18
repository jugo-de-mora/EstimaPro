import React, { useEffect, useState, FocusEvent } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import axios from "axios";
import { useLocation } from "react-router-dom";

const SubirPage: React.FC = () => {
  const location = useLocation();
  const csvData = location.state?.csvData || "No hay datos recibidos";

  // ---- Es la primera fila de la tabla----
  const initialHeaders = [
    "",
    "Categoría",
    "Actividad o HU",
    "Criterio de aceptación",
    "Total",
    "Project Manager",
    "Diseño",
    "Arquitectura",
    "Infraestructura",
    "Backend",
    "Frontend",
    "QA/Doc",
  ];

  const ancho = [
    "50px",
    "100px",
    "200px",
    "200px",
    "100px",
    "100px",
    "100px",
    "100px",
    "100px",
    "100px",
    "100px",
    "100px",
  ];

  const [data, setData] = useState<string[][]>(() => {
    const savedData = localStorage.getItem("tableData");
    if (savedData) {
      return JSON.parse(savedData);
    }

    return [
      initialHeaders,
      Array(initialHeaders.length).fill(""),
      Array(initialHeaders.length).fill(""),
      Array(initialHeaders.length).fill(""),
      Array(initialHeaders.length).fill(""),
      Array(initialHeaders.length).fill(""),
    ];
  });

  const [hoveredCell, setHoveredCell] = useState<number[] | null>(null);

  function parseCSV(csvString: string): string[][] {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentField = "";
    let insideQuotes = false;

    for (let i = 0; i < csvString.length; i++) {
      const char = csvString[i];
      const nextChar = csvString[i + 1];

      if (char === '"') {
        // Si encontramos una comilla, verificar si estamos dentro de comillas
        if (insideQuotes && nextChar === '"') {
          // Si es una comilla escapada, añadirla al campo actual
          currentField += '"';
          i++; // Saltar la siguiente comilla
        } else {
          // Cambiar el estado de dentro de comillas
          insideQuotes = !insideQuotes;
        }
      } else if (char === "," && !insideQuotes) {
        // Si encontramos una coma fuera de comillas, es un nuevo campo
        currentRow.push(currentField);
        currentField = "";
      } else if (char === "\n" && !insideQuotes) {
        // Si encontramos un salto de línea fuera de comillas, es una nueva fila
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = "";
      } else {
        // Cualquier otro carácter, agregar al campo actual
        currentField += char;
      }
    }

    // Agregar la última fila si queda algo pendiente
    if (currentField !== "" || currentRow.length > 0) {
      currentRow.push(currentField);
      rows.push(currentRow);
    }

    return rows;
  }

  useEffect(() => {
    if (csvData && csvData !== "No hay datos recibidos") {
      setData(parseCSV(csvData));
    }
  }, [csvData]); // Solo actualiza el estado si `csvData` cambia

  useEffect(() => {
    localStorage.setItem("tableData", JSON.stringify(data));
  }, [data]);

  const addColumn = () => {
    setData((prevData) => prevData.map((row) => [...row, ""]));
  };

  const addRow = () => {
    setData((prevData) => [...prevData, Array(prevData[0].length).fill("")]);
  };

  const removeColumn = () => {
    if (data[0].length > 12) {
      setData((prevData) => prevData.map((row) => row.slice(0, -1)));
    }
  };

  const removeRow = (rowIndex: number, columnIndex: number) => {
    if (data.length > 2) {
      setData((prevData) => {
        const newData = [...prevData]; // Create a shallow copy of the array
        newData.splice(rowIndex, 1); // Remove the element at rowIndex
        return newData; // Return the modified array
      });
    }
  };

  const handleCellChange = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    // Actualiza el estado local de la tabla
    setData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex] = [...prevData[rowIndex]]; // Copia la fila para evitar mutaciones directas
      newData[rowIndex][colIndex] = value; // Actualiza el valor del input
      // Guarda los datos actualizados en localStorage
      localStorage.setItem("tableData", JSON.stringify(newData));
      return newData; // Actualiza el estado
    });
  };

  const handleMouseEnter = (rowIndex: number, colIndex: number) => {
    setHoveredCell([rowIndex, colIndex]);
  };

  const handleMouseLeave = (event: FocusEvent<HTMLDivElement>) => {
    console.log("Related target:", event.relatedTarget);
    console.log("Current target:", event.currentTarget);
    console.log(!event.currentTarget.contains(event.relatedTarget));
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setHoveredCell(null);
    }
  };

  const getTopPosition = (rowIndex: number, colIndex: number) => {
    if (rowIndex === 0) {
      return "100px";
    }
    if (colIndex === data[0].length - 1) {
      return `${90 + 50 * rowIndex}px`;
    }
  };

  function matrixToJson(matrix: string[][]): Record<string, any>[] {
    if (matrix.length < 2) {
      throw new Error("La matriz debe tener al menos dos filas");
    }

    const headers = matrix[0];
    const jsonArray: Record<string, any>[] = [];

    for (let i = 1; i < matrix.length; i++) {
      const row = matrix[i];
      const jsonObject: Record<string, any> = {};

      headers.forEach((header, index) => {
        jsonObject[header] = row[index];
      });

      jsonArray.push(jsonObject);
    }

    return jsonArray;
  }

  const crearEstimacion = async () => {
    try {
      const url = "http://localhost:4000/api/crear_estimacion/";
      const body = {
        categoria: "Desarrollo de software",
        historia_usuario: "Login",
        criterio_aceptacion: "Usuario puede iniciar sesión",
        total: "10",
        project_manager: "1",
        diseño: "1",
        arquitectura: "1",
        infraestructura: "1",
        backend: "1",
        frontend: "1",
        qa: "1",
      };
      const body2 = matrixToJson(data);
      console.log("Datos a enviar:", body2);

      const response = await axios.post(url, body2);
      console.log("Respuesta del servidor:", response.data);
    } catch (error: any) {
      console.error(
        "Error al realizar el POST:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // -------Agrega columnas a la tabla-----
  return (
    <div onBlur={(event) => handleMouseLeave(event)}>
      <button onClick={addColumn}>+ Columna</button>
      <button onClick={removeColumn}>- Columna</button>
      <TableContainer
        component={Paper}
        style={{
          backgroundColor: "#c2edce",
          width: "95%",
          height: "100%",
          overflowX: data[0].length > 12 ? "auto" : "hidden",
          overflowY: "auto",
          position: "relative", // Para el posicionamiento de los botones flotantes
          maxWidth: "calc(100px * 12)", // Ancho máximo basado en 12 columnas predeterminadas
          whiteSpace: "nowrap", // Mantiene las columnas en una sola línea para el scroll horizontal
        }}
      >
        <Table
          style={{
            borderCollapse: "collapse",
            marginTop: "10px",
            tableLayout: "auto",
            width: "100%",
            minWidth:
              data[0].length > 12 ? `${data[0].length * 100}px` : "100%",
          }}
        >
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <TableCell
                    key={colIndex}
                    style={{
                      border: "none",
                      padding: "5px",
                      width: ancho[colIndex] || "100px",
                    }}
                    onFocus={() => handleMouseEnter(rowIndex, colIndex)}
                  >
                    <textarea
                      value={cell}
                      onChange={(e) =>
                        handleCellChange(rowIndex, colIndex, e.target.value)
                      }
                      style={{
                        border: "none", // remueve la barra horizontal
                        width: "100%",
                        resize: "none",
                        overflowWrap: "break-word",
                        minHeight: "30px",
                      }}
                      disabled={rowIndex === 0 && colIndex < 12}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {hoveredCell && (
        <div
          style={{
            position: "absolute",
            top: getTopPosition(hoveredCell[0], hoveredCell[1]),
            left: "calc(100% - 400px)",
            transform: "translateY(-100%)",
            display: "flex",
            gap: "5px",
            zIndex: 1,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={addRow}
          >
            +
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => removeRow(hoveredCell[0], hoveredCell[1])}
          >
            -
          </Button>
        </div>
      )}
      <button onClick={crearEstimacion}>Crear estimacion</button>
    </div>
  );
};

export default SubirPage;
