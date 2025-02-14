import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000'; // URL de tu backend Django

export const fetchNeo4jData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/obtener_estimaciones/`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Neo4j data:', error);
    throw error;
  }
};
