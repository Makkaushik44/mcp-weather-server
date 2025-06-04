const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors()); // Allow all origins (or pass options to restrict)
app.use(bodyParser.json());
const API_KEY = "190eeced00074b8c86350003250406";

app.post("/rpc", (req, res) => {
  const { jsonrpc, method, params, id } = req.body;

  if (method === "getWeather") {
    const location = params?.location || "Unknown";

    const getLiveWeather = async (location) => {
      const response = await axios.get(
        `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}&aqi=no`
      );

      const data = response.data;
      return {
        location: data.location.name,
        temperature: `${data.current.temp_c}°C`,
        condition: data.current.condition.text,
        humidity: `${data.current.humidity}%`,
        wind: `${data.current.wind_kph} km/h`,
      };
    };

    getLiveWeather(location)
      .then((weatherData) => {
        res.json({
          jsonrpc: "2.0",
          result: weatherData,
          id,
        });
      })
      .catch((err) => {
        res.json({
          jsonrpc: "2.0",
          error: {
            code: -32000,
            message: "Weather data fetch failed",
            data: err.toString(),
          },
          id,
        });
      });
  } else {
    res.json({
      jsonrpc: "2.0",
      error: {
        code: -32601,
        message: "Method not found",
      },
      id,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🌤️ MCP Weather Server running at http://localhost:${PORT}/rpc`);
});
