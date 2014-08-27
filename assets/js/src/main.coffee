map_utils     = require './map_utils'
record_utils  = require './records/utils'
RecordCreator = require './records/creator'

map = map_utils.createMap 'map-container'

geojson_layer_options =
  onEachFeature: (feature, layer) ->
    layer.on 'click', ->
      record_utils.showRecordData feature
features_layer = map_utils.createGeoJSONLayer geojson_layer_options

map.addLayer features_layer

record_utils.getRecords (error, records) ->
  if error
    console.log error
    return
  features_layer.addData records
  map.fitBounds features_layer.getBounds()

$('#new-record-a').on 'click', (event) ->
  event.preventDefault()
  record_creator = new RecordCreator()