// server.js
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

app.get('/api/movies', async (req, res) => {
  const { cityName } = req.query;
 

  try {
    const moviesResponse = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${cityName}&api_key=bc2a219734f3bd7a32633ec396699d5a`);
    res.json(moviesResponse.data.results);
  } catch (error) {
    console.error('Error fetching movie data:', error);
    res.status(500).json({ error: 'Error fetching movie data' });
  }
});

app.get('/api/location', async (req, res) => {
  const { cityName } = req.query;

  try {
    const locationResponse = await axios.get(`https://us1.locationiq.com/v1/search?key=pk.f7fa7627438ea5355a3aaafbf87cbb56&q=${cityName}&format=json`);
    res.json(locationResponse.data);
  } catch (error) {
    console.error('Error fetching location data:', error);
    res.status(500).json({ error: 'Error fetching location data' });
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

const PORT = process.env.PORT || 5513;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
