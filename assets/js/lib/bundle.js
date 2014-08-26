(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/jasonsanford/code/blart/assets/js/src/main.coffee":[function(require,module,exports){
var map, map_utils, xhr;

xhr = require('xhr');

map_utils = require('./map_utils');

map = map_utils.createMap('map-container');



},{"./map_utils":"/Users/jasonsanford/code/blart/assets/js/src/map_utils/index.coffee","xhr":"/Users/jasonsanford/code/blart/node_modules/xhr/index.js"}],"/Users/jasonsanford/code/blart/assets/js/src/map_utils/index.coffee":[function(require,module,exports){
var createMap, layer_configs;

layer_configs = require('./layer_configs');

createMap = function(div_id, options) {
  var base_layers, features, geojson_options, map, map_options, satellite_layer, streets_layer;
  map_options = {
    center: [0, 0],
    zoom: 4
  };
  map = new L.Map(div_id, map_options);
  streets_layer = new L.TileLayer(layer_configs.mapbox_streets.url, layer_configs.mapbox_streets.options);
  satellite_layer = new L.TileLayer(layer_configs.mapbox_satellite.url, layer_configs.mapbox_satellite.options);
  geojson_options = {};
  features = new L.GeoJSON(null, geojson_options);
  map.addLayer(streets_layer);
  map.addLayer(features);
  base_layers = {
    'Street': streets_layer,
    'Satellite': satellite_layer
  };
  L.control.layers(base_layers, null).addTo(map);
  return map;
};

module.exports = {
  createMap: createMap
};



},{"./layer_configs":"/Users/jasonsanford/code/blart/assets/js/src/map_utils/layer_configs.coffee"}],"/Users/jasonsanford/code/blart/assets/js/src/map_utils/layer_configs.coffee":[function(require,module,exports){
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



},{}],"/Users/jasonsanford/code/blart/node_modules/xhr/index.js":[function(require,module,exports){
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

},{"global/window":"/Users/jasonsanford/code/blart/node_modules/xhr/node_modules/global/window.js","once":"/Users/jasonsanford/code/blart/node_modules/xhr/node_modules/once/once.js","parse-headers":"/Users/jasonsanford/code/blart/node_modules/xhr/node_modules/parse-headers/parse-headers.js"}],"/Users/jasonsanford/code/blart/node_modules/xhr/node_modules/global/window.js":[function(require,module,exports){
(function (global){
if (typeof window !== "undefined") {
    module.exports = window
} else if (typeof global !== "undefined") {
    module.exports = global
} else {
    module.exports = {}
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/Users/jasonsanford/code/blart/node_modules/xhr/node_modules/once/once.js":[function(require,module,exports){
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

},{}],"/Users/jasonsanford/code/blart/node_modules/xhr/node_modules/parse-headers/node_modules/for-each/index.js":[function(require,module,exports){
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

},{"is-function":"/Users/jasonsanford/code/blart/node_modules/xhr/node_modules/parse-headers/node_modules/for-each/node_modules/is-function/index.js"}],"/Users/jasonsanford/code/blart/node_modules/xhr/node_modules/parse-headers/node_modules/for-each/node_modules/is-function/index.js":[function(require,module,exports){
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

},{}],"/Users/jasonsanford/code/blart/node_modules/xhr/node_modules/parse-headers/node_modules/trim/index.js":[function(require,module,exports){

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

},{}],"/Users/jasonsanford/code/blart/node_modules/xhr/node_modules/parse-headers/parse-headers.js":[function(require,module,exports){
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
},{"for-each":"/Users/jasonsanford/code/blart/node_modules/xhr/node_modules/parse-headers/node_modules/for-each/index.js","trim":"/Users/jasonsanford/code/blart/node_modules/xhr/node_modules/parse-headers/node_modules/trim/index.js"}]},{},["/Users/jasonsanford/code/blart/assets/js/src/main.coffee"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2phc29uc2FuZm9yZC9jb2RlL2JsYXJ0L2Fzc2V0cy9qcy9zcmMvbWFpbi5jb2ZmZWUiLCIvVXNlcnMvamFzb25zYW5mb3JkL2NvZGUvYmxhcnQvYXNzZXRzL2pzL3NyYy9tYXBfdXRpbHMvaW5kZXguY29mZmVlIiwiL1VzZXJzL2phc29uc2FuZm9yZC9jb2RlL2JsYXJ0L2Fzc2V0cy9qcy9zcmMvbWFwX3V0aWxzL2xheWVyX2NvbmZpZ3MuY29mZmVlIiwiL1VzZXJzL2phc29uc2FuZm9yZC9jb2RlL2JsYXJ0L25vZGVfbW9kdWxlcy94aHIvaW5kZXguanMiLCIvVXNlcnMvamFzb25zYW5mb3JkL2NvZGUvYmxhcnQvbm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvZ2xvYmFsL3dpbmRvdy5qcyIsIi9Vc2Vycy9qYXNvbnNhbmZvcmQvY29kZS9ibGFydC9ub2RlX21vZHVsZXMveGhyL25vZGVfbW9kdWxlcy9vbmNlL29uY2UuanMiLCIvVXNlcnMvamFzb25zYW5mb3JkL2NvZGUvYmxhcnQvbm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvcGFyc2UtaGVhZGVycy9ub2RlX21vZHVsZXMvZm9yLWVhY2gvaW5kZXguanMiLCIvVXNlcnMvamFzb25zYW5mb3JkL2NvZGUvYmxhcnQvbm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvcGFyc2UtaGVhZGVycy9ub2RlX21vZHVsZXMvZm9yLWVhY2gvbm9kZV9tb2R1bGVzL2lzLWZ1bmN0aW9uL2luZGV4LmpzIiwiL1VzZXJzL2phc29uc2FuZm9yZC9jb2RlL2JsYXJ0L25vZGVfbW9kdWxlcy94aHIvbm9kZV9tb2R1bGVzL3BhcnNlLWhlYWRlcnMvbm9kZV9tb2R1bGVzL3RyaW0vaW5kZXguanMiLCIvVXNlcnMvamFzb25zYW5mb3JkL2NvZGUvYmxhcnQvbm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvcGFyc2UtaGVhZGVycy9wYXJzZS1oZWFkZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSxtQkFBQTs7QUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVIsQ0FBTixDQUFBOztBQUFBLFNBRUEsR0FBWSxPQUFBLENBQVEsYUFBUixDQUZaLENBQUE7O0FBQUEsR0FJQSxHQUFNLFNBQVMsQ0FBQyxTQUFWLENBQW9CLGVBQXBCLENBSk4sQ0FBQTs7Ozs7QUNBQSxJQUFBLHdCQUFBOztBQUFBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGlCQUFSLENBQWhCLENBQUE7O0FBQUEsU0FFQSxHQUFZLFNBQUMsTUFBRCxFQUFTLE9BQVQsR0FBQTtBQUNWLE1BQUEsd0ZBQUE7QUFBQSxFQUFBLFdBQUEsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUFRLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBUjtBQUFBLElBQ0EsSUFBQSxFQUFNLENBRE47R0FERixDQUFBO0FBQUEsRUFHQSxHQUFBLEdBQVUsSUFBQSxDQUFDLENBQUMsR0FBRixDQUFNLE1BQU4sRUFBYyxXQUFkLENBSFYsQ0FBQTtBQUFBLEVBS0EsYUFBQSxHQUFzQixJQUFBLENBQUMsQ0FBQyxTQUFGLENBQVksYUFBYSxDQUFDLGNBQWMsQ0FBQyxHQUF6QyxFQUFnRCxhQUFhLENBQUMsY0FBYyxDQUFDLE9BQTdFLENBTHRCLENBQUE7QUFBQSxFQU1BLGVBQUEsR0FBc0IsSUFBQSxDQUFDLENBQUMsU0FBRixDQUFZLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUEzQyxFQUFnRCxhQUFhLENBQUMsZ0JBQWdCLENBQUMsT0FBL0UsQ0FOdEIsQ0FBQTtBQUFBLEVBUUEsZUFBQSxHQUFrQixFQVJsQixDQUFBO0FBQUEsRUFTQSxRQUFBLEdBQWUsSUFBQSxDQUFDLENBQUMsT0FBRixDQUFVLElBQVYsRUFBZ0IsZUFBaEIsQ0FUZixDQUFBO0FBQUEsRUFXQSxHQUFHLENBQUMsUUFBSixDQUFhLGFBQWIsQ0FYQSxDQUFBO0FBQUEsRUFZQSxHQUFHLENBQUMsUUFBSixDQUFhLFFBQWIsQ0FaQSxDQUFBO0FBQUEsRUFjQSxXQUFBLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxhQUFWO0FBQUEsSUFDQSxXQUFBLEVBQWEsZUFEYjtHQWZGLENBQUE7QUFBQSxFQWlCQSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQVYsQ0FBaUIsV0FBakIsRUFBOEIsSUFBOUIsQ0FBbUMsQ0FBQyxLQUFwQyxDQUEwQyxHQUExQyxDQWpCQSxDQUFBO1NBa0JBLElBbkJVO0FBQUEsQ0FGWixDQUFBOztBQUFBLE1BdUJNLENBQUMsT0FBUCxHQUNFO0FBQUEsRUFBQSxTQUFBLEVBQVcsU0FBWDtDQXhCRixDQUFBOzs7OztBQ0FBLElBQUEsYUFBQTs7QUFBQSxhQUFBLEdBQ0U7QUFBQSxFQUFBLGNBQUEsRUFBZ0I7QUFBQSxJQUNkLElBQUEsRUFBTSxnQkFEUTtBQUFBLElBRWQsR0FBQSxFQUFLLDhFQUZTO0FBQUEsSUFHZCxPQUFBLEVBQVM7QUFBQSxNQUNQLFdBQUEsRUFBYSx3UUFETjtBQUFBLE1BRVAsT0FBQSxFQUFTLENBRkY7QUFBQSxNQUdQLE9BQUEsRUFBUyxFQUhGO0tBSEs7R0FBaEI7QUFBQSxFQVNBLGdCQUFBLEVBQWtCO0FBQUEsSUFDaEIsSUFBQSxFQUFNLGtCQURVO0FBQUEsSUFFaEIsR0FBQSxFQUFLLDhFQUZXO0FBQUEsSUFHaEIsT0FBQSxFQUFTO0FBQUEsTUFDUCxXQUFBLEVBQWEsK0VBRE47QUFBQSxNQUVQLE9BQUEsRUFBUyxDQUZGO0FBQUEsTUFHUCxPQUFBLEVBQVMsRUFIRjtLQUhPO0dBVGxCO0NBREYsQ0FBQTs7QUFBQSxNQW9CTSxDQUFDLE9BQVAsR0FBaUIsYUFwQmpCLENBQUE7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInhociA9IHJlcXVpcmUgJ3hocidcblxubWFwX3V0aWxzID0gcmVxdWlyZSAnLi9tYXBfdXRpbHMnXG5cbm1hcCA9IG1hcF91dGlscy5jcmVhdGVNYXAgJ21hcC1jb250YWluZXInXG4iLCJsYXllcl9jb25maWdzID0gcmVxdWlyZSAnLi9sYXllcl9jb25maWdzJ1xuXG5jcmVhdGVNYXAgPSAoZGl2X2lkLCBvcHRpb25zKSAtPlxuICBtYXBfb3B0aW9ucyA9XG4gICAgY2VudGVyOiBbMCwgMF1cbiAgICB6b29tOiA0XG4gIG1hcCA9IG5ldyBMLk1hcCBkaXZfaWQsIG1hcF9vcHRpb25zXG5cbiAgc3RyZWV0c19sYXllciAgID0gbmV3IEwuVGlsZUxheWVyIGxheWVyX2NvbmZpZ3MubWFwYm94X3N0cmVldHMudXJsLCAgIGxheWVyX2NvbmZpZ3MubWFwYm94X3N0cmVldHMub3B0aW9uc1xuICBzYXRlbGxpdGVfbGF5ZXIgPSBuZXcgTC5UaWxlTGF5ZXIgbGF5ZXJfY29uZmlncy5tYXBib3hfc2F0ZWxsaXRlLnVybCwgbGF5ZXJfY29uZmlncy5tYXBib3hfc2F0ZWxsaXRlLm9wdGlvbnNcblxuICBnZW9qc29uX29wdGlvbnMgPSB7fVxuICBmZWF0dXJlcyA9IG5ldyBMLkdlb0pTT04gbnVsbCwgZ2VvanNvbl9vcHRpb25zXG5cbiAgbWFwLmFkZExheWVyIHN0cmVldHNfbGF5ZXJcbiAgbWFwLmFkZExheWVyIGZlYXR1cmVzXG5cbiAgYmFzZV9sYXllcnMgPVxuICAgICdTdHJlZXQnOiBzdHJlZXRzX2xheWVyLFxuICAgICdTYXRlbGxpdGUnOiBzYXRlbGxpdGVfbGF5ZXJcbiAgTC5jb250cm9sLmxheWVycyhiYXNlX2xheWVycywgbnVsbCkuYWRkVG8gbWFwXG4gIG1hcFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNyZWF0ZU1hcDogY3JlYXRlTWFwXG4iLCJsYXllcl9jb25maWdzID1cbiAgbWFwYm94X3N0cmVldHM6IHtcbiAgICBuYW1lOiAnTWFwQm94IFN0cmVldHMnXG4gICAgdXJsOiAnaHR0cHM6Ly97c30udGlsZXMubWFwYm94LmNvbS92My9zcGF0aWFsbmV0d29ya3MubWFwLTZsOXludHc5L3t6fS97eH0ve3l9LnBuZydcbiAgICBvcHRpb25zOiB7XG4gICAgICBhdHRyaWJ1dGlvbjogXCJUaWxlcyBDb3VydGVzeSBvZiA8YSBocmVmPSdodHRwOi8vd3d3Lm1hcGJveC5jb20vJyB0YXJnZXQ9J19ibGFuayc+TWFwQm94PC9hPiAmbWRhc2g7IDxhIHRhcmdldD0nX2JsYW5rJyBocmVmPSdodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS1zYS8yLjAvJz5DQy1CWS1TQTwvYT4gMjAxNCA8YSB0YXJnZXQ9J19ibGFuaycgaHJlZj0naHR0cDovL29wZW5zdHJlZXRtYXAub3JnJz5PcGVuU3RyZWV0TWFwLm9yZzwvYT4gY29udHJpYnV0b3JzXCIsXG4gICAgICBtaW5ab29tOiAyXG4gICAgICBtYXhab29tOiAxOVxuICAgIH1cbiAgfVxuICBtYXBib3hfc2F0ZWxsaXRlOiB7XG4gICAgbmFtZTogJ01hcEJveCBTYXRlbGxpdGUnXG4gICAgdXJsOiAnaHR0cHM6Ly9hcGkudGlsZXMubWFwYm94LmNvbS92My9zcGF0aWFsbmV0d29ya3MubWFwLXhrdW1vNW9pL3t6fS97eH0ve3l9LnBuZydcbiAgICBvcHRpb25zOiB7XG4gICAgICBhdHRyaWJ1dGlvbjogXCJUaWxlcyBDb3VydGVzeSBvZiA8YSBocmVmPSdodHRwOi8vd3d3Lm1hcGJveC5jb20vJyB0YXJnZXQ9J19ibGFuayc+TWFwQm94PC9hPlwiXG4gICAgICBtaW5ab29tOiAyXG4gICAgICBtYXhab29tOiAxOVxuICAgIH1cbiAgfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxheWVyX2NvbmZpZ3NcbiIsInZhciB3aW5kb3cgPSByZXF1aXJlKFwiZ2xvYmFsL3dpbmRvd1wiKVxudmFyIG9uY2UgPSByZXF1aXJlKFwib25jZVwiKVxudmFyIHBhcnNlSGVhZGVycyA9IHJlcXVpcmUoJ3BhcnNlLWhlYWRlcnMnKVxuXG52YXIgbWVzc2FnZXMgPSB7XG4gICAgXCIwXCI6IFwiSW50ZXJuYWwgWE1MSHR0cFJlcXVlc3QgRXJyb3JcIixcbiAgICBcIjRcIjogXCI0eHggQ2xpZW50IEVycm9yXCIsXG4gICAgXCI1XCI6IFwiNXh4IFNlcnZlciBFcnJvclwiXG59XG5cbnZhciBYSFIgPSB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgfHwgbm9vcFxudmFyIFhEUiA9IFwid2l0aENyZWRlbnRpYWxzXCIgaW4gKG5ldyBYSFIoKSkgPyBYSFIgOiB3aW5kb3cuWERvbWFpblJlcXVlc3RcblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVYSFJcblxuZnVuY3Rpb24gY3JlYXRlWEhSKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7IHVyaTogb3B0aW9ucyB9XG4gICAgfVxuXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICBjYWxsYmFjayA9IG9uY2UoY2FsbGJhY2spXG5cbiAgICB2YXIgeGhyID0gb3B0aW9ucy54aHIgfHwgbnVsbFxuXG4gICAgaWYgKCF4aHIpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuY29ycyB8fCBvcHRpb25zLnVzZVhEUikge1xuICAgICAgICAgICAgeGhyID0gbmV3IFhEUigpXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgeGhyID0gbmV3IFhIUigpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgdXJpID0geGhyLnVybCA9IG9wdGlvbnMudXJpIHx8IG9wdGlvbnMudXJsO1xuICAgIHZhciBtZXRob2QgPSB4aHIubWV0aG9kID0gb3B0aW9ucy5tZXRob2QgfHwgXCJHRVRcIlxuICAgIHZhciBib2R5ID0gb3B0aW9ucy5ib2R5IHx8IG9wdGlvbnMuZGF0YVxuICAgIHZhciBoZWFkZXJzID0geGhyLmhlYWRlcnMgPSBvcHRpb25zLmhlYWRlcnMgfHwge31cbiAgICB2YXIgc3luYyA9ICEhb3B0aW9ucy5zeW5jXG4gICAgdmFyIGlzSnNvbiA9IGZhbHNlXG4gICAgdmFyIGtleVxuICAgIHZhciBsb2FkID0gb3B0aW9ucy5yZXNwb25zZSA/IGxvYWRSZXNwb25zZSA6IGxvYWRYaHJcblxuICAgIGlmIChcImpzb25cIiBpbiBvcHRpb25zKSB7XG4gICAgICAgIGlzSnNvbiA9IHRydWVcbiAgICAgICAgaGVhZGVyc1tcIkFjY2VwdFwiXSA9IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgIGlmIChtZXRob2QgIT09IFwiR0VUXCIgJiYgbWV0aG9kICE9PSBcIkhFQURcIikge1xuICAgICAgICAgICAgaGVhZGVyc1tcIkNvbnRlbnQtVHlwZVwiXSA9IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkob3B0aW9ucy5qc29uKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IHJlYWR5c3RhdGVjaGFuZ2VcbiAgICB4aHIub25sb2FkID0gbG9hZFxuICAgIHhoci5vbmVycm9yID0gZXJyb3JcbiAgICAvLyBJRTkgbXVzdCBoYXZlIG9ucHJvZ3Jlc3MgYmUgc2V0IHRvIGEgdW5pcXVlIGZ1bmN0aW9uLlxuICAgIHhoci5vbnByb2dyZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBJRSBtdXN0IGRpZVxuICAgIH1cbiAgICAvLyBoYXRlIElFXG4gICAgeGhyLm9udGltZW91dCA9IG5vb3BcbiAgICB4aHIub3BlbihtZXRob2QsIHVyaSwgIXN5bmMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2JhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAgICBpZiAob3B0aW9ucy53aXRoQ3JlZGVudGlhbHMgfHwgKG9wdGlvbnMuY29ycyAmJiBvcHRpb25zLndpdGhDcmVkZW50aWFscyAhPT0gZmFsc2UpKSB7XG4gICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlXG4gICAgfVxuXG4gICAgLy8gQ2Fubm90IHNldCB0aW1lb3V0IHdpdGggc3luYyByZXF1ZXN0XG4gICAgaWYgKCFzeW5jKSB7XG4gICAgICAgIHhoci50aW1lb3V0ID0gXCJ0aW1lb3V0XCIgaW4gb3B0aW9ucyA/IG9wdGlvbnMudGltZW91dCA6IDUwMDBcbiAgICB9XG5cbiAgICBpZiAoeGhyLnNldFJlcXVlc3RIZWFkZXIpIHtcbiAgICAgICAgZm9yKGtleSBpbiBoZWFkZXJzKXtcbiAgICAgICAgICAgIGlmKGhlYWRlcnMuaGFzT3duUHJvcGVydHkoa2V5KSl7XG4gICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCBoZWFkZXJzW2tleV0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuaGVhZGVycykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJIZWFkZXJzIGNhbm5vdCBiZSBzZXQgb24gYW4gWERvbWFpblJlcXVlc3Qgb2JqZWN0XCIpO1xuICAgIH1cblxuICAgIGlmIChcInJlc3BvbnNlVHlwZVwiIGluIG9wdGlvbnMpIHtcbiAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9IG9wdGlvbnMucmVzcG9uc2VUeXBlXG4gICAgfVxuICAgIFxuICAgIGlmIChcImJlZm9yZVNlbmRcIiBpbiBvcHRpb25zICYmIFxuICAgICAgICB0eXBlb2Ygb3B0aW9ucy5iZWZvcmVTZW5kID09PSBcImZ1bmN0aW9uXCJcbiAgICApIHtcbiAgICAgICAgb3B0aW9ucy5iZWZvcmVTZW5kKHhocilcbiAgICB9XG5cbiAgICB4aHIuc2VuZChib2R5KVxuXG4gICAgcmV0dXJuIHhoclxuXG4gICAgZnVuY3Rpb24gcmVhZHlzdGF0ZWNoYW5nZSgpIHtcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgICBsb2FkKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEJvZHkoKSB7XG4gICAgICAgIC8vIENocm9tZSB3aXRoIHJlcXVlc3RUeXBlPWJsb2IgdGhyb3dzIGVycm9ycyBhcnJvdW5kIHdoZW4gZXZlbiB0ZXN0aW5nIGFjY2VzcyB0byByZXNwb25zZVRleHRcbiAgICAgICAgdmFyIGJvZHkgPSBudWxsXG5cbiAgICAgICAgaWYgKHhoci5yZXNwb25zZSkge1xuICAgICAgICAgICAgYm9keSA9IHhoci5yZXNwb25zZVxuICAgICAgICB9IGVsc2UgaWYgKHhoci5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JyB8fCAheGhyLnJlc3BvbnNlVHlwZSkge1xuICAgICAgICAgICAgYm9keSA9IHhoci5yZXNwb25zZVRleHQgfHwgeGhyLnJlc3BvbnNlWE1MXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNKc29uKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGJvZHkgPSBKU09OLnBhcnNlKGJvZHkpXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJvZHlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTdGF0dXNDb2RlKCkge1xuICAgICAgICByZXR1cm4geGhyLnN0YXR1cyA9PT0gMTIyMyA/IDIwNCA6IHhoci5zdGF0dXNcbiAgICB9XG5cbiAgICAvLyBpZiB3ZSdyZSBnZXR0aW5nIGEgbm9uZS1vayBzdGF0dXNDb2RlLCBidWlsZCAmIHJldHVybiBhbiBlcnJvclxuICAgIGZ1bmN0aW9uIGVycm9yRnJvbVN0YXR1c0NvZGUoc3RhdHVzKSB7XG4gICAgICAgIHZhciBlcnJvciA9IG51bGxcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMCB8fCAoc3RhdHVzID49IDQwMCAmJiBzdGF0dXMgPCA2MDApKSB7XG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9ICh0eXBlb2YgYm9keSA9PT0gXCJzdHJpbmdcIiA/IGJvZHkgOiBmYWxzZSkgfHxcbiAgICAgICAgICAgICAgICBtZXNzYWdlc1tTdHJpbmcoc3RhdHVzKS5jaGFyQXQoMCldXG4gICAgICAgICAgICBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKVxuICAgICAgICAgICAgZXJyb3Iuc3RhdHVzQ29kZSA9IHN0YXR1c1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBlcnJvcjtcbiAgICB9XG5cbiAgICAvLyB3aWxsIGxvYWQgdGhlIGRhdGEgJiBwcm9jZXNzIHRoZSByZXNwb25zZSBpbiBhIHNwZWNpYWwgcmVzcG9uc2Ugb2JqZWN0XG4gICAgZnVuY3Rpb24gbG9hZFJlc3BvbnNlKCkge1xuICAgICAgICB2YXIgc3RhdHVzID0gZ2V0U3RhdHVzQ29kZSgpO1xuICAgICAgICB2YXIgZXJyb3IgPSBlcnJvckZyb21TdGF0dXNDb2RlKHN0YXR1cyk7XG4gICAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgICAgIGJvZHk6IGdldEJvZHkoKSxcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IHN0YXR1cyxcbiAgICAgICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0LFxuICAgICAgICAgICAgaGVhZGVyczogcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSlcbiAgICAgICAgfTtcblxuICAgICAgICBjYWxsYmFjayhlcnJvciwgcmVzcG9uc2UsIHJlc3BvbnNlLmJvZHkpO1xuICAgIH1cblxuICAgIC8vIHdpbGwgbG9hZCB0aGUgZGF0YSBhbmQgYWRkIHNvbWUgcmVzcG9uc2UgcHJvcGVydGllcyB0byB0aGUgc291cmNlIHhoclxuICAgIC8vIGFuZCB0aGVuIHJlc3BvbmQgd2l0aCB0aGF0XG4gICAgZnVuY3Rpb24gbG9hZFhocigpIHtcbiAgICAgICAgdmFyIHN0YXR1cyA9IGdldFN0YXR1c0NvZGUoKVxuICAgICAgICB2YXIgZXJyb3IgPSBlcnJvckZyb21TdGF0dXNDb2RlKHN0YXR1cylcblxuICAgICAgICB4aHIuc3RhdHVzID0geGhyLnN0YXR1c0NvZGUgPSBzdGF0dXM7XG4gICAgICAgIHhoci5ib2R5ID0gZ2V0Qm9keSgpO1xuXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCB4aHIsIHhoci5ib2R5KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlcnJvcihldnQpIHtcbiAgICAgICAgY2FsbGJhY2soZXZ0LCB4aHIpXG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHdpbmRvd1xufSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBnbG9iYWxcbn0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7fVxufVxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJtb2R1bGUuZXhwb3J0cyA9IG9uY2Vcblxub25jZS5wcm90byA9IG9uY2UoZnVuY3Rpb24gKCkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRnVuY3Rpb24ucHJvdG90eXBlLCAnb25jZScsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG9uY2UodGhpcylcbiAgICB9LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KVxufSlcblxuZnVuY3Rpb24gb25jZSAoZm4pIHtcbiAgdmFyIGNhbGxlZCA9IGZhbHNlXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGNhbGxlZCkgcmV0dXJuXG4gICAgY2FsbGVkID0gdHJ1ZVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gIH1cbn1cbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnaXMtZnVuY3Rpb24nKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvckVhY2hcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eVxuXG5mdW5jdGlvbiBmb3JFYWNoKGxpc3QsIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKCFpc0Z1bmN0aW9uKGl0ZXJhdG9yKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdpdGVyYXRvciBtdXN0IGJlIGEgZnVuY3Rpb24nKVxuICAgIH1cblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykge1xuICAgICAgICBjb250ZXh0ID0gdGhpc1xuICAgIH1cbiAgICBcbiAgICBpZiAodG9TdHJpbmcuY2FsbChsaXN0KSA9PT0gJ1tvYmplY3QgQXJyYXldJylcbiAgICAgICAgZm9yRWFjaEFycmF5KGxpc3QsIGl0ZXJhdG9yLCBjb250ZXh0KVxuICAgIGVsc2UgaWYgKHR5cGVvZiBsaXN0ID09PSAnc3RyaW5nJylcbiAgICAgICAgZm9yRWFjaFN0cmluZyhsaXN0LCBpdGVyYXRvciwgY29udGV4dClcbiAgICBlbHNlXG4gICAgICAgIGZvckVhY2hPYmplY3QobGlzdCwgaXRlcmF0b3IsIGNvbnRleHQpXG59XG5cbmZ1bmN0aW9uIGZvckVhY2hBcnJheShhcnJheSwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoYXJyYXksIGkpKSB7XG4gICAgICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIGFycmF5W2ldLCBpLCBhcnJheSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZm9yRWFjaFN0cmluZyhzdHJpbmcsIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHN0cmluZy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAvLyBubyBzdWNoIHRoaW5nIGFzIGEgc3BhcnNlIHN0cmluZy5cbiAgICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBzdHJpbmcuY2hhckF0KGkpLCBpLCBzdHJpbmcpXG4gICAgfVxufVxuXG5mdW5jdGlvbiBmb3JFYWNoT2JqZWN0KG9iamVjdCwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBmb3IgKHZhciBrIGluIG9iamVjdCkge1xuICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGspKSB7XG4gICAgICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9iamVjdFtrXSwgaywgb2JqZWN0KVxuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBpc0Z1bmN0aW9uXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcblxuZnVuY3Rpb24gaXNGdW5jdGlvbiAoZm4pIHtcbiAgdmFyIHN0cmluZyA9IHRvU3RyaW5nLmNhbGwoZm4pXG4gIHJldHVybiBzdHJpbmcgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXScgfHxcbiAgICAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nICYmIHN0cmluZyAhPT0gJ1tvYmplY3QgUmVnRXhwXScpIHx8XG4gICAgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgIC8vIElFOCBhbmQgYmVsb3dcbiAgICAgKGZuID09PSB3aW5kb3cuc2V0VGltZW91dCB8fFxuICAgICAgZm4gPT09IHdpbmRvdy5hbGVydCB8fFxuICAgICAgZm4gPT09IHdpbmRvdy5jb25maXJtIHx8XG4gICAgICBmbiA9PT0gd2luZG93LnByb21wdCkpXG59O1xuIiwiXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSB0cmltO1xuXG5mdW5jdGlvbiB0cmltKHN0cil7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyp8XFxzKiQvZywgJycpO1xufVxuXG5leHBvcnRzLmxlZnQgPSBmdW5jdGlvbihzdHIpe1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMqLywgJycpO1xufTtcblxuZXhwb3J0cy5yaWdodCA9IGZ1bmN0aW9uKHN0cil7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXFxzKiQvLCAnJyk7XG59O1xuIiwidmFyIHRyaW0gPSByZXF1aXJlKCd0cmltJylcbiAgLCBmb3JFYWNoID0gcmVxdWlyZSgnZm9yLWVhY2gnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChoZWFkZXJzKSB7XG4gIGlmICghaGVhZGVycylcbiAgICByZXR1cm4ge31cblxuICB2YXIgcmVzdWx0ID0ge31cblxuICBmb3JFYWNoKFxuICAgICAgdHJpbShoZWFkZXJzKS5zcGxpdCgnXFxuJylcbiAgICAsIGZ1bmN0aW9uIChyb3cpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gcm93LmluZGV4T2YoJzonKVxuXG4gICAgICAgIHJlc3VsdFt0cmltKHJvdy5zbGljZSgwLCBpbmRleCkpLnRvTG93ZXJDYXNlKCldID1cbiAgICAgICAgICB0cmltKHJvdy5zbGljZShpbmRleCArIDEpKVxuICAgICAgfVxuICApXG5cbiAgcmV0dXJuIHJlc3VsdFxufSJdfQ==
