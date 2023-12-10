// server.js

'use strict';

// used ChatGPT to reformat code and removed comments for readability. comments can be found in archive server.js


const express = require('express');
const axios = require('axios');
const cors = require('cors');


const app = express();
app.use(cors());

// REACT_APP_API_KEY = pk.f7fa7627438ea5355a3aaafbf87cbb56
// REACT_APP_WEATHER_API_KEY = f413f1561d574d7c94eb852c125ab20d
// REACT_APP_MOVIE_API_KEY = bc2a219734f3bd7a32633ec396699d5a

app.get('/api/weather', async (req, res) => {
  const { lat, lon } = req.query;

  try {
    const weatherResponse = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=f413f1561d574d7c94eb852c125ab20d&days=2`);
    res.json(weatherResponse.data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});

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


const PORT = process.env.PORT || 5513;


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));


// Handler Function //

