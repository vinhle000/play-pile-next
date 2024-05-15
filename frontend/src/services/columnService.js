import axios from 'axios'

const envURL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_REACT_APP_URL : 'http://localhost:8000';
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/board/columns`;

const columnService = {

  async getColumns() {
    try{
      const response = await axios.get(`${API_URL}/`, { withCredentials: true});
      return response.data;
    } catch (error) {
      console.error('Error getting columns for user ', error)
    }
  },

  async getColumnsOnBoard() {
    try {
      const response = await axios.get(`${API_URL}/onBoard`, { withCredentials: true});
      return response.data;
    } catch (error) {
      console.error(`Error getting columns to be displayed on board`, error)
    }
  },

  async createColumn(title) {
    try{
      const response = await axios.post(`${API_URL}/`, {columnTitle: title}, {withCredentials: true});
      return response.data;
    } catch (error) {
      console.error('Error creating column for user ', error)
      throw error;
    }
  },

  async updateColumn(columnId, updateFields) {
    const requestBody = updateFields ? { ...updateFields} : {}
    try {
      const response = await axios.patch(`${API_URL}/${columnId}`, requestBody, {withCredentials: true});
      return response.data;
    } catch (error) {
      console.error(`Error updated column ${column} `, error)
    }
  },

  // will use the newly ordered list of columns, will use the element index to persist the position in mongoDB
  async updatePositions(columns) {
    const requestBody = { columns: columns ? columns : []}
    try {
      const response = await axios.patch(`${API_URL}/updatePositions`, requestBody, {withCredentials: true });
      return response.data;
    } catch (error) {
      console.error(`Error updating column positions `, error);
    }
  },

  async deleteColumn(columnId) {
    try {
      const response = await axios.delete(`${API_URL}/${columnId}`, {withCredentials: true});
      return response.data;
    } catch (error) {
      console.error(`Error deleting column ${column} `, error)
    }
  },

}

export default columnService;
