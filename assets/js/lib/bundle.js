(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var RecordCreator, features_layer, geojson_layer_options, map, map_utils, record_utils;

map_utils = require('./map_utils');

record_utils = require('./records/utils');

RecordCreator = require('./records/creator');

map = map_utils.createMap('map-container');

geojson_layer_options = {
  onEachFeature: function(feature, layer) {
    return layer.on('click', function() {
      return record_utils.showRecordData(feature);
    });
  }
};

features_layer = map_utils.createGeoJSONLayer(geojson_layer_options);

map.addLayer(features_layer);

record_utils.getRecords(function(error, records) {
  if (error) {
    console.log(error);
    return;
  }
  features_layer.addData(records);
  return map.fitBounds(features_layer.getBounds());
});

$('#new-record-a').on('click', function(event) {
  var record_creator;
  event.preventDefault();
  return record_creator = new RecordCreator();
});



},{"./map_utils":2,"./records/creator":4,"./records/utils":5}],2:[function(require,module,exports){
var createGeoJSONLayer, createMap, layer_configs, utils;

layer_configs = require('./layer_configs');

utils = require('../utils');

createMap = function(div_id, options) {
  var base_layers, map, map_options, satellite_layer, streets_layer;
  map_options = {
    center: [0, 0],
    zoom: 4,
    attributionControl: false
  };
  utils.extend(map_options, options);
  map = new L.Map(div_id, map_options);
  streets_layer = new L.TileLayer(layer_configs.mapbox_streets.url, layer_configs.mapbox_streets.options);
  satellite_layer = new L.TileLayer(layer_configs.mapbox_satellite.url, layer_configs.mapbox_satellite.options);
  map.addLayer(streets_layer);
  base_layers = {
    'Street': streets_layer,
    'Satellite': satellite_layer
  };
  L.control.layers(base_layers, null).addTo(map);
  return map;
};

createGeoJSONLayer = function(geojson_options) {
  var layer;
  layer = new L.GeoJSON(null, geojson_options);
  return layer;
};

module.exports = {
  createMap: createMap,
  createGeoJSONLayer: createGeoJSONLayer
};



},{"../utils":6,"./layer_configs":3}],3:[function(require,module,exports){
var layer_configs;

layer_configs = {
  mapbox_streets: {
    name: 'MapBox Streets',
    url: 'https://{s}.tiles.mapbox.com/v3/spatialnetworks.map-6l9yntw9/{z}/{x}/{y}.png',
    options: {
      attribution: "Tiles Courtesy of <a href='http://www.mapbox.com/' target='_blank'>MapBox</a> &mdash; <a target='_blank' href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a> 2014 <a target='_blank' href='http://openstreetmap.org'>OpenStreetMap.org</a> contributors",
      minZoom: 2,
      maxZoom: 19
    }
  },
  mapbox_satellite: {
    name: 'MapBox Satellite',
    url: 'https://api.tiles.mapbox.com/v3/spatialnetworks.map-xkumo5oi/{z}/{x}/{y}.png',
    options: {
      attribution: "Tiles Courtesy of <a href='http://www.mapbox.com/' target='_blank'>MapBox</a>",
      minZoom: 2,
      maxZoom: 19
    }
  }
};

module.exports = layer_configs;



},{}],4:[function(require,module,exports){
var Creator, map_utils;

map_utils = require('../map_utils');

Creator = (function() {
  function Creator() {
    this.$modal_container = $('#new-record-modal');
    this.$map_container = this.$modal_container.find('.new-record-map-container');
    this.init();
  }

  Creator.prototype.createMap = function() {
    return this.map = map_utils.createMap(this.$map_container[0], {
      zoomControl: false
    });
  };

  Creator.prototype.initEvents = function() {
    return this.$modal_container.on('shown.bs.modal', (function(_this) {
      return function(event) {
        return _this.createMap();
      };
    })(this));
  };

  Creator.prototype.init = function() {
    this.initEvents();
    return this.$modal_container.modal();
  };

  return Creator;

})();

module.exports = Creator;



},{"../map_utils":2}],5:[function(require,module,exports){
var getRecords, showRecordData, xhr;

xhr = require('xhr');

showRecordData = function(record_geojson) {
  return console.log(record_geojson);
};

getRecords = function(cb) {
  var xhr_callback, xhr_options;
  xhr_options = {
    uri: '/api/records',
    json: true
  };
  xhr_callback = function(error, response, records) {
    if (error) {
      return cb(error, null);
    } else {
      return cb(null, records);
    }
  };
  return xhr(xhr_options, xhr_callback);
};

module.exports = {
  showRecordData: showRecordData,
  getRecords: getRecords
};



},{"xhr":7}],6:[function(require,module,exports){
var extend;

extend = function(object, properties) {
  var key, val;
  for (key in properties) {
    val = properties[key];
    object[key] = val;
  }
  return object;
};

module.exports = {
  extend: extend
};



},{}],7:[function(require,module,exports){
var window = require("global/window")
var once = require("once")
var parseHeaders = require('parse-headers')

var messages = {
    "0": "Internal XMLHttpRequest Error",
    "4": "4xx Client Error",
    "5": "5xx Server Error"
}

var XHR = window.XMLHttpRequest || noop
var XDR = "withCredentials" in (new XHR()) ? XHR : window.XDomainRequest

module.exports = createXHR

function createXHR(options, callback) {
    if (typeof options === "string") {
        options = { uri: options }
    }

    options = options || {}
    callback = once(callback)

    var xhr = options.xhr || null

    if (!xhr) {
        if (options.cors || options.useXDR) {
            xhr = new XDR()
        }else{
            xhr = new XHR()
        }
    }

    var uri = xhr.url = options.uri || options.url;
    var method = xhr.method = options.method || "GET"
    var body = options.body || options.data
    var headers = xhr.headers = options.headers || {}
    var sync = !!options.sync
    var isJson = false
    var key
    var load = options.response ? loadResponse : loadXhr

    if ("json" in options) {
        isJson = true
        headers["Accept"] = "application/json"
        if (method !== "GET" && method !== "HEAD") {
            headers["Content-Type"] = "application/json"
            body = JSON.stringify(options.json)
        }
    }

    xhr.onreadystatechange = readystatechange
    xhr.onload = load
    xhr.onerror = error
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
    }
    // hate IE
    xhr.ontimeout = noop
    xhr.open(method, uri, !sync)
                                    //backward compatibility
    if (options.withCredentials || (options.cors && options.withCredentials !== false)) {
        xhr.withCredentials = true
    }

    // Cannot set timeout with sync request
    if (!sync) {
        xhr.timeout = "timeout" in options ? options.timeout : 5000
    }

    if (xhr.setRequestHeader) {
        for(key in headers){
            if(headers.hasOwnProperty(key)){
                xhr.setRequestHeader(key, headers[key])
            }
        }
    } else if (options.headers) {
        throw new Error("Headers cannot be set on an XDomainRequest object");
    }

    if ("responseType" in options) {
        xhr.responseType = options.responseType
    }
    
    if ("beforeSend" in options && 
        typeof options.beforeSend === "function"
    ) {
        options.beforeSend(xhr)
    }

    xhr.send(body)

    return xhr

    function readystatechange() {
        if (xhr.readyState === 4) {
            load()
        }
    }

    function getBody() {
        // Chrome with requestType=blob throws errors arround when even testing access to responseText
        var body = null

        if (xhr.response) {
            body = xhr.response
        } else if (xhr.responseType === 'text' || !xhr.responseType) {
            body = xhr.responseText || xhr.responseXML
        }

        if (isJson) {
            try {
                body = JSON.parse(body)
            } catch (e) {}
        }

        return body
    }

    function getStatusCode() {
        return xhr.status === 1223 ? 204 : xhr.status
    }

    // if we're getting a none-ok statusCode, build & return an error
    function errorFromStatusCode(status) {
        var error = null
        if (status === 0 || (status >= 400 && status < 600)) {
            var message = (typeof body === "string" ? body : false) ||
                messages[String(status).charAt(0)]
            error = new Error(message)
            error.statusCode = status
        };

        return error;
    }

    // will load the data & process the response in a special response object
    function loadResponse() {
        var status = getStatusCode();
        var error = errorFromStatusCode(status);
        var response = {
            body: getBody(),
            statusCode: status,
            statusText: xhr.statusText,
            headers: parseHeaders(xhr.getAllResponseHeaders())
        };

        callback(error, response, response.body);
    }

    // will load the data and add some response properties to the source xhr
    // and then respond with that
    function loadXhr() {
        var status = getStatusCode()
        var error = errorFromStatusCode(status)

        xhr.status = xhr.statusCode = status;
        xhr.body = getBody();

        callback(error, xhr, xhr.body);
    }

    function error(evt) {
        callback(evt, xhr)
    }
}


function noop() {}

},{"global/window":8,"once":9,"parse-headers":13}],8:[function(require,module,exports){
(function (global){
if (typeof window !== "undefined") {
    module.exports = window
} else if (typeof global !== "undefined") {
    module.exports = global
} else {
    module.exports = {}
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],9:[function(require,module,exports){
module.exports = once

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })
})

function once (fn) {
  var called = false
  return function () {
    if (called) return
    called = true
    return fn.apply(this, arguments)
  }
}

},{}],10:[function(require,module,exports){
var isFunction = require('is-function')

module.exports = forEach

var toString = Object.prototype.toString
var hasOwnProperty = Object.prototype.hasOwnProperty

function forEach(list, iterator, context) {
    if (!isFunction(iterator)) {
        throw new TypeError('iterator must be a function')
    }

    if (arguments.length < 3) {
        context = this
    }
    
    if (toString.call(list) === '[object Array]')
        forEachArray(list, iterator, context)
    else if (typeof list === 'string')
        forEachString(list, iterator, context)
    else
        forEachObject(list, iterator, context)
}

function forEachArray(array, iterator, context) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
            iterator.call(context, array[i], i, array)
        }
    }
}

function forEachString(string, iterator, context) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        iterator.call(context, string.charAt(i), i, string)
    }
}

function forEachObject(object, iterator, context) {
    for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
            iterator.call(context, object[k], k, object)
        }
    }
}

},{"is-function":11}],11:[function(require,module,exports){
module.exports = isFunction

var toString = Object.prototype.toString

function isFunction (fn) {
  var string = toString.call(fn)
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
};

},{}],12:[function(require,module,exports){

exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};

},{}],13:[function(require,module,exports){
var trim = require('trim')
  , forEach = require('for-each')

module.exports = function (headers) {
  if (!headers)
    return {}

  var result = {}

  forEach(
      trim(headers).split('\n')
    , function (row) {
        var index = row.indexOf(':')

        result[trim(row.slice(0, index)).toLowerCase()] =
          trim(row.slice(index + 1))
      }
  )

  return result
}
},{"for-each":10,"trim":12}]},{},[1])