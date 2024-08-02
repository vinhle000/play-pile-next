import gameService from './gameService';

/* TODO: ---------------------
[ ]  NEED to use fetch instead of axios for next.js transition
[ ] Remove old VITE_ENV refs
[ ] Create respective userGames context provider to utilize these api calls
*/
const envURL =
  process.env.NODE_ENV === 'prod'
    ? process.env.NODE_ENV
    : 'http://localhost:3000';
const API_URL = `${envURL}/api/user-games`;

const userGameService = {
  async getUserGames() {
    try {
      const response = await fetch(`${API_URL}/play-pile`);
      // This should be an object map of the user's play games with the key being the columnId
      return response.data;
    } catch (error) {
      console.error('Error getting user play pile', error);
    }
  },

  async getUserGameByColumnIds(columnIds) {
    const body = { columnIds: columnIds };
    try {
      const response = await fetch(`${API_URL}/column/`, {
        method: 'POST',
        body: body,
      });
      if (response.data && Array.isArray(response.data.items)) {
        console.log(response.data.items);
      } else {
        console.error('Unexpected response format:', response.data);
      }
      return response.data;
    } catch (error) {
      console.error('Error getting user game by column ids', error);
    }
  },

  async getUserGamesOnBoard() {
    try {
      const response = await fetch(`${API_URL}/board`);
      // This should be an object map of the user's play games with the key being the columnId
      return response.data;
    } catch (error) {
      console.error('Error getting user games on board', error);
    }
  },

  async updateUserGameData(igdbId, fields) {
    const body = fields ? { ...fields } : {};
    try {
      const response = await fetch(`${API_URL}/${igdbId}`, {
        method: 'PATCH',
        body: body,
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating user's game data`, error);
    }
  },

  async updateUserGameColumnPositions(updatedColumnUserGames) {
    const body = updatedColumnUserGames;
    try {
      const response = await axios.patch(
        `${API_URL}/board/column/update-positions`,
        {
          method: 'PATCH',
          body: body,
        },
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating game card positions in column ${error}`);
    }
  },
};

export default userGameService;
