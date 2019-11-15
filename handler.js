'use strict';

const https = require('https');

const { DARK_SKY_API_KEY } = process.env;

async function getWeather({ queryStringParameters: { lat, lng } }) {
  try {
    const { currently } = await get(
      `https://api.darksky.net/forecast/${DARK_SKY_API_KEY}/${lat},${lng}`
    );

    return respond(currently, 200);
  } catch (e) {
    return respond(e.message, 500);
  }
}

function get (url) {
  return new Promise((resolve, reject) => {
    let data = '';

    https.get(url, (response) => {
      response.on('data', chunk => data += chunk);
      response.on('end', () => resolve(JSON.parse(data)));
    }).on('error', e => reject(e));
  });
}

function respond (data, statusCode) {
  return {
    statusCode,
    body: JSON.stringify(data)
  };
}

exports.main = getWeather;
