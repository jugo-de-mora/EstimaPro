import React, { useEffect, useState, FocusEvent } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  Box,
  TextField,
  CircularProgress,
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { Button as BstpButton } from "react-bootstrap";
import ExcelJS from "exceljs";
import { CheckCircleOutline, Cancel } from "@mui/icons-material";
import { green, red } from "@mui/material/colors";
import { crearEstimacion, editarEstimacion } from "../services/neo4jService";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";

const SubirPage: React.FC = () => {
  const themeStyles = {
    primary: "#A7DCC6", // Verde menta pastel
    secondary: "#F6EBD9", // Beige suave
    accent: "#CFEAD8", // Marrón claro
    background: "#FFFFFF", // Blanco
    text: "#374151", // Gris oscuro
    cardBackground: "#CFEAD8", // Verde claro
    buttonBackground: "#C2EDCE", // Verde claro
  };

  const navigate = useNavigate(); // Hook para la redirección
  const ubicacion = useLocation();

  const csvDatos = ubicacion.state?.csvData || "No hay datos recibidos";
  const jsonDatos = ubicacion.state?.jsonData || "No hay datos recibidos";
  const nombreProyecto =
    ubicacion.state?.nombreProyecto || "No hay datos recibidos";
  const proyectoID = ubicacion.state?.proyectoID || "No hay datos recibidos";
  const comentariosGuardados =
    ubicacion.state?.comentariosGuardados || "No hay datos recibidos";
  const modo = ubicacion.state?.modo || "No hay datos recibidos";

  const [celdaSeleccionada, setCeldaSeleccionada] = useState<number[] | null>(
    null
  );
  const [abrirPopup, setAbrirPopup] = useState(false);
  const [mensajePopup, setMensajePopup] = useState<string | JSX.Element>("");
  const [esExitoso, setEsExitoso] = useState(true);
  const [comentarios, setComentarios] = useState<string[][]>([]);
  const [nuevosComentariosID, setNuevosComentariosID] = useState<number[]>([]);
  const [comentarioParaAgregar, setComentarioParaAgregar] =
    useState<string>("");
  const [nombreDeProyectoNuevo, setNombreDeProyectoNuevo] =
    useState(nombreProyecto);
  const [cambiosHechos, setCambiosHechos] = useState(
    modo === "crear" ? true : false
  );
  const [datos, setDatos] = useState<string[][]>(() => {
    const datosGuardados = localStorage.getItem("tableData");
    if (datosGuardados) {
      return JSON.parse(datosGuardados);
    }

    return [
      encabezadoInicial,
      Array(encabezadoInicial.length).fill(""),
      Array(encabezadoInicial.length).fill(""),
      Array(encabezadoInicial.length).fill(""),
      Array(encabezadoInicial.length).fill(""),
      Array(encabezadoInicial.length).fill(""),
    ];
  });
  const [alturaFilas, setAlturaFilas] = useState<number[]>(() =>
    datos.map(() => 30)
  );
  const [cargando, setCargando] = useState(false);

  // ---- Es la primera fila de la tabla----
  const encabezadoInicial = [
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
    "uuid",
    "modificado",
    "eliminado",
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

  function convertirCSVEnArreglos(csvString: string): string[][] {
    // Initialize with the predefined header
    const filas: string[][] = [encabezadoInicial];

    // Skip the header line by finding the first newline
    const primeraLineaNuevaIndex = csvString.indexOf("\n");
    if (primeraLineaNuevaIndex === -1) {
      // If there's no newline, return just the header
      return filas;
    }

    // Start processing from after the first newline
    const contenidoSinHeader = csvString.substring(primeraLineaNuevaIndex + 1);

    let filaActual: string[] = [];
    let campoActual = "";
    let comillasInternas = false;

    // Process the remaining content (skipping the header)
    for (let i = 0; i < contenidoSinHeader.length; i++) {
      const char = contenidoSinHeader[i];
      const proximoChar = contenidoSinHeader[i + 1];

      if (char === '"') {
        // Si encontramos una comilla, verificar si estamos dentro de comillas
        if (comillasInternas && proximoChar === '"') {
          // Si es una comilla escapada, añadirla al campo actual
          campoActual += '"';
          i++; // Saltar la siguiente comilla
        } else {
          // Cambiar el estado de dentro de comillas
          comillasInternas = !comillasInternas;
        }
      } else if (char === "," && !comillasInternas) {
        // Si encontramos una coma fuera de comillas, es un nuevo campo
        filaActual.push(campoActual);
        campoActual = "";
      } else if (char === "\n" && !comillasInternas) {
        // Si encontramos un salto de línea fuera de comillas, es una nueva fila
        filaActual.push(campoActual);

        // Asegúrese de que la fila tenga la longitud correcta
        while (filaActual.length < encabezadoInicial.length) {
          filaActual.push("");
        }

        filas.push(filaActual);
        filaActual = [];
        campoActual = "";
      } else {
        // Cualquier otro carácter, agregar al campo actual
        campoActual += char;
      }
    }

    // Agregar la última fila si queda algo pendiente
    if (campoActual !== "" || filaActual.length > 0) {
      filaActual.push(campoActual);

      // Asegúrese de que la última fila tenga la longitud correcta
      while (filaActual.length < encabezadoInicial.length) {
        filaActual.push("");
      }

      filas.push(filaActual);
    }

    // Añadir columnas de uuid, modificado y eliminado con valores por defecto
    for (let i = 1; i < filas.length; i++) {
      // Valores predeterminados: uuid vacío, no modificado (0), no eliminado (0)
      filas[i][12] = filas[i][12] || ""; // uuid
      filas[i][13] = filas[i][13] || "0"; // modificado
      filas[i][14] = filas[i][14] || "0"; // eliminado
    }

    console.log("CSV Processed:", filas);
    return filas;
  }

  function convertirJsonAMatriz(jsonData: any): any[][] {
    const tablaDeEncabezado = [
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
      "uuid",
      "modificado",
      "eliminado",
    ];

    // Inicializar la matriz con la fila de encabezados
    const matriz: any[][] = [encabezadoInicial];

    jsonData.forEach((element: any, parsedJsonIndex: any) => {
      const dataRow: any[] = new Array(tablaDeEncabezado.length).fill("");
      dataRow[tablaDeEncabezado.length - 1] = "0"; // Marcar como no eliminado
      dataRow[tablaDeEncabezado.length - 2] = "0"; // Marcar como no modificado
      const parsedData = JSON.parse(element);
      console.log("parsedData", parsedData);

      for (const [key, value] of Object.entries(parsedData)) {
        // Encontrar el índice correspondiente en el headerTable
        const index = tablaDeEncabezado.indexOf(key);

        if (index !== -1) {
          // Limpiar y formatear el valor según sea necesario
          const cleanedValue = typeof value === "string" ? value.trim() : value;
          // Asignar el valor al índice correspondiente en la fila de datos
          dataRow[index] = cleanedValue;
          dataRow[0] = parsedJsonIndex + 1;
        }
      }

      matriz.push(dataRow);
    });

    return matriz;
  }

  useEffect(() => {
    if (csvDatos && csvDatos !== "No hay datos recibidos") {
      const parsedData = convertirCSVEnArreglos(csvDatos);
      setDatos(parsedData);

      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "auto", // Cambiado de 'instant' a 'auto'
        });
      });

      // Calcular alturas iniciales para cada fila
      const calculateRowHeights = () => {
        const contenedorTemporal = document.createElement("div");
        contenedorTemporal.style.position = "absolute";
        contenedorTemporal.style.visibility = "hidden";
        contenedorTemporal.style.whiteSpace = "pre-wrap"; // Simula el texto envuelto
        contenedorTemporal.style.width = "100px"; // Ajustar al ancho típico de celdas
        document.body.appendChild(contenedorTemporal);

        const alturas = parsedData.map((row) => {
          let alturaMaxima = 30; // Altura mínima
          row.forEach((cell) => {
            contenedorTemporal.textContent = cell; // Añade contenido al contenedor temporal
            contenedorTemporal.style.height = "auto"; // Permite medir el alto dinámicamente
            alturaMaxima = Math.max(
              alturaMaxima,
              contenedorTemporal.scrollHeight
            );
          });
          return Math.min(600, alturaMaxima); // px por Defauld
        });

        document.body.removeChild(contenedorTemporal); // Eliminar contenedor temporal
        return alturas;
      };

      setAlturaFilas(calculateRowHeights());
    }
  }, [csvDatos]);

  useEffect(() => {
    if (jsonDatos && jsonDatos !== "No hay datos recibidos") {
      const parsedJson = convertirJsonAMatriz(jsonDatos);
      console.log("jsonDatasaasdf", jsonDatos);
      console.log("parsedData", parsedJson);
      setDatos(parsedJson);

      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "auto", // Cambiado de 'instant' a 'auto'
        });
      });

      // Calcular alturas iniciales para cada fila
      const calculateRowHeights = () => {
        const contenedorTemporal = document.createElement("div");
        contenedorTemporal.style.position = "absolute";
        contenedorTemporal.style.visibility = "hidden";
        contenedorTemporal.style.whiteSpace = "pre-wrap"; // Simula el texto envuelto
        contenedorTemporal.style.width = "200px"; // Ajustar al ancho típico de celdas
        document.body.appendChild(contenedorTemporal);

        const alturas = parsedJson.map((row) => {
          let alturaMaxima = 30; // Altura mínima
          row.forEach((cell) => {
            contenedorTemporal.textContent = cell; // Añade contenido al contenedor temporal
            contenedorTemporal.style.height = "auto"; // Permite medir el alto dinámicamente
            alturaMaxima = Math.max(
              alturaMaxima,
              contenedorTemporal.scrollHeight
            );
            // maxHeight = tempContainer.scrollHeight;
          });
          // return Math.min(600, maxHeight); // px por Defauld
          return alturaMaxima; // px por Defauld
        });

        document.body.removeChild(contenedorTemporal); // Eliminar contenedor temporal
        return alturas;
      };

      setAlturaFilas(calculateRowHeights());
    }
  }, [jsonDatos]);

  useEffect(() => {
    if (
      comentariosGuardados &&
      comentariosGuardados !== "No hay datos recibidos"
    ) {
      setComentarios(comentariosGuardados);
    }
  }, [comentariosGuardados]);

  useEffect(() => {
    localStorage.setItem("tableData", JSON.stringify(datos));
  }, [datos]);

  const agregarFila = () => {
    if (celdaSeleccionada) {
      setDatos((prevData) => {
        const newData = [...prevData]; // Copia del array de datos
        const newRow = Array(prevData[0].length).fill(""); // Nueva fila vacía
        newRow[0] = prevData[celdaSeleccionada[0]][0] + 1; // Número de fila
        newRow[prevData[0].length - 2] = "1"; // Número de fila

        newData.splice(celdaSeleccionada[0] + 1, 0, newRow); // Inserta la nueva fila justo debajo

        for (let i = celdaSeleccionada[0] + 2; i < newData.length; i++) {
          console.log("fila", i);
          newData[i][0] = newData[i][0] + 1; // Número de fila
        }

        return newData;
      });
    }
  };

  const eliminarFila = (rowIndex: number) => {
    if (datos.length > 2) {
      setDatos((prevData) => {
        const newData = [...prevData]; // Copia del array
        // newData.splice(rowIndex, 1); // Elimina la fila seleccionada
        // newData[0].length - 1 es la columna "eliminado"
        newData[rowIndex][newData[0].length - 1] = "1"; // Marca la fila como eliminada

        // Si la fila eliminada era la última, mover la selección arriba
        let newHoveredCell = celdaSeleccionada;
        if (celdaSeleccionada && celdaSeleccionada[0] >= newData.length) {
          newHoveredCell = [newData.length - 1, celdaSeleccionada[1]];
        }

        setCeldaSeleccionada(newHoveredCell); // Actualizar la celda seleccionada
        return newData;
      });
      setCambiosHechos(true);
    }
  };

  const actualizarCeldaEnCambio = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    // Actualiza el estado local de la tabla
    setDatos((prevData) => {
      const newData = [...prevData];
      newData[rowIndex] = [...prevData[rowIndex]]; // Copia la fila para evitar mutaciones directas
      newData[rowIndex][colIndex] = value; // Actualiza el valor del input
      newData[rowIndex][newData[0].length - 2] = "1"; // Actualiza el valor del modificado
      // Guarda los datos actualizados en localStorage
      localStorage.setItem("tableData", JSON.stringify(newData));
      return newData; // Actualiza el estado
    });
    setCambiosHechos(true);
  };

  const ingresoMouse = (rowIndex: number, colIndex: number) => {
    setCeldaSeleccionada([rowIndex, colIndex]);
  };

  const salidaMouse = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setCeldaSeleccionada(null);
    }
  };

  const obtenerPosicionSuperior = (rowIndex: number) => {
    const rowElements = document.querySelectorAll(".table-row");
    if (!rowElements || !rowElements[rowIndex]) return "0px";
    return `${rowElements[rowIndex].getBoundingClientRect().top}px`;
  };

  const obtenerPosicionIzq = (colIndex: number) => {
    const colElements = document.querySelectorAll(".table-col");
    if (!colElements || !colElements[colIndex]) return "0px";
    return `${colElements[colIndex].getBoundingClientRect().left}px`;
  };

  const crearEstimacionBody = (matrix: string[][]) => {
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

    const body = {
      historias_usuario: jsonArray,
      nombre_proyecto: nombreDeProyectoNuevo,
      comentarios: comentarios,
    };

    return body;
  };

  const editarEstimacionBody = (matrix: string[][]) => {
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

    const body = {
      historias_usuario: jsonArray,
      nombre_proyecto: nombreDeProyectoNuevo,
      comentarios: nuevosComentariosID.length > 0 ? comentarios : [],
      proyecto_uuid: proyectoID,
    };

    return body;
  };

  const descargarExcel = async (body: any) => {
    const allHeaders = Object.keys(body.historias_usuario[0]);
    const limitedHeaders = [allHeaders.slice(0, 12)];

    // Convert each JSON object to an array of values and limit to first 12 columns
    const tableData = body.historias_usuario.map((obj: any) =>
      Object.values(obj).slice(0, 12)
    );

    // Combine all data (comments + headers + table rows)
    let worksheetData;
    if (comentarios && comentarios.length > 0) {
      // Include comments section if there are comments
      worksheetData = [
        ["COMENTARIOS"],
        ...comentarios,
        [],
        ...limitedHeaders,
        ...tableData,
      ];
    } else {
      // Skip comments section if there are no comments
      worksheetData = [
        ...limitedHeaders,
        ...tableData,
      ];
    }

    // 1) Create a new workbook
    const workbook = new ExcelJS.Workbook();

    // 2) Add a worksheet
    const worksheet = workbook.addWorksheet("Hoja1");

    // 3) Add the data rows
    worksheet.addRows(worksheetData);

    // 4) Apply styles
    //    - comments occupy rows 1..comments.length
    //    - headers are on row = comments.length + 1
    //    - table data starts at row = comments.length + 2
    const totalRows = worksheetData.length;
    const totalCols = worksheetData[worksheetData.length - 1]?.length || 0;

    for (let rowIndex = 1; rowIndex <= totalRows; rowIndex++) {
      const row = worksheet.getRow(rowIndex);

      // Set row height (similar to hpt in xlsx-style)
      row.height = 25;

      for (let colIndex = 1; colIndex <= totalCols; colIndex++) {
        const cell = row.getCell(colIndex);
        const cellValue = cell.value?.toString() || "";

        // Wrap text + vertical align middle
        cell.alignment = {
          wrapText: true,
          vertical: "middle",
        };

        // Thin borders
        if (cellValue.trim() !== "") {
          // Thin borders for non-empty cells
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        };

        // If this row is the "header row"
        if (rowIndex === 1 && colIndex === 1) {
          // Blue background, white bold text
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF85B814" }, // "FF" + "0000FF" => Blue
          };
          cell.font = {
            color: { argb: "FFFFFFFF" }, // White
            bold: true,
          };
        } else if (rowIndex === comentarios.length + 3) {
          // Other header cells
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF6064d1" }, // Light greenish
          };
          cell.font = {
            color: { argb: "FFFFFFFF" },
            bold: true,
          };
        }
      }
    }

    // 5) Set column widths (e.g., first column = 30 chars)
    const columnasAnchos: Record<number, number> = {
      1: 30,
      2: 30,
      3: 50,
      4: 50,
    };
    for (const key in columnasAnchos) {
      const numKey = parseInt(key);
      worksheet.getColumn(numKey).width = columnasAnchos[numKey];
    }

    // 6) Generate and download the file in the browser
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // File name
    const fileName = `${nombreDeProyectoNuevo || "output"}.xlsx`;

    // Trigger download (plain JS way)
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    // Clean up
    URL.revokeObjectURL(link.href);
  };

  const guardarCambios = async () => {
    try {
      setCargando(true);
      if (modo === "crear") {
        const body = crearEstimacionBody(datos);
        console.log("Datos a enviar:", body);

        descargarExcel(body);

        const respuesta = await crearEstimacion(body);
        console.log("Respuesta del servidor:", respuesta.data);
        setCargando(false);
        setMensajePopup(
          <p>
            Proyecto{" "}
            <span style={{ fontWeight: "600" }}>{nombreDeProyectoNuevo}</span>{" "}
            creado exitosamente.
          </p>
        );
        setEsExitoso(true);
        setAbrirPopup(true);
        setCambiosHechos(false);
      } else if (modo === "editar") {
        const body = editarEstimacionBody(datos);
        console.log("Datos a enviar:", body);

        descargarExcel(body);

        const respuesta = await editarEstimacion(body);
        console.log("Respuesta del servidor:", respuesta.data);
        setCargando(false);
        setMensajePopup(<p>Cambios guardados exitosamente.</p>);
        setEsExitoso(true);
        setAbrirPopup(true);
        setCambiosHechos(false);
      }
    } catch (error: any) {
      setCargando(false);
      console.error(
        "Error al realizar el POST:",
        error.response ? error.response.data : error.message
      );
      setMensajePopup(
        <p>
          Proyecto{" "}
          <span style={{ fontWeight: "600" }}>{nombreDeProyectoNuevo}</span>{" "}
          lastimosamente no fue creado exitosamente intente más tarde.
        </p>
      );
      setEsExitoso(false);
      setAbrirPopup(true);
    }
  };

  const ajustarAlturaFilas = (
    rowIndex: number,
    colIndex: number,
    cellHeight: number
  ) => {
    const rowCells = datos[rowIndex].map((_, colIdx) => {
      const cellElement = document.querySelector(
        `tr:nth-child(${rowIndex + 1}) td:nth-child(${colIdx + 1}) textarea`
      ) as HTMLTextAreaElement;

      if (cellElement) {
        // Forzar el re-cálculo del estilo
        cellElement.style.height = "auto"; // Restablecer altura para que se ajuste automáticamente
        const recalculatedHeight = cellElement.scrollHeight;
        return recalculatedHeight;
      }

      return 0;
    });

    const maxRowHeight = Math.max(...rowCells, cellHeight);

    const highestCellCol = rowCells.findIndex((h) => h === maxRowHeight);
    let heightToAssign = 0;

    if (
      maxRowHeight <= cellHeight ||
      (maxRowHeight > cellHeight && colIndex !== highestCellCol)
    ) {
      heightToAssign = maxRowHeight;
    } else {
      heightToAssign = cellHeight;
    }

    return heightToAssign;
  };

  const agregarComentario = () => {
    if (comentarioParaAgregar.trim()) {
      setComentarios([...comentarios, [comentarioParaAgregar]]);
      setComentarioParaAgregar("");

      if (modo === "editar") {
        setNuevosComentariosID([...nuevosComentariosID, comentarios.length]);
        setCambiosHechos(true);
      }
    }
  };

  const eliminarComentario = (index: number) => {
    setComentarios(comentarios.filter((_, i) => i !== index));
    setCambiosHechos(true);
    if (modo === "editar") {
      setNuevosComentariosID(
        nuevosComentariosID.filter((i) => {
          if (i === index) {
            setCambiosHechos(false);
            return false;
          } else {
            return true;
          }
        })
      );
    }
  };

  const cambiarNombreProyecto = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNombreDeProyectoNuevo(event.target.value);

    const text = event.target.value;
    if (!text.trim()) {
      setCambiosHechos(false);
    } else {
      setCambiosHechos(true);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        // height: "100vh",
        backgroundColor: themeStyles.background,
      }}
    >
      <Box sx={{ padding: "20px", flexGrow: 1 }}>
        <div onBlur={(event) => salidaMouse(event)}>
          {/* Sección de comentarios */}
          <Paper
            style={{
              padding: "16px",
              marginBottom: "20px",
              maxWidth: "1560px",
              backgroundColor: "#c2edce",
            }}
          >
            <h4 style={{ fontWeight: "400", marginBottom: "23px" }}>
              Añadir comentarios
            </h4>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={comentarioParaAgregar}
                onChange={(e) => setComentarioParaAgregar(e.target.value)}
                placeholder="✏️ Agregar un comentario..."
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  paddingLeft: "15px",
                }}
              />
              <Button
                variant="contained"
                onClick={agregarComentario}
                sx={{ backgroundColor: "#a0caac", fontSize: "20px" }}
              >
                +
              </Button>
            </div>
            <ul style={{ marginTop: "10px", paddingLeft: "0px" }}>
              {[...comentarios].reverse().map((comment, index) => {
                // Calculate the actual index in the original array for deletion
                const indiceOriginal = comentarios.length - 1 - index;

                return (
                  <div
                    key={indiceOriginal} // Use the original index as the key
                    style={{
                      backgroundColor: "#e8f5e9",
                      borderRadius: "8px",
                      padding: "15px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      marginBottom: "10px", // Add spacing between comments
                    }}
                  >
                    <li
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        wordBreak: "break-word",
                        overflow: "hidden",
                        maxWidth: "100%",
                        listStyle: "none", // Remove bullet points
                      }}
                    >
                      <span
                        style={{
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {comment}
                      </span>
                      <Button
                        onClick={() => eliminarComentario(indiceOriginal)}
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
                    </li>
                  </div>
                );
              })}
            </ul>
          </Paper>
          <h4 style={{ fontWeight: "400", marginBottom: "25px" }}>
            Nombre del proyecto
          </h4>
          <TextField
            label="Nombre..."
            variant="outlined"
            value={nombreDeProyectoNuevo}
            onChange={cambiarNombreProyecto}
            style={{
              marginBottom: "20px",
              backgroundColor: themeStyles.background,
              borderColor: themeStyles.accent,
            }}
          />
          <TableContainer
            component={Paper}
            style={{
              backgroundColor: "#c2edce",
              width: "100%",
              height: "100%",
              overflowX: datos[0] && datos[0].length > 12 ? "auto" : "hidden",
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
                  datos[0] && datos[0].length > 12
                    ? `${datos[0].length * 100}px`
                    : "100%",
              }}
            >
              <TableBody>
                {datos.map((row, rowIndex) => {
                  if (row[row.length - 1] !== "1") {
                    return (
                      <TableRow key={rowIndex} className="table-row">
                        {row.map((cell, colIndex) => {
                          if (colIndex < 12) {
                            return (
                              <TableCell
                                key={colIndex}
                                className="table-col"
                                style={{
                                  border: "none",
                                  padding: "2px",
                                  width: ancho[colIndex] || "100px",
                                }}
                                onFocus={() => ingresoMouse(rowIndex, colIndex)}
                              >
                                <textarea
                                  value={cell}
                                  onChange={(e) =>
                                    actualizarCeldaEnCambio(
                                      rowIndex,
                                      colIndex,
                                      e.target.value
                                    )
                                  }
                                  onInput={(e) => {
                                    const target =
                                      e.target as HTMLTextAreaElement;
                                    target.style.height = "auto";

                                    const maxHeight = 600;
                                    let assignedHeight = 0;
                                    if (target.scrollHeight <= maxHeight) {
                                      assignedHeight = target.scrollHeight;
                                    } else {
                                      assignedHeight = maxHeight;
                                    }

                                    const newHeight = ajustarAlturaFilas(
                                      rowIndex,
                                      colIndex,
                                      assignedHeight
                                    );

                                    datos[rowIndex].forEach((_, idx) => {
                                      const cell = document.querySelector(
                                        `tr:nth-child(${
                                          rowIndex + 1
                                        }) td:nth-child(${idx + 1}) textarea`
                                      ) as HTMLTextAreaElement;
                                      if (cell) {
                                        cell.style.height = `${newHeight}px`;
                                      }
                                    });
                                  }}
                                  style={{
                                    borderRadius: "3px",
                                    padding: "5px",
                                    border: "none",
                                    width: "100%",
                                    resize: "none", // Disable manual resizing
                                    overflowY: "auto", // Enable vertical scrolling
                                    maxHeight: "600px", // Set maximum height
                                    minHeight: "30px",
                                    height: `${alturaFilas[rowIndex]}px`,
                                  }}
                                  disabled={rowIndex === 0 && colIndex < 12}
                                />
                              </TableCell>
                            );
                          }
                        })}
                      </TableRow>
                    );
                  }
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {celdaSeleccionada && (
            <div
              style={{
                position: "absolute",
                top: obtenerPosicionSuperior(celdaSeleccionada[0]),
                left: obtenerPosicionIzq(celdaSeleccionada[1]),
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
                onClick={agregarFila}
              >
                +
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => {
                  if (celdaSeleccionada) {
                    eliminarFila(celdaSeleccionada[0]);
                  }
                }}
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
            <Tooltip
              title={
                modo === "crear" && !nombreDeProyectoNuevo.trim()
                  ? "El nombre del proyecto no puede estar vacío"
                  : "No hay cambios por guardar"
              }
              arrow
              placement="top"
              disableHoverListener={cambiosHechos} // Only show tooltip when disabled
              disableFocusListener={cambiosHechos}
              disableTouchListener={cambiosHechos}
            >
              <span style={{ display: "block" }}>
                {" "}
                {/* Wrapper needed for disabled buttons */}
                <BstpButton
                  onClick={guardarCambios}
                  style={{
                    width: "150px",
                    backgroundColor: themeStyles.buttonBackground,
                    borderColor: themeStyles.accent,
                    color: themeStyles.text,
                    cursor: cambiosHechos ? "pointer" : "not-allowed",
                    opacity: cambiosHechos ? 1 : 0.7,
                  }}
                  disabled={!cambiosHechos}
                >
                  Guardar
                </BstpButton>
              </span>
            </Tooltip>
          </div>
        </div>
      </Box>
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
        open={abrirPopup}
        onClose={() => setAbrirPopup(false)}
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
            onClick={() => {
              setAbrirPopup(false);
              navigate("/");
            }}
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
    </Box>
  );
};

export default SubirPage;
