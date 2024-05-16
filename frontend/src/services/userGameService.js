import axios from 'axios'
import gameService from './gameService'

const envURL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_REACT_APP_URL : 'http://localhost:8000';
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/userGames`;

const userGameService = {

  async getUserPlayPileGames() {
    try {
      const response = await axios.get(`${API_URL}/playPile`, { withCredentials: true});
         if (response.data && Array.isArray(response.data.items)) {
           console.log(response.data.items);
         } else {
          console.error('Unexpected response format:', response.data);
         }
      return response.data;
    } catch (error) {
      console.error('Error getting user play pile', error);
    }
  },

  async getUserGameByColumnIds(columnIds) {
    const body = { columnIds: columnIds };
    try {
      const response = await axios.post(`${API_URL}/column/`, body, { withCredentials: true });
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