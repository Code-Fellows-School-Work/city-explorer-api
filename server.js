'use strict';

// used ChatGPT to reformat code and removed comments for readability. comments can be found in archive server.js

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

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
    const { city } = request.query;

    if (!city) {
      return response.status(400).json({ error: 'City parameter is required' });
    }

    const tmdbResponse = await axios.get(
      `https://api.themoviedb.org/3/discover/movie`,
      {
        params: {
          api_key: MOVIE_API_KEY,
          with_keywords: `${city}`,
        },
      }
    );

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

app.get('/weather', async (request, response) => {
  const { lat, lon } = request.query;

  try {
    const weatherResponse = await axios.get(
      `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}&days=2`
    );

    const forecastData = weatherResponse.data.data.map(day => ({
      date: day.datetime,
      description: day.weather.description,
    }));

    response.json({ forecast: forecastData });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    response.status(500).json({ error: 'Error fetching weather data' });
  }
});

app.get("/test", (request, response) => {
  response.send("Server is alive!");
});

app.get('/broken', (request, response) => {
  throw new Error("Something is totally broken");
});

app.get("*", (request, response) => {
  response.status(404).send("Page Not Available");
});

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// ----------------- //

// Handler Function //
