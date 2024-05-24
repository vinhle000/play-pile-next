import axios from 'axios'
// Set withCredentials to true for all requests
axios.defaults.withCredentials = true;

const envURL = import.meta.env.VITE_ENV === 'prod' ? import.meta.env.VITE_REACT_APP_URL : 'http://localhost:8000';
const API_URL = `${envURL}/api/games`;

const gameService = {


  // Search for games on IGDB
  async searchIgdbGames(searchTerm) {
    try {
      const options = { withCredentials: true,}
      const response = await axios.get(`${API_URL}/search?q=${encodeURIComponent(searchTerm)}`, options);
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
      const response = await axios.get(`${API_URL}/${igdbId}`, {withCredentials: true});
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

   async getGames(igdbIds) {
        try {
      const options = {
        withCredentials: true,
      };
      const response = await axios.post(`${API_URL}/list/`, {igdbIds}, options);  //TODO: Maybe change the 'games/query' to 'games/list' and use GET with path params
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
