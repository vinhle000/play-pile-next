import axios from 'axios'
import gameService from './gameService'

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

  async getUserBacklogWithGameDetails() {
    try {
      const userBacklog = await this.getUserBacklog();
      const igdbIds = userBacklog.map(name => name.igdbId)

      console.log('userGameService.getUserBacklogWithGameDetails -> igdbIds', igdbIds);

      const games = await gameService.getGames(igdbIds);

      const backlogWithGameDetails = userBacklog.map((userGame) => {
        const game = games.find((games) => games.igdbId === userGame.igdbId); // find the game with the same igdbId, extra verification
        return { ...userGame, ...game }; //Get both the userGame and game details to fill the backlog list with users relationship data with game details data
       });
       console.log('userGameService.getUserBacklogWithGameDetails -> backlogWithGameDetails', backlogWithGameDetails);
       return backlogWithGameDetails;

      } catch (error) {
        console.error('Error getting user backlog with game details', error);
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