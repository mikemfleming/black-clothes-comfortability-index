'use strict';

const https = require('https');

const testing = false;
const { DARK_SKY_API_KEY } = process.env;

async function getWeather({ queryStringParameters: { lat, lng } }) {
  try {
    const { currently: currentConditions } = await get(
      `https://api.darksky.net/forecast/${DARK_SKY_API_KEY}/${lat},${lng}`
    );

    const index = calculateIndex(currentConditions);

    return respond({ index, currentConditions }, 200);
  } catch (e) {
    return respond(e.message, 500);
  }
}

function calculateIndex ({ temperature, uvIndex }) {
  if ((uvIndex * 10 + temperature) > 90) {
    return 'soul crushing.';
  }
  return 'killer.';
}

function get (url) {
  return new Promise((resolve, reject) => {
      if (testing) {
        resolve({
          currently: {
            "testing": true,
            "time": 1573789150,
            "summary": "Clear",
            "icon": "clear-night",
            "nearestStormDistance": 30,
            "nearestStormBearing": 323,
            "precipIntensity": 0,
            "precipProbability": 0,
            "temperature": 37.66,
            "apparentTemperature": 37.82,
            "dewPoint": 37.05,
            "humidity": 0.98,
            "pressure": 1029.7,
            "windSpeed": 0.51,
            "windGust": 1.94,
            "windBearing": 267,
            "cloudCover": 0.02,
            "uvIndex": 0,
            "visibility": 5.371,
            "ozone": 286.6
          }
        });
      } else {
        let data = '';

        https.get(url, (response) => {
          response.on('data', chunk => data += chunk);
          response.on('end', () => resolve(JSON.parse(data)));
        }).on('error', e => reject(e));
      }
  });
}

function respond (data, statusCode) {
  return {
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    statusCode,
    body: JSON.stringify(data)
  };
}

exports.main = getWeather;
