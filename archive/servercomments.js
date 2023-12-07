'use strict';
// Used John's code and worked with Lanah and Ecko to modify for lab requirements
// Pull data from a file (this will eventually be an API call...)
let weather = require('./data/weather.json');
// Use a library called "dotenv" to "read" my .env file
// And put all of the "key/value" pairs into an object called process.env
require('dotenv').config();
// Bring in the "express" library
const express = require('express');
// Bring in the "cors" library to let us have more open access to the server
const cors = require('cors');
// Initialize my express application
const app = express();
// Activate "cors"
app.use( cors() );
// Should be in the "enviornment"
const PORT = process.env.PORT || 5505;
// Route Handler
// "/" is the "route"
// (request, response) => {} is the handler callback

class Forecast {
    constructor(date, description) {
      this.date = date;
      this.description = description;
    }
}

// written using ChatGPT
function getForecastForCity(city) {
// Replace with your actual logic to fetch forecast data based on the city
return { date: '2023-12-06', description: 'Partly Cloudy' };
}

//home route (also use this for proof of life)
app.get('/', (request, response) => {
    let data = { message: "Goodbye World"};
    response.json(data);
});

//uncomment this section if want to test another method for proof of life)
// app.get('/', (request, response) => {
//     response.send('Hello World!');
// });

// Pretend we have an error ...
// e.g. tried to an API call and the API was not available
// or database didn't find the username
app.get('/broken', (request, response) => {
  throw new Error("Something is totally broken");
})

// used ChatGPT to troubleshoot this function
// then used ChatGPT to modify for class Forecast requirement
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
      // Assuming you have a function getForecastForCity that fetches the forecast data
      const forecastData = getForecastForCity(foundCity);
      
      // Create an instance of the Forecast class
      const forecast = new Forecast(forecastData.date, forecastData.description);
  
      // Send the city and forecast as part of the response
      response.json({ city: foundCity, forecast });
    } else {
      response.status(404).json({ error: "City not found" });
    }
  });
  

app.get("*", (request, response) => {
    response.status(404).send("Page Not Avaiable");
});
// Error Handler - 4 parameters to the callback
// Express automatically calls this when an error is "Thrown"
app.use( (error, request, response, next) => {
  response.status(500).send(error.message);
});
// Start up the web server
app.listen(
    PORT,
    () => console.log(`Listening on port ${PORT}`)
);