// IMPORT MODULES
const request = require('request-promise-native');

// FUNCTION IMPLEMENTATION
const fetchMyIp = () => {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIp = body => {
  const ip = JSON.parse(body).ip;
  return request('https://freegeoip.app/json/' + ip);
};

const fetchISSFlyOverTimes = body => {
  const longitude = JSON.parse(body).longitude;
  const latitude = JSON.parse(body).latitude;
  return request(`http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`);
};

const nextISSTimesForMyLocation = () => {
  return fetchMyIp()
    .then(fetchCoordsByIp)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const response = JSON.parse(data).response;
      return response;
    });
};

// EXPORT MODULES
module.exports = {
  nextISSTimesForMyLocation
};