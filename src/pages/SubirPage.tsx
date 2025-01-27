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

  const [hoveredCell, setHoveredCell] = useState<number[] | null>(null);



  const location = useLocation();
  const csvData = location.state?.csvData || "No hay datos recibidos";
  console.log(csvData)

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

  const [rowHeights, setRowHeights] = useState<number[]>(() => data.map(() => 30));


  function parseCSV(csvString: string): string[][] {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentField = '';
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
      } else if (char === ',' && !insideQuotes) {
        // Si encontramos una coma fuera de comillas, es un nuevo campo
        currentRow.push(currentField);
        currentField = '';
      } else if (char === '\n' && !insideQuotes) {
        // Si encontramos un salto de línea fuera de comillas, es una nueva fila
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else {
        // Cualquier otro carácter, agregar al campo actual
        currentField += char;
      }
    }

    // Agregar la última fila si queda algo pendiente
    if (currentField !== '' || currentRow.length > 0) {
      currentRow.push(currentField);
      rows.push(currentRow);
    }

    return rows;
  }

  useEffect(() => {
    if (csvData && csvData !== "No hay datos recibidos") {
      const parsedData = parseCSV(csvData);
      setData(parsedData);

      // Calcular alturas iniciales para cada fila
      const calculateRowHeights = () => {
        const tempContainer = document.createElement("div");
        tempContainer.style.position = "absolute";
        tempContainer.style.visibility = "hidden";
        tempContainer.style.whiteSpace = "pre-wrap"; // Simula el texto envuelto
        tempContainer.style.width = "100px"; // Ajustar al ancho típico de celdas
        document.body.appendChild(tempContainer);

        const heights = parsedData.map((row) => {
          let maxHeight = 30; // Altura mínima
          row.forEach((cell) => {
            tempContainer.textContent = cell; // Añade contenido al contenedor temporal
            tempContainer.style.height = "auto"; // Permite medir el alto dinámicamente
            maxHeight = Math.max(maxHeight, tempContainer.scrollHeight);
          });
          return Math.min(300, maxHeight); // px por Defauld
        });

        document.body.removeChild(tempContainer); // Eliminar contenedor temporal
        return heights;
      };

      setRowHeights(calculateRowHeights());
    }
  }, [csvData]);  // Solo actualiza el estado si `csvData` cambia


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

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
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

      const response = await axios.post(url, body);
      console.log("Respuesta del servidor:", response.data);
    } catch (error: any) {
      console.error(
        "Error al realizar el POST:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // con esto se modifica el tamaño maximo vertical de cada celda
  const adjustRowHeight = (rowIndex: number, colIndex: number, cellHeight: number) => {
    setRowHeights((prevHeights) => {
      // Create a shallow copy of the heights array
      const updatedHeights = [...prevHeights];

      // Update the height of the specific cell
      const rowCells = data[rowIndex].map((_, colIdx) => {
        const cellElement = document.querySelector(
          `tr:nth-child(${rowIndex + 1}) td:nth-child(${colIdx + 1}) textarea`
        ) as HTMLTextAreaElement;
       //console.log(cellElement.scrollHeight,"asdas3")
       //console.log(rowIndex,"asdas4")
        return cellElement ? Math.min(cellElement.scrollHeight, 300) : 30; // Limit to 300px
      });

      // Calculate the maximum height for the row
      const maxRowHeight = Math.max(...rowCells, cellHeight);
      if (maxRowHeight <= cellHeight) {
        // Si el contenido cabe dentro del límite, ajusta la altura

        updatedHeights[rowIndex] = maxRowHeight;
      } else {
        // Si el contenido excede el límite, fija la altura al máximo
        updatedHeights[rowIndex] = cellHeight;
      }
      // Update the height of the row
      

      return updatedHeights;
    });
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
          width: "100%",
          height: "100%",
          overflowX: data[0].length > 12 ? "auto" : "hidden",
          overflowY: "auto",
          position: "relative", // Para el posicionamiento de los botones flotantes
          maxWidth: "1560px", // Ancho máximo basado en 12 columnas predeterminadas
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
              <TableRow key={rowIndex} style={{ height: `${rowHeights[rowIndex]}px` }}>
                {row.map((cell, colIndex) => (
                  <TableCell
                    key={colIndex}
                    style={{
                      border: "none",
                      padding: "5px",
                      width: ancho[colIndex] || "100px",
                      height: `${rowHeights[rowIndex]}px`,
                    }}
                    onFocus={() => handleMouseEnter(rowIndex, colIndex)}
                  >
                    <textarea
                      value={cell}
                      onChange={(e) =>
                        handleCellChange(rowIndex, colIndex, e.target.value)
                      }
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "auto";

                        const cellHeight = Math.min(target.scrollHeight, 100); // Limit to 300px
                        target.style.height = `${cellHeight}px`;
                      //---------------------------------------------------------------------\\
                        const maxHeight = 500;
                        console.log('scrollHeight:', target.scrollHeight);
                        if (target.scrollHeight <= maxHeight) {
                          target.style.height = `${target.scrollHeight}px`;
                        } else {
                          // Si supera el máximo, limitamos la altura y permitimos el scrollbar
                          target.style.height = `${maxHeight}px`;
                        }
                    
                        // Imprimimos el scrollHeight en la consola
                       
                        adjustRowHeight(rowIndex, colIndex, cellHeight);
                      }}
                      style={{
                        border: "none",
                        width: "100%",
                        resize: "none", // Disable manual resizing
                        overflowY: "auto", // Enable vertical scrolling
                        maxHeight: "600px", // Set maximum height
                        minHeight: `${rowHeights[rowIndex]}px`, // Sync with row height
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
