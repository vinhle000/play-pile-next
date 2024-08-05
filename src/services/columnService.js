const envURL =
  process.env.NODE_ENV === 'prod'
    ? process.env.NODE_ENV
    : 'http://localhost:3000';

const API_URL = `${envURL}/api/board/columns`;

/// OLD Implementation before making service calls for bothj Server and client components
const columnService = {
  async getColumns() {
    try {
      const response = await fetch(`${API_URL}`);
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
      const response = await fetch(`${API_URL}/on-board`);

      // BUG: ISSUE IS HAPPENING HERE!!! - 7.24
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
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        body: { columnTitle: title },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating column for user', error);
      throw error;
    }
  },

  async updateColumn(columnId, updateFields) {
    const requestBody = updateFields ? { ...updateFields } : {};
    try {
      const response = await fetch(`${API_URL}/${columnId}`, {
        method: 'PATCH',
        body: requestBody,
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating column ${columnId}`, error);
    }
  },

  async updatePositions(columns, session) {
    const requestBody = { columns: columns ? columns : [] };
    try {
      const response = await fetch(`${API_URL}/update-positions`, {
        method: 'PATCH',
        body: requestBody,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating column positions', error);
    }
  },

  async deleteColumn(columnId, session) {
    try {
      const response = await fetch(`${API_URL}/${columnId}`, {
        method: 'DELETE',
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting column ${columnId}`, error);
    }
  },
};

export default columnService;
