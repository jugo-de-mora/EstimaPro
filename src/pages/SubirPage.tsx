import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';

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
    "QA/Doc"
  ];

  const ancho = [
    "50px", "100px", "200px", "200px", "100px", "100px", "100px", "100px", "100px", "100px", "100px", "100px"
  ];

  const [data, setData] = useState<string[][]>([
    initialHeaders,
    Array(initialHeaders.length).fill("")
  ]);

  const [maxHeight, setMaxHeight] = useState<number>(30); // Estado para la altura máxima de áreas de texto a partir de la segunda fila

  const addColumn = () => {
    setData(prevData => prevData.map(row => [...row, ""]));
  };

  const addRow = () => {
    setData(prevData => [...prevData, Array(prevData[0].length).fill("")]);
  };

  const removeColumn = () => {
    if (data[0].length > 12) {
      setData(prevData => prevData.map(row => row.slice(0, -1)));
    }
  };

  const removeRow = () => {
    if (data.length > 2) {
      setData(prevData => prevData.slice(0, -1));
    }
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...data];
    newData[rowIndex][colIndex] = value;
    setData(newData);
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>, rowIndex: number) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "auto"; // Reinicia la altura para recalcular
    const newHeight = target.scrollHeight; // Obtiene la nueva altura del contenido

    // Actualiza la altura máxima solo si es a partir de la segunda fila y si el nuevo alto es mayor
    if (rowIndex > 0) {
      setMaxHeight((prevMaxHeight) => Math.max(prevMaxHeight, newHeight));
    }
  };

  return (
    <div>
      <button onClick={addRow}>+ Fila</button>
      <button onClick={addColumn}>+ Columna</button>
      <button onClick={removeRow}>- Fila</button>
      <button onClick={removeColumn}>- Columna</button>
      <TableContainer
        component={Paper}
        style={{
          backgroundColor: "#c2edce",
          width: "95%",
          height: "100%",
          overflowX: data[0].length > 12 ? "auto" : "hidden",
          overflowY: "auto",
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
                      border: "1px solid #ccc",
                      padding: "5px",
                      width: ancho[colIndex] || "100px",
                    }}
                  >
                    <textarea
                      value={cell}
                      onChange={(e) => {
                        handleCellChange(rowIndex, colIndex, e.target.value);
                        handleTextareaInput(e, rowIndex); // Ajusta la altura automáticamente para la segunda fila en adelante
                      }}
                      style={{
                        width: "100%",
                        height: rowIndex > 0 ? `${maxHeight}px` : "30px", // Aplica la altura máxima a partir de la segunda fila
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
    </div>
  );
};

export default ExcelLikeTable;