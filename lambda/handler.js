'use strict';

const https = require('https');

const mockResponse = require('./mock-response.json')
const testing = false;
const { DARK_SKY_API_KEY } = process.env;

async function getWeather({ queryStringParameters: { lat, lng } }) {
  try {
    const { currently: currentConditions } = await request(
      `https://api.darksky.net/forecast/${DARK_SKY_API_KEY}/${lat},${lng}`
    );

    const index = calculateIndex(currentConditions);

    return respond({ index, currentConditions }, 200);
  } catch (e) {
    return respond(e.message, 500);
  }
}

function calculateIndex ({ temperature, uvIndex }) {
  let score = getUvIndex(uvIndex) + getTempIndex(temperature);
  
  return {
    score,
    rating: score > 13 ? 'soul crushing' : 'excellent'
  };
}

function getUvIndex(uv) {
  return uv;
}

function getTempIndex(t) {
  return t / 10;
}

function request (url) {
  return new Promise((resolve, reject) => {
      if (testing) {
        resolve(mockResponse);
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
