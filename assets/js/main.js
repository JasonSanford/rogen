var xhr = require('xhr');

var map_utils = require('./map_utils');

/*
function success (error, response, body) {
  console.log(body);
}

xhr({
  url: '/api/form',
  json: true
}, success);
*/

var map = map_utils.createMap('map-container');
