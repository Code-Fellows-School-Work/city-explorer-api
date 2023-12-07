'use strict';

// used ChatGPT to reformat code and removed comments for readability. comments can be found in archive server.js
let weather = require('./data/weather.json');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const PORT = process.env.PORT || 5507;

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

app.get("/test", (request, response) => {
    response.send("Server is alive!");
  });

app.get('/broken', (request, response) => {
  throw new Error("Something is totally broken");
});

app.get("/weather", (request, response) => {
  let lat = parseFloat(request.query.lat);
  let lon = parseFloat(request.query.lon);
  let searchQuery = request.query.searchQuery;

  if (!lat || !lon || !searchQuery) {
    response.status(400).json({ error: "Missing required parameters" });
    return;
  }

  let foundCity = weather.find(city => (
    city.lat === lat &&
    city.lon === lon &&
    city.city_name.toLowerCase() === searchQuery.toLowerCase()
  ));

  if (foundCity) {
    const forecastData = getForecastForCity(foundCity);
    const forecast = new Forecast(forecastData.date, forecastData.description);
    response.json({ city: foundCity, forecast });
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

