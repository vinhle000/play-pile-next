const axios = require('axios');

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
      console.error(`Error retrieving token for IGDB api access ${error}`);
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
        timeout: 10000,
      });
    } catch (error) {
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
        console.log('IGDB API request timed out after 10sec');
        return [];

      } else {
        console.error(`Error in IGDB API request ${error}`);
        throw new Error('Error in IGDB API request');
      }
    }
  }

  async fetchGames(igdbGameIds) {
    const ids = igdbGameIds.join(',');
    const query = `fields *; where id = (${ids});`;
    const response = await this.makeIGDBRequest(query);
    return response.data;
  }

  //TODO: Refactor to use query to get specific fields of the games
  async fetchGamesBySearchTerm(searchTerm) {
    const query = `search "${searchTerm}"; fields name, summary, release_dates.human, first_release_date, genres.name, platforms.name, cover.image_id, artworks.url, screenshots.url, videos.video_id, rating, rating_count;
    where rating >= 60 & rating_count > 10;`

    try {
      const response = await this.makeIGDBRequest(query);
      if (response.data) {
        return response.data;
      } else {
        console.warn(`Error in search IGDB API request ${response}`);
        return [];
      }

    } catch (error) {
        console.error(`Error in search IGDB API request ${error}`);
        throw new Error('Error in search IGDB API request');
      }
  }
  /*
  NOTE: Size options available for images
    cover_small	90 x 128	Fit
    screenshot_med	569 x 320	Lfill, Center gravity
    cover_big	264 x 374	Fit
    logo_med	284 x 160	Fit
    screenshot_big	889 x 500	Lfill, Center gravity
    screenshot_huge	1280 x 720	Lfill, Center gravity
    thumb	90 x 90	Thumb, Center gravity
    micro	35 x 35	Thumb, Center gravity
    720p	1280 x 720	Fit, Center gravity
    1080p	1920 x 1080	Fit, Center gravity
  */
  // Fetching cover image for a game tht is higher quality
  async fetchImage(size, igdbImageId) {

    try{
      const response = await axios({
        url: `https://images.igdb.com/igdb/image/upload/t_${size}/${igdbImageId}.jpg`,
        method: 'GET',
        headers: {
          'Client-ID': process.env.IGDB_CLIENT_ID,
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'text/plain',
        },
      });

      return response;


    } catch (error) {
      console.error(`Error in fetching image from IGDB API request ${error}`);
      throw new Error('Error in fetching image from IGDB API request');
    }
  }

}

module.exports = new IGDBWrapper();
