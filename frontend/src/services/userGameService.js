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
      if (!userBacklog?.length) {
        console.log('User has no items in backlog');
        return [];
      }

      const igdbIds = userBacklog.map(userGame => userGame.igdbId);
      const games = await gameService.getGames(igdbIds);
      if (!games?.length) {
        console.log('No games found for user backlog');
        return [];
      }


      console.log({userBacklog, igdbIds, games})
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


  // async addGameToBacklog(igdbId) {
  //   const requestBody = {
  //     isInBacklog: true,
  //   };

  //   try {
  //     const response = await axios.put(`${API_URL}/backlog/${igdbId}`, requestBody, { withCredentials: true });
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error adding game to backlog', error);
  //   }
  // },

  // async removeGameFromBacklog(igdbId) {
  //   const requestBody = {
  //     isInBacklog: false,
  //   };

  //   try {
  //     const response = await axios.delete(`${API_URL}/backlog/${igdbId}`, requestBody, { withCredentials: true });
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error removing game from backlog', error);
  //   }
  // },

  async updateUserGameData(igdbId, fields) {
    const requestBody = fields ? { ...fields, } : {};

    try {
      const response = await axios.patch(`${API_URL}/${igdbId}`, fields, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error(`Error updating user's game data`, error);
    }
  }
};

export default userGameService;