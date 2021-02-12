// IMPORT MODULES
const request = require('request');

// FUNCTION IMPLEMENTATION
const fetchMyIp = callback => {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

const fetchCoordsByIp = (ip, callback) => {
  request('https://freegeoip.app/json/' + ip, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const latitude = JSON.parse(body).latitude;
    const longitude = JSON.parse(body).longitude;
    const coords = { latitude, longitude };
    callback(null, coords);
  });
};

const fetchISSFlyOverTimes = (coords, callback) => {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS pass times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const flyOver = JSON.parse(body).response;
    callback(null, flyOver);
  });
};

const nextISSTimesForMyLocation = (callback => {
  fetchMyIp((error, ip) => {
    if (error) {
      console.log("Failed to obtain IP");
    } else {
      fetchCoordsByIp(ip, (error, coords) => {
        if (error) {
          console.log("Failed to obtain coordinates");
        } else {
          fetchISSFlyOverTimes(coords, (error, flyOver) => {
            if (error) {
              console.log("Failed to obtain fly-overs.");
            } else {
              callback(null, flyOver);
            }
          });
        }
      });
    }
  });
});

// EXPORT MODULES
module.exports = {
  fetchMyIp,
  fetchCoordsByIp,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation
};