const envURL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXTAUTH_URL
    : 'http://localhost:3000';
const API_URL = `${envURL}/api/user-games`;

const userGameService = {
  async getUserGames() {
    try {
      const response = await fetch(`${API_URL}/play-pile`);
      // This should be an object map userGames
      // with igdb as key and object as value
      let data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting user play pile', error);
    }
  },

  async getUserGamesOnBoard() {
    try {
      const response = await fetch(`${API_URL}/board`);
      // This should be an object map of the user's play games with the key being the columnId
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting user games on board', error);
    }
  },

  async updateUserGameData(igdbId, fields) {
    const body = fields ? { ...fields } : {};

    try {
      const response = await fetch(`${API_URL}/${igdbId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json', // Set the content type
        },
        body: JSON.stringify(body), // Convert body to JSON string
      });
      return await response.json();
    } catch (error) {
      console.error(`Error updating user's game data`, error);
    }
  },

  async updateUserGameColumnPositions(updatedColumnUserGames) {
    const body = updatedColumnUserGames;
    try {
      const response = await fetch(`${API_URL}/board/column/update-positions`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json', // Set the content type
        },
        body: JSON.stringify(body), // Convert body to JSON string
      });
      return await response.json();
    } catch (error) {
      console.error(`Error updating game card positions in column ${error}`);
    }
  },
};

export default userGameService;
