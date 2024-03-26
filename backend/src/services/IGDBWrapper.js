const axios = require('axios');
const logger = require('../../config/logger');

class IGDBWrapper {
  constructor() {
    this.token = null;
    this.tokenExpires = 0;
  }

  async fetchAuthToken() {
    if (this.token && Date.now() < this.tokenExpires) {
      return;
    }

    const config = {
      method: 'post',
      url: `https://id.twitch.tv/oauth2/token`,
      params: {
        client_id: process.env.IGDB_CLIENT_ID,
        client_secret: process.env.IGDB_CLIENT_SECRET,
        grant_type: 'client_credentials',
      },
    };

    try {
      const response = await axios(config);
      this.token = response.data.access_token;
      this.tokenExpires = Date.now() + response.data.expires_in * 1000;
    } catch (error) {
      logger.error(`Error retrieving token for IGDB api access ${error}`);
      // console.error("Error retrieving token for IGDB api access", error);
      throw new Error('Error retrieving token for IGDB API access');
    }
  }

  async makeIGDBRequest(query) {
    await this.fetchAuthToken();

    try {
      return await axios({
        url: 'https://api.igdb.com/v4/games',
        method: 'post',
        headers: {
          'Client-ID': process.env.IGDB_CLIENT_ID,
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'text/plain',
        },
        data: query,
      });
    } catch (error) {
      logger.error(`Error in IGDB API request ${error}`);
      // console.error("Error in IGDB API request", error);
      throw new Error('Error in IGDB API request');
    }
  }

  // async fetchGameById(igdbGameId) {
  //   const query = `fields name, cover.url, first_release_date, genres.name, platforms.name, rating, rating_count, summary; where id = (${igdbGameId});`;
  //   const response = await this.makeIGDBRequest(query);
  //   return response.data;
  // }

  //TODO: Refactor to use query to get specific fields of the games
  //  `fields name, cover.url, first_release_date, genres.name, platforms.name, rating, rating_count, summary; where id = (${igdbGameId});`;

  async fetchGames(igdbGameIds) {
    const ids = igdbGameIds.join(',');
    const query = `fields *; where id = (${ids});`;
    const response = await this.makeIGDBRequest(query);
    return response.data;
  }

  //TODO: Refactor to use query to get specific fields of the games
  async fetchGamesBySearchTerm(searchTerm) {
    const query = `search "${searchTerm}"; fields *;`;
    const response = await this.makeIGDBRequest(query);
    return response.data;
  }
}

module.exports = IGDBWrapper;
