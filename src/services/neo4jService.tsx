import axios from "axios";

const API_BASE_URL = "http://localhost:4000";

export const crearEstimacion = async (body: any) => {
  try {
    const respuesta = await axios.post(`${API_BASE_URL}/api/crear_estimacion/`, body);
    return respuesta;
  } catch (error) {
    console.error("Error fetching Neo4j data:", error);
    throw error;
  }
};

export const editarEstimacion = async (body: any) => {
  try {
    const respuesta = await axios.post(`${API_BASE_URL}/api/editar_estimacion/`, body);
    return respuesta;
  } catch (error) {
    console.error("Error fetching Neo4j data:", error);
    throw error;
  }
};

export const obtenerEstimaciones = async () => {
  try {
    const respuesta = await axios.get(
      `${API_BASE_URL}/api/obtener_estimaciones/`
    );
    return respuesta.data.data;
  } catch (error) {
    console.error("Error fetching Neo4j data:", error);
    throw error;
  }
};

export const obtenerProyectos = async () => {
  try {
    const respuesta = await axios.get(`${API_BASE_URL}/api/obtener_proyectos/`);
    return respuesta.data.data;
  } catch (error) {
    console.error("Error fetching Neo4j data:", error);
    throw error;
  }
};

export const obtenerProyectoPorId = async (uuid: string) => {
  try {
    const respuesta = await axios.get(
      `${API_BASE_URL}/api/obtener_proyecto_por_id/${uuid}/`
    );
    return respuesta.data.data;
  } catch (error) {
    console.error("Error fetching Neo4j data:", error);
    throw error;
  }
};

export const eliminarProyectoPorId = async (uuid: string) => {
  try {
    const respuesta = await axios.delete(
      `${API_BASE_URL}/api/eliminar_proyecto_por_id/${uuid}/`
    );
    return respuesta;
  } catch (error) {
    console.error("Error fetching Neo4j data:", error);
    throw error;
  }
};
