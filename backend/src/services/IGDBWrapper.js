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
      throw new Error('Error in IGDB API request');
    }
  }
å
  async fetchGames(igdbGameIds) {
    const ids = igdbGameIds.join(',');
    const query = `fields *; where id = (${ids});`;
    const response = await this.makeIGDBRequest(query);
    return response.data;
  }

  //TODO: Refactor to use query to get specific fields of the games
  async fetchGamesBySearchTerm(searchTerm) {
    logger.debug({searchTerm});
    const query = `search "${searchTerm}"; fields name, summary, release_dates.human, first_release_date, genres.name, platforms.name, cover.url, artworks.url, screenshots.url, videos.video_id, rating, rating_count;`;
    try {
      const response = await this.makeIGDBRequest(query);
      if (response.data) {
        return response.data;
      } else {
        // logger.warn(`Error in search IGDB API request ${response}`);
        return [];
      }

    } catch (error) {
        logger.error(`Error in search IGDB API request ${error}`);
        throw new Error('Error in search IGDB API request');
      }
  }
}

module.exports = IGDBWrapper;
