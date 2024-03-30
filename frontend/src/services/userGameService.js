import axios from 'axios';

const API_URL = `${import.meta.env.VITE_REACT_APP_URL}/api/userGames`;

const userGameService = {
  async getUserBacklog() {
    try {
      const response = await axios.get(`${API_URL}/backlog`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Error getting user backlog', error);
    }
  },

  async addGameToBacklog(igdbId) {
    try {
      const response = await axios.put(`${API_URL}/backlog/${igdbId}`, {}, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Error adding game to backlog', error);
    }
  },

  async removeGameFromBacklog(igdbId) {
    try {
      const response = await axios.delete(`${API_URL}/backlog/${igdbId}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Error removing game from backlog', error);
    }
  },

  async updateGameData(igdbId, fields = {}) {
    try {
      const response = await axios.patch(`${API_URL}/${igdbId}`, fields, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error(`Error updating user's game data`, error);
    }
  }
};

export default userGameService;