(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/jasonsanford/code/blart/assets/js/src/main.coffee":[function(require,module,exports){
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



},{"./map_utils":"/Users/jasonsanford/code/blart/assets/js/src/map_utils/index.coffee","./records/creator":"/Users/jasonsanford/code/blart/assets/js/src/records/creator.coffee","./records/utils":"/Users/jasonsanford/code/blart/assets/js/src/records/utils.coffee"}],"/Users/jasonsanford/code/blart/assets/js/src/map_utils/index.coffee":[function(require,module,exports){
var createGeoJSONLayer, createMap, layer_configs;

layer_configs = require('./layer_configs');

createMap = function(div_id, options) {
  var base_layers, geojson_options, map, map_options, satellite_layer, streets_layer;
  map_options = {
    center: [0, 0],
    zoom: 4
  };
  map = new L.Map(div_id, map_options);
  streets_layer = new L.TileLayer(layer_configs.mapbox_streets.url, layer_configs.mapbox_streets.options);
  satellite_layer = new L.TileLayer(layer_configs.mapbox_satellite.url, layer_configs.mapbox_satellite.options);
  geojson_options = {};
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



},{}],"/Users/jasonsanford/code/blart/assets/js/src/records/creator.coffee":[function(require,module,exports){
var Creator;

Creator = (function() {
  function Creator() {
    this.creator_modal = $('#new-record-modal');
    this.init();
  }

  Creator.prototype.init = function() {
    return this.creator_modal.modal();
  };

  return Creator;

})();

module.exports = Creator;



},{}],"/Users/jasonsanford/code/blart/assets/js/src/records/utils.coffee":[function(require,module,exports){
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



},{"xhr":"/Users/jasonsanford/code/blart/node_modules/xhr/index.js"}],"/Users/jasonsanford/code/blart/node_modules/xhr/index.js":[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2phc29uc2FuZm9yZC9jb2RlL2JsYXJ0L2Fzc2V0cy9qcy9zcmMvbWFpbi5jb2ZmZWUiLCIvVXNlcnMvamFzb25zYW5mb3JkL2NvZGUvYmxhcnQvYXNzZXRzL2pzL3NyYy9tYXBfdXRpbHMvaW5kZXguY29mZmVlIiwiL1VzZXJzL2phc29uc2FuZm9yZC9jb2RlL2JsYXJ0L2Fzc2V0cy9qcy9zcmMvbWFwX3V0aWxzL2xheWVyX2NvbmZpZ3MuY29mZmVlIiwiL1VzZXJzL2phc29uc2FuZm9yZC9jb2RlL2JsYXJ0L2Fzc2V0cy9qcy9zcmMvcmVjb3Jkcy9jcmVhdG9yLmNvZmZlZSIsIi9Vc2Vycy9qYXNvbnNhbmZvcmQvY29kZS9ibGFydC9hc3NldHMvanMvc3JjL3JlY29yZHMvdXRpbHMuY29mZmVlIiwiL1VzZXJzL2phc29uc2FuZm9yZC9jb2RlL2JsYXJ0L25vZGVfbW9kdWxlcy94aHIvaW5kZXguanMiLCIvVXNlcnMvamFzb25zYW5mb3JkL2NvZGUvYmxhcnQvbm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvZ2xvYmFsL3dpbmRvdy5qcyIsIi9Vc2Vycy9qYXNvbnNhbmZvcmQvY29kZS9ibGFydC9ub2RlX21vZHVsZXMveGhyL25vZGVfbW9kdWxlcy9vbmNlL29uY2UuanMiLCIvVXNlcnMvamFzb25zYW5mb3JkL2NvZGUvYmxhcnQvbm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvcGFyc2UtaGVhZGVycy9ub2RlX21vZHVsZXMvZm9yLWVhY2gvaW5kZXguanMiLCIvVXNlcnMvamFzb25zYW5mb3JkL2NvZGUvYmxhcnQvbm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvcGFyc2UtaGVhZGVycy9ub2RlX21vZHVsZXMvZm9yLWVhY2gvbm9kZV9tb2R1bGVzL2lzLWZ1bmN0aW9uL2luZGV4LmpzIiwiL1VzZXJzL2phc29uc2FuZm9yZC9jb2RlL2JsYXJ0L25vZGVfbW9kdWxlcy94aHIvbm9kZV9tb2R1bGVzL3BhcnNlLWhlYWRlcnMvbm9kZV9tb2R1bGVzL3RyaW0vaW5kZXguanMiLCIvVXNlcnMvamFzb25zYW5mb3JkL2NvZGUvYmxhcnQvbm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvcGFyc2UtaGVhZGVycy9wYXJzZS1oZWFkZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSxrRkFBQTs7QUFBQSxTQUFBLEdBQWdCLE9BQUEsQ0FBUSxhQUFSLENBQWhCLENBQUE7O0FBQUEsWUFDQSxHQUFnQixPQUFBLENBQVEsaUJBQVIsQ0FEaEIsQ0FBQTs7QUFBQSxhQUVBLEdBQWdCLE9BQUEsQ0FBUSxtQkFBUixDQUZoQixDQUFBOztBQUFBLEdBSUEsR0FBTSxTQUFTLENBQUMsU0FBVixDQUFvQixlQUFwQixDQUpOLENBQUE7O0FBQUEscUJBTUEsR0FDRTtBQUFBLEVBQUEsYUFBQSxFQUFlLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtXQUNiLEtBQUssQ0FBQyxFQUFOLENBQVMsT0FBVCxFQUFrQixTQUFBLEdBQUE7YUFDaEIsWUFBWSxDQUFDLGNBQWIsQ0FBNEIsT0FBNUIsRUFEZ0I7SUFBQSxDQUFsQixFQURhO0VBQUEsQ0FBZjtDQVBGLENBQUE7O0FBQUEsY0FVQSxHQUFpQixTQUFTLENBQUMsa0JBQVYsQ0FBNkIscUJBQTdCLENBVmpCLENBQUE7O0FBQUEsR0FZRyxDQUFDLFFBQUosQ0FBYSxjQUFiLENBWkEsQ0FBQTs7QUFBQSxZQWNZLENBQUMsVUFBYixDQUF3QixTQUFDLEtBQUQsRUFBUSxPQUFSLEdBQUE7QUFDdEIsRUFBQSxJQUFHLEtBQUg7QUFDRSxJQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksS0FBWixDQUFBLENBQUE7QUFDQSxVQUFBLENBRkY7R0FBQTtBQUFBLEVBR0EsY0FBYyxDQUFDLE9BQWYsQ0FBdUIsT0FBdkIsQ0FIQSxDQUFBO1NBSUEsR0FBRyxDQUFDLFNBQUosQ0FBYyxjQUFjLENBQUMsU0FBZixDQUFBLENBQWQsRUFMc0I7QUFBQSxDQUF4QixDQWRBLENBQUE7O0FBQUEsQ0FxQkEsQ0FBRSxlQUFGLENBQWtCLENBQUMsRUFBbkIsQ0FBc0IsT0FBdEIsRUFBK0IsU0FBQyxLQUFELEdBQUE7QUFDN0IsTUFBQSxjQUFBO0FBQUEsRUFBQSxLQUFLLENBQUMsY0FBTixDQUFBLENBQUEsQ0FBQTtTQUNBLGNBQUEsR0FBcUIsSUFBQSxhQUFBLENBQUEsRUFGUTtBQUFBLENBQS9CLENBckJBLENBQUE7Ozs7O0FDQUEsSUFBQSw0Q0FBQTs7QUFBQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxpQkFBUixDQUFoQixDQUFBOztBQUFBLFNBRUEsR0FBWSxTQUFDLE1BQUQsRUFBUyxPQUFULEdBQUE7QUFDVixNQUFBLDhFQUFBO0FBQUEsRUFBQSxXQUFBLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFBUSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVI7QUFBQSxJQUNBLElBQUEsRUFBTSxDQUROO0dBREYsQ0FBQTtBQUFBLEVBR0EsR0FBQSxHQUFVLElBQUEsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxNQUFOLEVBQWMsV0FBZCxDQUhWLENBQUE7QUFBQSxFQUtBLGFBQUEsR0FBc0IsSUFBQSxDQUFDLENBQUMsU0FBRixDQUFZLGFBQWEsQ0FBQyxjQUFjLENBQUMsR0FBekMsRUFBZ0QsYUFBYSxDQUFDLGNBQWMsQ0FBQyxPQUE3RSxDQUx0QixDQUFBO0FBQUEsRUFNQSxlQUFBLEdBQXNCLElBQUEsQ0FBQyxDQUFDLFNBQUYsQ0FBWSxhQUFhLENBQUMsZ0JBQWdCLENBQUMsR0FBM0MsRUFBZ0QsYUFBYSxDQUFDLGdCQUFnQixDQUFDLE9BQS9FLENBTnRCLENBQUE7QUFBQSxFQVFBLGVBQUEsR0FBa0IsRUFSbEIsQ0FBQTtBQUFBLEVBVUEsR0FBRyxDQUFDLFFBQUosQ0FBYSxhQUFiLENBVkEsQ0FBQTtBQUFBLEVBWUEsV0FBQSxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsYUFBVjtBQUFBLElBQ0EsV0FBQSxFQUFhLGVBRGI7R0FiRixDQUFBO0FBQUEsRUFlQSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQVYsQ0FBaUIsV0FBakIsRUFBOEIsSUFBOUIsQ0FBbUMsQ0FBQyxLQUFwQyxDQUEwQyxHQUExQyxDQWZBLENBQUE7U0FnQkEsSUFqQlU7QUFBQSxDQUZaLENBQUE7O0FBQUEsa0JBcUJBLEdBQXFCLFNBQUMsZUFBRCxHQUFBO0FBQ25CLE1BQUEsS0FBQTtBQUFBLEVBQUEsS0FBQSxHQUFZLElBQUEsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLGVBQWhCLENBQVosQ0FBQTtTQUNBLE1BRm1CO0FBQUEsQ0FyQnJCLENBQUE7O0FBQUEsTUF5Qk0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxFQUFBLFNBQUEsRUFBcUIsU0FBckI7QUFBQSxFQUNBLGtCQUFBLEVBQXFCLGtCQURyQjtDQTFCRixDQUFBOzs7OztBQ0FBLElBQUEsYUFBQTs7QUFBQSxhQUFBLEdBQ0U7QUFBQSxFQUFBLGNBQUEsRUFBZ0I7QUFBQSxJQUNkLElBQUEsRUFBTSxnQkFEUTtBQUFBLElBRWQsR0FBQSxFQUFLLDhFQUZTO0FBQUEsSUFHZCxPQUFBLEVBQVM7QUFBQSxNQUNQLFdBQUEsRUFBYSx3UUFETjtBQUFBLE1BRVAsT0FBQSxFQUFTLENBRkY7QUFBQSxNQUdQLE9BQUEsRUFBUyxFQUhGO0tBSEs7R0FBaEI7QUFBQSxFQVNBLGdCQUFBLEVBQWtCO0FBQUEsSUFDaEIsSUFBQSxFQUFNLGtCQURVO0FBQUEsSUFFaEIsR0FBQSxFQUFLLDhFQUZXO0FBQUEsSUFHaEIsT0FBQSxFQUFTO0FBQUEsTUFDUCxXQUFBLEVBQWEsK0VBRE47QUFBQSxNQUVQLE9BQUEsRUFBUyxDQUZGO0FBQUEsTUFHUCxPQUFBLEVBQVMsRUFIRjtLQUhPO0dBVGxCO0NBREYsQ0FBQTs7QUFBQSxNQW9CTSxDQUFDLE9BQVAsR0FBaUIsYUFwQmpCLENBQUE7Ozs7O0FDQUEsSUFBQSxPQUFBOztBQUFBO0FBQ2UsRUFBQSxpQkFBQSxHQUFBO0FBQ1gsSUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixDQUFBLENBQUUsbUJBQUYsQ0FBakIsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQURBLENBRFc7RUFBQSxDQUFiOztBQUFBLG9CQUlBLElBQUEsR0FBTSxTQUFBLEdBQUE7V0FDSixJQUFDLENBQUEsYUFBYSxDQUFDLEtBQWYsQ0FBQSxFQURJO0VBQUEsQ0FKTixDQUFBOztpQkFBQTs7SUFERixDQUFBOztBQUFBLE1BUU0sQ0FBQyxPQUFQLEdBQWlCLE9BUmpCLENBQUE7Ozs7O0FDQUEsSUFBQSwrQkFBQTs7QUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVIsQ0FBTixDQUFBOztBQUFBLGNBRUEsR0FBaUIsU0FBQyxjQUFELEdBQUE7U0FDZixPQUFPLENBQUMsR0FBUixDQUFZLGNBQVosRUFEZTtBQUFBLENBRmpCLENBQUE7O0FBQUEsVUFLQSxHQUFhLFNBQUMsRUFBRCxHQUFBO0FBQ1gsTUFBQSx5QkFBQTtBQUFBLEVBQUEsV0FBQSxHQUNFO0FBQUEsSUFBQSxHQUFBLEVBQUssY0FBTDtBQUFBLElBQ0EsSUFBQSxFQUFNLElBRE47R0FERixDQUFBO0FBQUEsRUFHQSxZQUFBLEdBQWUsU0FBQyxLQUFELEVBQVEsUUFBUixFQUFrQixPQUFsQixHQUFBO0FBQ2IsSUFBQSxJQUFHLEtBQUg7YUFDRSxFQUFBLENBQUcsS0FBSCxFQUFVLElBQVYsRUFERjtLQUFBLE1BQUE7YUFHRSxFQUFBLENBQUcsSUFBSCxFQUFTLE9BQVQsRUFIRjtLQURhO0VBQUEsQ0FIZixDQUFBO1NBUUEsR0FBQSxDQUFJLFdBQUosRUFBaUIsWUFBakIsRUFUVztBQUFBLENBTGIsQ0FBQTs7QUFBQSxNQWdCTSxDQUFDLE9BQVAsR0FDRTtBQUFBLEVBQUEsY0FBQSxFQUFpQixjQUFqQjtBQUFBLEVBQ0EsVUFBQSxFQUFpQixVQURqQjtDQWpCRixDQUFBOzs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtYXBfdXRpbHMgICAgID0gcmVxdWlyZSAnLi9tYXBfdXRpbHMnXG5yZWNvcmRfdXRpbHMgID0gcmVxdWlyZSAnLi9yZWNvcmRzL3V0aWxzJ1xuUmVjb3JkQ3JlYXRvciA9IHJlcXVpcmUgJy4vcmVjb3Jkcy9jcmVhdG9yJ1xuXG5tYXAgPSBtYXBfdXRpbHMuY3JlYXRlTWFwICdtYXAtY29udGFpbmVyJ1xuXG5nZW9qc29uX2xheWVyX29wdGlvbnMgPVxuICBvbkVhY2hGZWF0dXJlOiAoZmVhdHVyZSwgbGF5ZXIpIC0+XG4gICAgbGF5ZXIub24gJ2NsaWNrJywgLT5cbiAgICAgIHJlY29yZF91dGlscy5zaG93UmVjb3JkRGF0YSBmZWF0dXJlXG5mZWF0dXJlc19sYXllciA9IG1hcF91dGlscy5jcmVhdGVHZW9KU09OTGF5ZXIgZ2VvanNvbl9sYXllcl9vcHRpb25zXG5cbm1hcC5hZGRMYXllciBmZWF0dXJlc19sYXllclxuXG5yZWNvcmRfdXRpbHMuZ2V0UmVjb3JkcyAoZXJyb3IsIHJlY29yZHMpIC0+XG4gIGlmIGVycm9yXG4gICAgY29uc29sZS5sb2cgZXJyb3JcbiAgICByZXR1cm5cbiAgZmVhdHVyZXNfbGF5ZXIuYWRkRGF0YSByZWNvcmRzXG4gIG1hcC5maXRCb3VuZHMgZmVhdHVyZXNfbGF5ZXIuZ2V0Qm91bmRzKClcblxuJCgnI25ldy1yZWNvcmQtYScpLm9uICdjbGljaycsIChldmVudCkgLT5cbiAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICByZWNvcmRfY3JlYXRvciA9IG5ldyBSZWNvcmRDcmVhdG9yKCkiLCJsYXllcl9jb25maWdzID0gcmVxdWlyZSAnLi9sYXllcl9jb25maWdzJ1xuXG5jcmVhdGVNYXAgPSAoZGl2X2lkLCBvcHRpb25zKSAtPlxuICBtYXBfb3B0aW9ucyA9XG4gICAgY2VudGVyOiBbMCwgMF1cbiAgICB6b29tOiA0XG4gIG1hcCA9IG5ldyBMLk1hcCBkaXZfaWQsIG1hcF9vcHRpb25zXG5cbiAgc3RyZWV0c19sYXllciAgID0gbmV3IEwuVGlsZUxheWVyIGxheWVyX2NvbmZpZ3MubWFwYm94X3N0cmVldHMudXJsLCAgIGxheWVyX2NvbmZpZ3MubWFwYm94X3N0cmVldHMub3B0aW9uc1xuICBzYXRlbGxpdGVfbGF5ZXIgPSBuZXcgTC5UaWxlTGF5ZXIgbGF5ZXJfY29uZmlncy5tYXBib3hfc2F0ZWxsaXRlLnVybCwgbGF5ZXJfY29uZmlncy5tYXBib3hfc2F0ZWxsaXRlLm9wdGlvbnNcblxuICBnZW9qc29uX29wdGlvbnMgPSB7fVxuICBcbiAgbWFwLmFkZExheWVyIHN0cmVldHNfbGF5ZXJcblxuICBiYXNlX2xheWVycyA9XG4gICAgJ1N0cmVldCc6IHN0cmVldHNfbGF5ZXIsXG4gICAgJ1NhdGVsbGl0ZSc6IHNhdGVsbGl0ZV9sYXllclxuICBMLmNvbnRyb2wubGF5ZXJzKGJhc2VfbGF5ZXJzLCBudWxsKS5hZGRUbyBtYXBcbiAgbWFwXG5cbmNyZWF0ZUdlb0pTT05MYXllciA9IChnZW9qc29uX29wdGlvbnMpIC0+XG4gIGxheWVyID0gbmV3IEwuR2VvSlNPTiBudWxsLCBnZW9qc29uX29wdGlvbnNcbiAgbGF5ZXJcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjcmVhdGVNYXAgICAgICAgICAgOiBjcmVhdGVNYXBcbiAgY3JlYXRlR2VvSlNPTkxheWVyIDogY3JlYXRlR2VvSlNPTkxheWVyXG4iLCJsYXllcl9jb25maWdzID1cbiAgbWFwYm94X3N0cmVldHM6IHtcbiAgICBuYW1lOiAnTWFwQm94IFN0cmVldHMnXG4gICAgdXJsOiAnaHR0cHM6Ly97c30udGlsZXMubWFwYm94LmNvbS92My9zcGF0aWFsbmV0d29ya3MubWFwLTZsOXludHc5L3t6fS97eH0ve3l9LnBuZydcbiAgICBvcHRpb25zOiB7XG4gICAgICBhdHRyaWJ1dGlvbjogXCJUaWxlcyBDb3VydGVzeSBvZiA8YSBocmVmPSdodHRwOi8vd3d3Lm1hcGJveC5jb20vJyB0YXJnZXQ9J19ibGFuayc+TWFwQm94PC9hPiAmbWRhc2g7IDxhIHRhcmdldD0nX2JsYW5rJyBocmVmPSdodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS1zYS8yLjAvJz5DQy1CWS1TQTwvYT4gMjAxNCA8YSB0YXJnZXQ9J19ibGFuaycgaHJlZj0naHR0cDovL29wZW5zdHJlZXRtYXAub3JnJz5PcGVuU3RyZWV0TWFwLm9yZzwvYT4gY29udHJpYnV0b3JzXCIsXG4gICAgICBtaW5ab29tOiAyXG4gICAgICBtYXhab29tOiAxOVxuICAgIH1cbiAgfVxuICBtYXBib3hfc2F0ZWxsaXRlOiB7XG4gICAgbmFtZTogJ01hcEJveCBTYXRlbGxpdGUnXG4gICAgdXJsOiAnaHR0cHM6Ly9hcGkudGlsZXMubWFwYm94LmNvbS92My9zcGF0aWFsbmV0d29ya3MubWFwLXhrdW1vNW9pL3t6fS97eH0ve3l9LnBuZydcbiAgICBvcHRpb25zOiB7XG4gICAgICBhdHRyaWJ1dGlvbjogXCJUaWxlcyBDb3VydGVzeSBvZiA8YSBocmVmPSdodHRwOi8vd3d3Lm1hcGJveC5jb20vJyB0YXJnZXQ9J19ibGFuayc+TWFwQm94PC9hPlwiXG4gICAgICBtaW5ab29tOiAyXG4gICAgICBtYXhab29tOiAxOVxuICAgIH1cbiAgfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxheWVyX2NvbmZpZ3NcbiIsImNsYXNzIENyZWF0b3JcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQGNyZWF0b3JfbW9kYWwgPSAkKCcjbmV3LXJlY29yZC1tb2RhbCcpXG4gICAgQGluaXQoKVxuXG4gIGluaXQ6IC0+XG4gICAgQGNyZWF0b3JfbW9kYWwubW9kYWwoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IENyZWF0b3JcbiIsInhociA9IHJlcXVpcmUgJ3hocidcblxuc2hvd1JlY29yZERhdGEgPSAocmVjb3JkX2dlb2pzb24pIC0+XG4gIGNvbnNvbGUubG9nIHJlY29yZF9nZW9qc29uXG5cbmdldFJlY29yZHMgPSAoY2IpIC0+XG4gIHhocl9vcHRpb25zID1cbiAgICB1cmk6ICcvYXBpL3JlY29yZHMnXG4gICAganNvbjogdHJ1ZVxuICB4aHJfY2FsbGJhY2sgPSAoZXJyb3IsIHJlc3BvbnNlLCByZWNvcmRzKSAtPlxuICAgIGlmIGVycm9yXG4gICAgICBjYiBlcnJvciwgbnVsbFxuICAgIGVsc2VcbiAgICAgIGNiIG51bGwsIHJlY29yZHNcbiAgeGhyIHhocl9vcHRpb25zLCB4aHJfY2FsbGJhY2tcblxubW9kdWxlLmV4cG9ydHMgPVxuICBzaG93UmVjb3JkRGF0YSA6IHNob3dSZWNvcmREYXRhXG4gIGdldFJlY29yZHMgICAgIDogZ2V0UmVjb3Jkc1xuIiwidmFyIHdpbmRvdyA9IHJlcXVpcmUoXCJnbG9iYWwvd2luZG93XCIpXG52YXIgb25jZSA9IHJlcXVpcmUoXCJvbmNlXCIpXG52YXIgcGFyc2VIZWFkZXJzID0gcmVxdWlyZSgncGFyc2UtaGVhZGVycycpXG5cbnZhciBtZXNzYWdlcyA9IHtcbiAgICBcIjBcIjogXCJJbnRlcm5hbCBYTUxIdHRwUmVxdWVzdCBFcnJvclwiLFxuICAgIFwiNFwiOiBcIjR4eCBDbGllbnQgRXJyb3JcIixcbiAgICBcIjVcIjogXCI1eHggU2VydmVyIEVycm9yXCJcbn1cblxudmFyIFhIUiA9IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCB8fCBub29wXG52YXIgWERSID0gXCJ3aXRoQ3JlZGVudGlhbHNcIiBpbiAobmV3IFhIUigpKSA/IFhIUiA6IHdpbmRvdy5YRG9tYWluUmVxdWVzdFxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVhIUlxuXG5mdW5jdGlvbiBjcmVhdGVYSFIob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgb3B0aW9ucyA9IHsgdXJpOiBvcHRpb25zIH1cbiAgICB9XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgIGNhbGxiYWNrID0gb25jZShjYWxsYmFjaylcblxuICAgIHZhciB4aHIgPSBvcHRpb25zLnhociB8fCBudWxsXG5cbiAgICBpZiAoIXhocikge1xuICAgICAgICBpZiAob3B0aW9ucy5jb3JzIHx8IG9wdGlvbnMudXNlWERSKSB7XG4gICAgICAgICAgICB4aHIgPSBuZXcgWERSKClcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB4aHIgPSBuZXcgWEhSKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciB1cmkgPSB4aHIudXJsID0gb3B0aW9ucy51cmkgfHwgb3B0aW9ucy51cmw7XG4gICAgdmFyIG1ldGhvZCA9IHhoci5tZXRob2QgPSBvcHRpb25zLm1ldGhvZCB8fCBcIkdFVFwiXG4gICAgdmFyIGJvZHkgPSBvcHRpb25zLmJvZHkgfHwgb3B0aW9ucy5kYXRhXG4gICAgdmFyIGhlYWRlcnMgPSB4aHIuaGVhZGVycyA9IG9wdGlvbnMuaGVhZGVycyB8fCB7fVxuICAgIHZhciBzeW5jID0gISFvcHRpb25zLnN5bmNcbiAgICB2YXIgaXNKc29uID0gZmFsc2VcbiAgICB2YXIga2V5XG4gICAgdmFyIGxvYWQgPSBvcHRpb25zLnJlc3BvbnNlID8gbG9hZFJlc3BvbnNlIDogbG9hZFhoclxuXG4gICAgaWYgKFwianNvblwiIGluIG9wdGlvbnMpIHtcbiAgICAgICAgaXNKc29uID0gdHJ1ZVxuICAgICAgICBoZWFkZXJzW1wiQWNjZXB0XCJdID0gXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgICAgaWYgKG1ldGhvZCAhPT0gXCJHRVRcIiAmJiBtZXRob2QgIT09IFwiSEVBRFwiKSB7XG4gICAgICAgICAgICBoZWFkZXJzW1wiQ29udGVudC1UeXBlXCJdID0gXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeShvcHRpb25zLmpzb24pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gcmVhZHlzdGF0ZWNoYW5nZVxuICAgIHhoci5vbmxvYWQgPSBsb2FkXG4gICAgeGhyLm9uZXJyb3IgPSBlcnJvclxuICAgIC8vIElFOSBtdXN0IGhhdmUgb25wcm9ncmVzcyBiZSBzZXQgdG8gYSB1bmlxdWUgZnVuY3Rpb24uXG4gICAgeGhyLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIElFIG11c3QgZGllXG4gICAgfVxuICAgIC8vIGhhdGUgSUVcbiAgICB4aHIub250aW1lb3V0ID0gbm9vcFxuICAgIHhoci5vcGVuKG1ldGhvZCwgdXJpLCAhc3luYylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgIGlmIChvcHRpb25zLndpdGhDcmVkZW50aWFscyB8fCAob3B0aW9ucy5jb3JzICYmIG9wdGlvbnMud2l0aENyZWRlbnRpYWxzICE9PSBmYWxzZSkpIHtcbiAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWVcbiAgICB9XG5cbiAgICAvLyBDYW5ub3Qgc2V0IHRpbWVvdXQgd2l0aCBzeW5jIHJlcXVlc3RcbiAgICBpZiAoIXN5bmMpIHtcbiAgICAgICAgeGhyLnRpbWVvdXQgPSBcInRpbWVvdXRcIiBpbiBvcHRpb25zID8gb3B0aW9ucy50aW1lb3V0IDogNTAwMFxuICAgIH1cblxuICAgIGlmICh4aHIuc2V0UmVxdWVzdEhlYWRlcikge1xuICAgICAgICBmb3Ioa2V5IGluIGhlYWRlcnMpe1xuICAgICAgICAgICAgaWYoaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcbiAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihrZXksIGhlYWRlcnNba2V5XSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkhlYWRlcnMgY2Fubm90IGJlIHNldCBvbiBhbiBYRG9tYWluUmVxdWVzdCBvYmplY3RcIik7XG4gICAgfVxuXG4gICAgaWYgKFwicmVzcG9uc2VUeXBlXCIgaW4gb3B0aW9ucykge1xuICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gb3B0aW9ucy5yZXNwb25zZVR5cGVcbiAgICB9XG4gICAgXG4gICAgaWYgKFwiYmVmb3JlU2VuZFwiIGluIG9wdGlvbnMgJiYgXG4gICAgICAgIHR5cGVvZiBvcHRpb25zLmJlZm9yZVNlbmQgPT09IFwiZnVuY3Rpb25cIlxuICAgICkge1xuICAgICAgICBvcHRpb25zLmJlZm9yZVNlbmQoeGhyKVxuICAgIH1cblxuICAgIHhoci5zZW5kKGJvZHkpXG5cbiAgICByZXR1cm4geGhyXG5cbiAgICBmdW5jdGlvbiByZWFkeXN0YXRlY2hhbmdlKCkge1xuICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICAgIGxvYWQoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Qm9keSgpIHtcbiAgICAgICAgLy8gQ2hyb21lIHdpdGggcmVxdWVzdFR5cGU9YmxvYiB0aHJvd3MgZXJyb3JzIGFycm91bmQgd2hlbiBldmVuIHRlc3RpbmcgYWNjZXNzIHRvIHJlc3BvbnNlVGV4dFxuICAgICAgICB2YXIgYm9keSA9IG51bGxcblxuICAgICAgICBpZiAoeGhyLnJlc3BvbnNlKSB7XG4gICAgICAgICAgICBib2R5ID0geGhyLnJlc3BvbnNlXG4gICAgICAgIH0gZWxzZSBpZiAoeGhyLnJlc3BvbnNlVHlwZSA9PT0gJ3RleHQnIHx8ICF4aHIucmVzcG9uc2VUeXBlKSB7XG4gICAgICAgICAgICBib2R5ID0geGhyLnJlc3BvbnNlVGV4dCB8fCB4aHIucmVzcG9uc2VYTUxcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0pzb24pIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYm9keSA9IEpTT04ucGFyc2UoYm9keSlcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYm9keVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFN0YXR1c0NvZGUoKSB7XG4gICAgICAgIHJldHVybiB4aHIuc3RhdHVzID09PSAxMjIzID8gMjA0IDogeGhyLnN0YXR1c1xuICAgIH1cblxuICAgIC8vIGlmIHdlJ3JlIGdldHRpbmcgYSBub25lLW9rIHN0YXR1c0NvZGUsIGJ1aWxkICYgcmV0dXJuIGFuIGVycm9yXG4gICAgZnVuY3Rpb24gZXJyb3JGcm9tU3RhdHVzQ29kZShzdGF0dXMpIHtcbiAgICAgICAgdmFyIGVycm9yID0gbnVsbFxuICAgICAgICBpZiAoc3RhdHVzID09PSAwIHx8IChzdGF0dXMgPj0gNDAwICYmIHN0YXR1cyA8IDYwMCkpIHtcbiAgICAgICAgICAgIHZhciBtZXNzYWdlID0gKHR5cGVvZiBib2R5ID09PSBcInN0cmluZ1wiID8gYm9keSA6IGZhbHNlKSB8fFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VzW1N0cmluZyhzdGF0dXMpLmNoYXJBdCgwKV1cbiAgICAgICAgICAgIGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UpXG4gICAgICAgICAgICBlcnJvci5zdGF0dXNDb2RlID0gc3RhdHVzXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgIH1cblxuICAgIC8vIHdpbGwgbG9hZCB0aGUgZGF0YSAmIHByb2Nlc3MgdGhlIHJlc3BvbnNlIGluIGEgc3BlY2lhbCByZXNwb25zZSBvYmplY3RcbiAgICBmdW5jdGlvbiBsb2FkUmVzcG9uc2UoKSB7XG4gICAgICAgIHZhciBzdGF0dXMgPSBnZXRTdGF0dXNDb2RlKCk7XG4gICAgICAgIHZhciBlcnJvciA9IGVycm9yRnJvbVN0YXR1c0NvZGUoc3RhdHVzKTtcbiAgICAgICAgdmFyIHJlc3BvbnNlID0ge1xuICAgICAgICAgICAgYm9keTogZ2V0Qm9keSgpLFxuICAgICAgICAgICAgc3RhdHVzQ29kZTogc3RhdHVzLFxuICAgICAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHQsXG4gICAgICAgICAgICBoZWFkZXJzOiBwYXJzZUhlYWRlcnMoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKVxuICAgICAgICB9O1xuXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCByZXNwb25zZSwgcmVzcG9uc2UuYm9keSk7XG4gICAgfVxuXG4gICAgLy8gd2lsbCBsb2FkIHRoZSBkYXRhIGFuZCBhZGQgc29tZSByZXNwb25zZSBwcm9wZXJ0aWVzIHRvIHRoZSBzb3VyY2UgeGhyXG4gICAgLy8gYW5kIHRoZW4gcmVzcG9uZCB3aXRoIHRoYXRcbiAgICBmdW5jdGlvbiBsb2FkWGhyKCkge1xuICAgICAgICB2YXIgc3RhdHVzID0gZ2V0U3RhdHVzQ29kZSgpXG4gICAgICAgIHZhciBlcnJvciA9IGVycm9yRnJvbVN0YXR1c0NvZGUoc3RhdHVzKVxuXG4gICAgICAgIHhoci5zdGF0dXMgPSB4aHIuc3RhdHVzQ29kZSA9IHN0YXR1cztcbiAgICAgICAgeGhyLmJvZHkgPSBnZXRCb2R5KCk7XG5cbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIHhociwgeGhyLmJvZHkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVycm9yKGV2dCkge1xuICAgICAgICBjYWxsYmFjayhldnQsIHhocilcbiAgICB9XG59XG5cblxuZnVuY3Rpb24gbm9vcCgpIHt9XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gd2luZG93XG59IGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGdsb2JhbFxufSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHt9XG59XG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIm1vZHVsZS5leHBvcnRzID0gb25jZVxuXG5vbmNlLnByb3RvID0gb25jZShmdW5jdGlvbiAoKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGdW5jdGlvbi5wcm90b3R5cGUsICdvbmNlJywge1xuICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gb25jZSh0aGlzKVxuICAgIH0sXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pXG59KVxuXG5mdW5jdGlvbiBvbmNlIChmbikge1xuICB2YXIgY2FsbGVkID0gZmFsc2VcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoY2FsbGVkKSByZXR1cm5cbiAgICBjYWxsZWQgPSB0cnVlXG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgfVxufVxuIiwidmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKCdpcy1mdW5jdGlvbicpXG5cbm1vZHVsZS5leHBvcnRzID0gZm9yRWFjaFxuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5XG5cbmZ1bmN0aW9uIGZvckVhY2gobGlzdCwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAoIWlzRnVuY3Rpb24oaXRlcmF0b3IpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2l0ZXJhdG9yIG11c3QgYmUgYSBmdW5jdGlvbicpXG4gICAgfVxuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7XG4gICAgICAgIGNvbnRleHQgPSB0aGlzXG4gICAgfVxuICAgIFxuICAgIGlmICh0b1N0cmluZy5jYWxsKGxpc3QpID09PSAnW29iamVjdCBBcnJheV0nKVxuICAgICAgICBmb3JFYWNoQXJyYXkobGlzdCwgaXRlcmF0b3IsIGNvbnRleHQpXG4gICAgZWxzZSBpZiAodHlwZW9mIGxpc3QgPT09ICdzdHJpbmcnKVxuICAgICAgICBmb3JFYWNoU3RyaW5nKGxpc3QsIGl0ZXJhdG9yLCBjb250ZXh0KVxuICAgIGVsc2VcbiAgICAgICAgZm9yRWFjaE9iamVjdChsaXN0LCBpdGVyYXRvciwgY29udGV4dClcbn1cblxuZnVuY3Rpb24gZm9yRWFjaEFycmF5KGFycmF5LCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnJheS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChhcnJheSwgaSkpIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgYXJyYXlbaV0sIGksIGFycmF5KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmb3JFYWNoU3RyaW5nKHN0cmluZywgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc3RyaW5nLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIC8vIG5vIHN1Y2ggdGhpbmcgYXMgYSBzcGFyc2Ugc3RyaW5nLlxuICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHN0cmluZy5jaGFyQXQoaSksIGksIHN0cmluZylcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZvckVhY2hPYmplY3Qob2JqZWN0LCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGZvciAodmFyIGsgaW4gb2JqZWN0KSB7XG4gICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgaykpIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqZWN0W2tdLCBrLCBvYmplY3QpXG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGlzRnVuY3Rpb25cblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uIChmbikge1xuICB2YXIgc3RyaW5nID0gdG9TdHJpbmcuY2FsbChmbilcbiAgcmV0dXJuIHN0cmluZyA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJyB8fFxuICAgICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicgJiYgc3RyaW5nICE9PSAnW29iamVjdCBSZWdFeHBdJykgfHxcbiAgICAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgLy8gSUU4IGFuZCBiZWxvd1xuICAgICAoZm4gPT09IHdpbmRvdy5zZXRUaW1lb3V0IHx8XG4gICAgICBmbiA9PT0gd2luZG93LmFsZXJ0IHx8XG4gICAgICBmbiA9PT0gd2luZG93LmNvbmZpcm0gfHxcbiAgICAgIGZuID09PSB3aW5kb3cucHJvbXB0KSlcbn07XG4iLCJcbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHRyaW07XG5cbmZ1bmN0aW9uIHRyaW0oc3RyKXtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKnxcXHMqJC9nLCAnJyk7XG59XG5cbmV4cG9ydHMubGVmdCA9IGZ1bmN0aW9uKHN0cil7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyovLCAnJyk7XG59O1xuXG5leHBvcnRzLnJpZ2h0ID0gZnVuY3Rpb24oc3RyKXtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXHMqJC8sICcnKTtcbn07XG4iLCJ2YXIgdHJpbSA9IHJlcXVpcmUoJ3RyaW0nKVxuICAsIGZvckVhY2ggPSByZXF1aXJlKCdmb3ItZWFjaCcpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGhlYWRlcnMpIHtcbiAgaWYgKCFoZWFkZXJzKVxuICAgIHJldHVybiB7fVxuXG4gIHZhciByZXN1bHQgPSB7fVxuXG4gIGZvckVhY2goXG4gICAgICB0cmltKGhlYWRlcnMpLnNwbGl0KCdcXG4nKVxuICAgICwgZnVuY3Rpb24gKHJvdykge1xuICAgICAgICB2YXIgaW5kZXggPSByb3cuaW5kZXhPZignOicpXG5cbiAgICAgICAgcmVzdWx0W3RyaW0ocm93LnNsaWNlKDAsIGluZGV4KSkudG9Mb3dlckNhc2UoKV0gPVxuICAgICAgICAgIHRyaW0ocm93LnNsaWNlKGluZGV4ICsgMSkpXG4gICAgICB9XG4gIClcblxuICByZXR1cm4gcmVzdWx0XG59Il19
