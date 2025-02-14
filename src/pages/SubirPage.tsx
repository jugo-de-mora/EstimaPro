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
import { Button as BstpButton } from "react-bootstrap";

const SubirPage: React.FC = () => {
  const themeStyles = {
    primary: "#A7DCC6", // Verde menta pastel
    secondary: "#F6EBD9", // Beige suave
    accent: "#CFEAD8", // Marrón claro
    background: "#FFFFFF", // Blanco
    text: "#374151", // Gris oscuro
    cardBackground: "#CFEAD8", // Verde claro
  };

  const [hoveredCell, setHoveredCell] = useState<number[] | null>(null);

  const location = useLocation();
  const csvData = location.state?.csvData || "No hay datos recibidos";
  const jsonData = location.state?.jsonData || "No hay datos recibidos";

  // ---- Es la primera fila de la tabla----
  const initialHeaders = [
    "#",
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

  const [rowHeights, setRowHeights] = useState<number[]>(() =>
    data.map(() => 30)
  );

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

  function convertJsonToMatrix(jsonData: any): any[][] {
    const headerTable = [
      "",
      "categoria",
      "historia_de_usuario",
      "criterio_aceptacion",
      "total",
      "project_manager",
      "diseño",
      "arquitectura",
      "infraestructura",
      "backend",
      "frontend",
      "qa",
    ];

    // Inicializar la matriz con la fila de encabezados
    const matrix: any[][] = [initialHeaders];

    jsonData.forEach((element: any, parsedJsonIndex: any) => {
      const dataRow: any[] = new Array(headerTable.length).fill("");
      const parsedData = JSON.parse(element);

      for (const [key, value] of Object.entries(parsedData)) {
        // Encontrar el índice correspondiente en el headerTable
        const index = headerTable.indexOf(key);

        if (index !== -1) {
          // Limpiar y formatear el valor según sea necesario
          const cleanedValue = typeof value === "string" ? value.trim() : value;
          // Asignar el valor al índice correspondiente en la fila de datos
          dataRow[index] = cleanedValue;
          dataRow[0] = parsedJsonIndex + 1;
        }
      }

      matrix.push(dataRow);

    })

    return matrix;
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
          return Math.min(600, maxHeight); // px por Defauld
        });

        document.body.removeChild(tempContainer); // Eliminar contenedor temporal
        return heights;
      };

      setRowHeights(calculateRowHeights());
    }
  }, [csvData]);

  useEffect(() => {
    if (jsonData && jsonData !== "No hay datos recibidos") {
      console.log("jsondata antes de entrar", jsonData)
      const parsedJson = convertJsonToMatrix(jsonData);
      console.log("jsonData", jsonData);
      console.log("parsedData", parsedJson);
      setData(parsedJson);

      // Calcular alturas iniciales para cada fila
      const calculateRowHeights = () => {
        const tempContainer = document.createElement("div");
        tempContainer.style.position = "absolute";
        tempContainer.style.visibility = "hidden";
        tempContainer.style.whiteSpace = "pre-wrap"; // Simula el texto envuelto
        tempContainer.style.width = "100px"; // Ajustar al ancho típico de celdas
        document.body.appendChild(tempContainer);

        const heights = parsedJson.map((row) => {
          let maxHeight = 30; // Altura mínima
          row.forEach((cell) => {
            tempContainer.textContent = cell; // Añade contenido al contenedor temporal
            tempContainer.style.height = "auto"; // Permite medir el alto dinámicamente
            maxHeight = Math.max(maxHeight, tempContainer.scrollHeight);
          });
          return Math.min(600, maxHeight); // px por Defauld
        });

        document.body.removeChild(tempContainer); // Eliminar contenedor temporal
        return heights;
      };

      setRowHeights(calculateRowHeights());
    }
  }, [jsonData]);

  useEffect(() => {
    localStorage.setItem("tableData", JSON.stringify(data));
  }, [data]);

  const addRow = () => {
    setData((prevData) => [...prevData, Array(prevData[0].length).fill("")]);
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
    // console.log("Related target:", event.relatedTarget);
    // console.log("Current target:", event.currentTarget);
    // console.log(!event.currentTarget.contains(event.relatedTarget));
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

  // con esto se modifica el tamaño maximo vertical de cada celda
  const adjustRowHeight = (
    rowIndex: number,
    colIndex: number,
    cellHeight: number
  ) => {
    // Calculate the maximum height for the row synchronously
    const rowCells = data[rowIndex].map((_, colIdx) => {
      const cellElement = document.querySelector(
        `tr:nth-child(${rowIndex + 1}) td:nth-child(${colIdx + 1}) textarea`
      ) as HTMLTextAreaElement;
      // console.log("altura encontrada ", cellElement.scrollHeight, "en columna", colIdx + 1);

      if (cellElement) {
        // Forzar el re-cálculo del estilo
        cellElement.style.height = "auto"; // Restablecer altura para que se ajuste automáticamente
        const recalculatedHeight = cellElement.scrollHeight; // Leer el scrollHeight correcto
        // puede que sea el problema
        // cellElement.style.height = `${recalculatedHeight}px`; // Establecer altura calculada
        return recalculatedHeight;
      }

      return 0;
    });

    const maxRowHeight = Math.max(...rowCells, cellHeight);

    // Log values for debugging
    console.log("Heights of cells in the row:", ...rowCells, cellHeight);
    console.log("Max height of the row:", maxRowHeight);
    const highestCellCol = rowCells.findIndex((h) => h === maxRowHeight);
    let heightToAssign = 0;
    console.log("maxrowheight", maxRowHeight);
    console.log("cellheight", cellHeight);
    console.log("colindex", colIndex);
    console.log("highest", highestCellCol);
    console.log(
      "condicion",
      maxRowHeight <= cellHeight ||
        (maxRowHeight > cellHeight && colIndex !== highestCellCol)
    );
    if (
      maxRowHeight <= cellHeight ||
      (maxRowHeight > cellHeight && colIndex !== highestCellCol)
    ) {
      // Si el contenido cabe dentro del límite, ajusta la altura
      // si se está escribiendo en la celda
      heightToAssign = maxRowHeight;
    } else {
      // Si el contenido excede el límite, fija la altura al máximo
      // si se está borrando en la celda
      heightToAssign = cellHeight;
    }

    // Update the state
    setRowHeights((prevHeights) => {
      const updatedHeights = [...prevHeights];
      // const highestCellCol = rowCells.findIndex((h) => h === maxRowHeight);
      // if (
      //   maxRowHeight <= cellHeight ||
      //   (maxRowHeight > cellHeight && colIndex !== highestCellCol)
      // ) {
      //   // Si el contenido cabe dentro del límite, ajusta la altura
      //   // si se está escribiendo en la celda
      //   updatedHeights[rowIndex] = maxRowHeight;
      // } else {
      //   // Si el contenido excede el límite, fija la altura al máximo
      //   // si se está borrando en la celda
      //   updatedHeights[rowIndex] = cellHeight;
      // }
      updatedHeights[rowIndex] = maxRowHeight;
      console.log("heighttoassign", heightToAssign);
      console.log("updatedheights", updatedHeights);
      return updatedHeights;
    });

    return heightToAssign;
  };

  // con esto se modifica el tamaño maximo vertical de cada celda
  // const adjustRowHeight = (
  //   rowIndex: number,
  //   colIndex: number,
  //   cellHeight: number
  // ) => {
  //   // Update the state
  //   setRowHeights((prevHeights) => {
  //     const updatedHeights = [...prevHeights];
  //     // Calculate the maximum height for the row synchronously
  //     const rowCells = data[rowIndex].map((_, colIdx) => {
  //       const cellElement = document.querySelector(
  //         `tr:nth-child(${rowIndex + 1}) td:nth-child(${colIdx + 1}) textarea`
  //       ) as HTMLTextAreaElement;
  //       // console.log("altura encontrada ", cellElement.scrollHeight, "en columna", colIdx + 1);

  //       // return cellElement ? cellElement.scrollHeight : 30; // Default to 30px if no element is found
  //       if (cellElement) {
  //         // Forzar el re-cálculo del estilo
  //         cellElement.style.height = 'auto'; // Restablecer altura para que se ajuste automáticamente
  //         const recalculatedHeight = cellElement.scrollHeight; // Leer el scrollHeight correcto
  //         // cellElement.style.height = `${recalculatedHeight}px`; // Establecer altura calculada
  //         return recalculatedHeight;
  //       }

  //       return 0;
  //     });

  //     const maxRowHeight = Math.max(...rowCells, cellHeight);
  //     const highestCellCol = rowCells.findIndex((h) => h === maxRowHeight);
  //     console.log("Columna con mayor altura:", highestCellCol);
  //     console.log("Columna actual", colIndex);
  //     // Log values for debugging
  //     // console.log("Heights of cells in the row:", ...rowCells, cellHeight);
  //     console.log("Maxheight:", maxRowHeight);
  //     console.log("cellHeight", cellHeight);
  //     // TODO:
  //     // comprobar si la celda en la que se escribe
  //     // es la que tiene mas texto y si es asi ajustar la altura
  //     // de lo contrario no hacer nada
  //     if (maxRowHeight <= cellHeight ||
  //         (maxRowHeight > cellHeight && colIndex !== highestCellCol)
  //     ) {
  //       // Si el contenido cabe dentro del límite, ajusta la altura
  //       // si se está escribiendo en la celda
  //       updatedHeights[rowIndex] = maxRowHeight;
  //     } else {
  //       // Si el contenido excede el límite, fija la altura al máximo
  //       // si se está borrando en la celda
  //       updatedHeights[rowIndex] = cellHeight;
  //     }
  //     // updatedHeights[rowIndex] = maxRowHeight;
  //     return updatedHeights;
  //   });
  // };

  // -------Agrega columnas a la tabla-----
  return (
    <div onBlur={(event) => handleMouseLeave(event)}>
      <h2 style={{ fontWeight: "600", marginBottom: "25px" }}>
        Crear nueva estimación
      </h2>
      <TableContainer
        component={Paper}
        style={{
          backgroundColor: "#c2edce",
          width: "100%",
          height: "100%",
          overflowX: data[0] && data[0].length > 12 ? "auto" : "hidden",
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
              data[0] && data[0].length > 12
                ? `${data[0].length * 100}px`
                : "100%",
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
                      padding: "2px",
                      width: ancho[colIndex] || "100px",
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

                        // const cellHeight = Math.min(target.scrollHeight, 100); // Limit to 300px
                        // target.style.height = `${cellHeight}px`;
                        //---------------------------------------------------------------------\\
                        const maxHeight = 600;
                        let asignedHeight = 0;
                        console.log("scrollHeight:", target.scrollHeight);
                        if (target.scrollHeight <= maxHeight) {
                          // target.style.height = `${target.scrollHeight}px`;
                          // opcion 2
                          asignedHeight = target.scrollHeight;
                        } else {
                          // Si supera el máximo, limitamos la altura y permitimos el scrollbar
                          // target.style.height = `${maxHeight}px`;
                          // opcion 2
                          asignedHeight = maxHeight;
                        }

                        // Imprimimos el scrollHeight en la consola

                        let maxHeightFound = adjustRowHeight(
                          rowIndex,
                          colIndex,
                          asignedHeight
                        );
                        target.style.height = `${maxHeightFound}px`;
                        console.log("altura asignada:", target.style.height);

                        // adjustRowHeight(
                        //   rowIndex,
                        //   colIndex,
                        //   target.scrollHeight
                        // );
                      }}
                      style={{
                        borderRadius: "3px",
                        padding: "5px",
                        border: "none",
                        width: "100%",
                        resize: "none", // Disable manual resizing
                        overflowY: "auto", // Enable vertical scrolling
                        maxHeight: "600px", // Set maximum height
                        height: `${rowHeights[rowIndex]}px`, // Sync with row height
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
      <div
        style={{
          margin: "auto",
          marginTop: "20px",
          width: "150px",
        }}
      >
        <BstpButton
          onClick={crearEstimacion}
          style={{
            width: "150px",
            backgroundColor: themeStyles.cardBackground,
            borderColor: themeStyles.accent,
            color: themeStyles.text,
          }}
        >
          Crear estimacion
        </BstpButton>
      </div>
    </div>
  );
};

export default SubirPage;
