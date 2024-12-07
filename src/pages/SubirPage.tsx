import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

const ExcelLikeTable: React.FC = () => {
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

  const [data, setData] = useState<string[][]>([
    initialHeaders,
    Array(initialHeaders.length).fill(""),
    Array(initialHeaders.length).fill(""),
    Array(initialHeaders.length).fill(""),
    Array(initialHeaders.length).fill(""),
    Array(initialHeaders.length).fill(""),
  ]);

  const [hoveredCell, setHoveredCell] = useState<number[] | null>(null); // Estado para el índice de la fila activa

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
    const newData = [...data];
    newData[rowIndex][colIndex] = value;
    setData(newData);
  };

  const handleMouseEnter = (rowIndex: number, colIndex: number) => {
    setHoveredCell([rowIndex, colIndex]);
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  const getTopPosition = (rowIndex: number, colIndex: number) => {
    if (rowIndex === 0) {
      return "100px";
    }
    if (colIndex === data[0].length - 1) {
      return `${90+50*rowIndex}px`;
    }
  }

  return (
    <div>
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
        }}
      >
        <Table style={{ borderCollapse: "collapse", marginTop: "10px" }}>
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
                    onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                    onMouseLeave={handleMouseLeave}
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
                {/* Muestra los botones solo cuando el mouse está sobre la primera fila */}
                {(hoveredCell &&
                  ((hoveredCell[0] === 0 && hoveredCell[1] === rowIndex) || // Primera fila
                    (hoveredCell[0] === rowIndex && hoveredCell[1] === row.length - 1) // Última columna
                  )) && (
                  <div
                    style={{
                      position: "fixed",
                      border: "none",
                      width: "auto",
                      padding: "0",
                      // top: getTopPosition(hoveredCell[0], hoveredCell[1]),
                      top: "auto",
                      left: "auto",
                      right: "auto",
                      zIndex: 1,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",
                        display: "flex",
                        gap: "5px",
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
                        onClick={() => removeRow(rowIndex, row.length - 1)}
                      >
                        -
                      </Button>
                    </div>
                  </div>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
  
};

export default ExcelLikeTable;
