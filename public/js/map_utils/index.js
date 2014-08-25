var layer_configs = require('./layer_configs');

function createMap(div_id, options) {
  var map = new L.Map(div_id, {
    center: [0, 0],
    zoom: 4
  });

  streets_layer = new L.TileLayer(layer_configs.mapbox_streets.url, layer_configs.mapbox_streets.options);
  satellite_layer = new L.TileLayer(layer_configs.mapbox_satellite.url, layer_configs.mapbox_satellite.options);

  geojson_options = {};
  features = new L.GeoJSON(null, geojson_options);

  map.addLayer(streets_layer);
  map.addLayer(features);

  var base_layers = {
    'Street': streets_layer,
    'Satellite': satellite_layer
  };
  L.control.layers(base_layers, null).addTo(map);
  return map;
}

module.exports = {
  createMap: createMap
};