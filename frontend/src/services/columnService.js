import axios from 'axios'

const API_URL = `${import.meta.env.VITE_REACT_APP_URL}/api/board/columns`;

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
