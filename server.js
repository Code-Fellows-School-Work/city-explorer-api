'use strict';

// used ChatGPT to reformat code and removed comments for readability. comments can be found in archive server.js
let weather = require('./data/weather.json');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const PORT = process.env.PORT || 5511;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

function getForecastForCity(city) {
    const forecastData = city.data.map(day => {
        return new Forecast(day.datetime, day.weather.description);
    });

    return forecastData;
}

app.get('/movies', async (request, response) => {
    try {
      const { city, country } = request.query;
  
      if (!city || !country) {
        return response.status(400).json({ error: 'City parameters are required' });
      }
  
      // Make an Axios request to TMDb API to discover movies based on the city
      const tmdbResponse = await axios.get(
        `https://api.themoviedb.org/3/discover/movie`,
        {
          params: {
            api_key: MOVIE_API_KEY,
            with_keywords: `${city}`, // Use city as keyword for search
          },
        }
      );
  
      // Extract relevant movie information from the TMDb API response
      const moviesData = tmdbResponse.data.results.map(movie => ({
        title: movie.title,
        overview: movie.overview,
        average_votes: movie.vote_average,
        total_votes: movie.vote_count,
        image_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        popularity: movie.popularity,
        released_on: movie.release_date,
      }));
  
      response.json({ movies: moviesData });
    } catch (error) {
      console.error('Error fetching movie data:', error);
      response.status(500).json({ error: 'Error fetching movie data' });
    }
  });

app.get("/test", (request, response) => {
    response.send("Server is alive!");
  });

app.get('/broken', (request, response) => {
  throw new Error("Something is totally broken");
});

app.get("/weather", (request, response) => {
    const lat = parseFloat(request.query.lat);
    const lon = parseFloat(request.query.lon);
    const searchQuery = request.query.searchQuery;
  
    if (isNaN(lat) || isNaN(lon) || !searchQuery) {
      response.status(400).json({ error: "Invalid or missing parameters" });
      return;
    }
  
    const foundCity = weather.find(city => (
      city.lat === lat &&
      city.lon === lon &&
      city.city_name.toLowerCase() === searchQuery.toLowerCase()
    ));
  
    if (foundCity) {
      const forecastData = getForecastForCity(foundCity);
      response.json({ city: foundCity, forecast: forecastData });
    } else {
      response.status(404).json({ error: "City not found" });
    }
  });

app.get("*", (request, response) => {
  response.status(404).send("Page Not Available");
});

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));