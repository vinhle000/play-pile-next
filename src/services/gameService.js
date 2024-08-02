const envURL =
  process.env.NODE_ENV === 'prod'
    ? process.env.NODE_ENV
    : 'http://localhost:3000';
const API_URL = `${envURL}/api/games`;

const gameService = {
  // Search for games on IGDB
  async searchIgdbGames(searchTerm) {
    try {
      const response = await fetch(
        `${API_URL}/search?q=${encodeURIComponent(searchTerm)}`,
      );
      if (response.data && Array.isArray(response.data)) {
        console.log(response.data.items);
      } else {
        console.error('Unexpected response format:', response.data);
      }
      return response.data;
    } catch (error) {
      console.error('Error searching IGDB for games:', error);
    }
  },

  async getGameById(igdbId) {
    try {
      const response = await fetch(`${API_URL}/${igdbId}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getGames(igdbIds) {
    try {
      const response = await fetch(`${API_URL}/list/`, {
        method: 'POST',
        body: { igdbIds },
      });
      //TODO: Maybe change the 'games/query' to 'games/list' and use GET with path params
      if (response.data && Array.isArray(response.data.items)) {
        console.log(response.data.items);
      } else {
        console.error('Unexpected response format:', response.data);
      }
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};

export default gameService;
