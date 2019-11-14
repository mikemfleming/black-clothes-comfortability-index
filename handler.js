'use strict';

const https = require('https');

const { DARK_SKY_API_KEY } = process.env;

module.exports.main = async ({ queryStringParameters: { lat, lng } }) => new Promise((resolve, reject) => {
  const request = https.get(
    `https://api.darksky.net/forecast/${DARK_SKY_API_KEY}/${lat},${lng}`,
    (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return resolve(new Error(`Status Code: ${res.statusCode}`));
      }

      const data = [];

      res.on('data', chunk => data.push(chunk));

      res.on('end', () => {
        const { currently } = JSON.parse(Buffer.concat(data).toString());
        resolve({
          body: currently,
          statusCode: 200
        });
      });
    }
  );

  request.on('error', resolve);

  request.end();
})
