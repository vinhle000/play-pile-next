const envURL =
  process.env.NODE_ENV == 'production'
    ? process.env.NEXT_PUBLIC_NEXTAUTH_URL
    : 'http://localhost:3000';

const API_URL = `${envURL}/api/board/columns`;

const columnService = {
  async getColumns() {
    try {
      const response = await fetch(`${API_URL}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        console.log('fetch getColumns --->', data);
      } else {
        console.error('Unexpected response format:', data);
      }
      return data;
    } catch (error) {
      console.error('Error getting columns for user', error);
    }
  },

  async getColumnsOnBoard() {
    try {
      const response = await fetch(`${API_URL}/on-board`, {
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (Array.isArray(data)) {
        console.log('fetch getColumnsOnBoard ---> ', data);
      } else {
        console.error('Unexpected response format:', data);
      }
      return data;
    } catch (error) {
      console.error('Error getting columns to be displayed on board', error);
    }
  },

  async createColumn(title) {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        body: JSON.stringify({ columnTitle: title }),
        headers: { 'Content-Type': 'application/json' },
      });
      return await response.json();
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
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' },
      });
      return await response.json();
    } catch (error) {
      console.error(`Error updating column ${columnId}`, error);
    }
  },

  async updateColumnPositions(columns) {
    const requestBody = { columns: columns ? columns : [] };
    try {
      const response = await fetch(`${API_URL}/update-positions`, {
        method: 'PATCH',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' },
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating column positions', error);
    }
  },

  async deleteColumn(columnId) {
    try {
      const response = await fetch(`${API_URL}/${columnId}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error(`Error deleting column ${columnId}`, error);
    }
  },
};

export default columnService;
