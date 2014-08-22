var xhr = require('xhr');

function success (error, response, body) {
  console.log(body);
}

xhr({
  url: '/api/form',
  json: true
}, success);
