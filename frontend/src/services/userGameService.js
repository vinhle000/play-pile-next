import axios from 'axios'
import gameService from './gameService'

const API_URL = `${import.meta.env.VITE_REACT_APP_URL}/api/userGames`;

const userGameService = {

  async getUserPlayPileGames() {
    try {
      const response = await axios.get(`${API_URL}/playPile`, { withCredentials: true});
      return response.data;
    } catch (error) {
      console.error('Error getting user play pile', error);
    }
  },

  async getUserGameByColumnIds(columnIds) {
    const body = { columnIds: columnIds };
    try {
      const response = await axios.post(`${API_URL}/column/`, requestBody, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Error getting user game by column ids', error);
    }
  },

  async getUserGamesOnBoard() {
    try {
      const response = await axios.get(`${API_URL}/board`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Error getting user games on board', error);
    }
  },

  async updateUserGameData(igdbId, fields) {
    const body = fields ? { ...fields, } : {};
    try {
      const response = await axios.patch(`${API_URL}/${igdbId}`, body, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error(`Error updating user's game data`, error);
    }
  },

  async updateUserGameColumnPositions(updatedColumnUserGames) {
    const body = updatedColumnUserGames;
    try {
      const response = await axios.patch(`${API_URL}/board/column/updatePositions`, body, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error(`Error updating game card positions in column ${error}`)
    }
  },
};

export default userGameService;