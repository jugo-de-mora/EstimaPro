import React, { useState, useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button } from '@mui/material';

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

  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const [buttonPosition, setButtonPosition] = useState<{ top: number; left: number } | null>(null); // Posición de los botones
  const tableRef = useRef<HTMLDivElement>(null);

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

  const handleMouseEnter = (rowIndex: number, event: React.MouseEvent) => {
    setHoveredRowIndex(rowIndex);

    // Calcula la posición del botón en relación a la tabla
    const tableRect = tableRef.current?.getBoundingClientRect();
    const rowRect = (event.target as HTMLElement).closest('tr')?.getBoundingClientRect();
    
    if (tableRect && rowRect) {
      setButtonPosition({
        top: rowRect.top - tableRect.top + rowRect.height / 2,
        left: tableRect.width + 10 // Posiciona a la derecha de la tabla
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredRowIndex(null);
    setButtonPosition(null); // Oculta los botones al salir de la fila
  };

  return (
    <div>
      <button onClick={addRow}>+ Fila</button>
      <button onClick={addColumn}>+ Columna</button>
      <button onClick={removeRow}>- Fila</button>
      <button onClick={removeColumn}>- Columna</button>
      <TableContainer
        ref={tableRef}
        component={Paper}
        style={{
          backgroundColor: "#c2edce",
          width: "95%",
          height: "100%",
          overflowX: data[0].length > 12 ? "auto" : "hidden",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <Table style={{ borderCollapse: "collapse", marginTop: "10px" }}>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                onMouseEnter={(e) => handleMouseEnter(rowIndex, e)}
                onMouseLeave={handleMouseLeave}
              >
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
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      style={{
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
        {/* Botones flotantes fuera de la tabla */}
        {buttonPosition && hoveredRowIndex !== null && (
          <div
            style={{
              position: "absolute",
              top: buttonPosition.top,
              left: buttonPosition.left,
              display: "flex",
              gap: "5px",
            }}
          >
            <Button variant="contained" color="primary" size="small">Botón 1</Button>
            <Button variant="contained" color="secondary" size="small">Botón 2</Button>
          </div>
        )}
      </TableContainer>
    </div>
  );
};

export default ExcelLikeTable;
