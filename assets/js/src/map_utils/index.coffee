layer_configs = require './layer_configs'

createMap = (div_id, options) ->
  map_options =
    center: [0, 0]
    zoom: 4
  map = new L.Map div_id, map_options

  streets_layer   = new L.TileLayer layer_configs.mapbox_streets.url,   layer_configs.mapbox_streets.options
  satellite_layer = new L.TileLayer layer_configs.mapbox_satellite.url, layer_configs.mapbox_satellite.options

  geojson_options = {}
  
  map.addLayer streets_layer

  base_layers =
    'Street': streets_layer,
    'Satellite': satellite_layer
  L.control.layers(base_layers, null).addTo map
  map

createGeoJSONLayer = (geojson_options) ->
  layer = new L.GeoJSON null, geojson_options
  layer

module.exports =
  createMap          : createMap
  createGeoJSONLayer : createGeoJSONLayer
