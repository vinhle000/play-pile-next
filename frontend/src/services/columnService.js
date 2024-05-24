import axios from 'axios';

// Set withCredentials to true for all requests
axios.defaults.withCredentials = true;

const envURL = import.meta.env.VITE_ENV === 'prod' ? import.meta.env.VITE_REACT_APP_URL : 'http://localhost:8000';
const API_URL = `${envURL}/api/board/columns`;

const columnService = {

  async getColumns() {
    try {
      const response = await axios.get(`${API_URL}`);
      if (response.data && Array.isArray(response.data)) {
        console.log(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
      }
      return response.data;
    } catch (error) {
      console.error('Error getting columns for user', error);
    }
  },

  async getColumnsOnBoard() {
    try {
      const response = await axios.get(`${API_URL}/onBoard`);
      if (response.data && Array.isArray(response.data)) {
        console.log(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
      }
      return response.data;
    } catch (error) {
      console.error('Error getting columns to be displayed on board', error);
    }
  },

  async createColumn(title) {
    try {
      const response = await axios.post(`${API_URL}`, { columnTitle: title });
      return response.data;
    } catch (error) {
      console.error('Error creating column for user', error);
      throw error;
    }
  },

  async updateColumn(columnId, updateFields) {
    const requestBody = updateFields ? { ...updateFields } : {};
    try {
      const response = await axios.patch(`${API_URL}/${columnId}`, requestBody);
      return response.data;
    } catch (error) {
      console.error(`Error updating column ${columnId}`, error);
    }
  },

  async updatePositions(columns) {
    const requestBody = { columns: columns ? columns : [] };
    try {
      const response = await axios.patch(`${API_URL}/updatePositions`, requestBody);
      return response.data;
    } catch (error) {
      console.error('Error updating column positions', error);
    }
  },

  async deleteColumn(columnId) {
    try {
      const response = await axios.delete(`${API_URL}/${columnId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting column ${columnId}`, error);
    }
  },

};

export default columnService;