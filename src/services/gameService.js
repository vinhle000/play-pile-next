const envURL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_NEXTAUTH_URL
    : 'http://localhost:3000';
const API_URL = `${envURL}/api/games`;

const gameService = {
  // Search for games on IGDB
  async searchIgdbGames(searchTerm) {
    try {
      const response = await fetch(
        `${API_URL}/search?q=${encodeURIComponent(searchTerm)}`,
      );
      const searchResult = await response.json();
      if (searchResult && Array.isArray(searchResult)) {
        console.log(searchResult);
      } else {
        console.error('Unexpected response format:', searchResult);
      }
      return await searchResult;
    } catch (error) {
      console.error('Error searching IGDB for games:', error);
    }
  },

  async getGameById(igdbId) {
    try {
      const response = await fetch(`${API_URL}/${igdbId}`);
      return await response.json();
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

      const games = await response.json();
      if (games && Array.isArray(games)) {
        console.log(games);
      } else {
        console.error('Unexpected response format:', response.data);
      }
      return games;
    } catch (error) {
      console.error(error);
    }
  },
};

export default gameService;
