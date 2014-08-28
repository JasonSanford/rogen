async = require 'async'

Form          = require './form'
map_utils     = require './map_utils'
form_utils    = require './form_utils'
record_utils  = require './records/utils'
RecordCreator = require './records/creator'

map = map_utils.createMap 'map-container'

geojson_layer_options =
  onEachFeature: (feature, layer) ->
    layer.on 'click', ->
      record_utils.showRecordData feature
features_layer = map_utils.createGeoJSONLayer geojson_layer_options

map.addLayer features_layer

getForm = (callback) ->
  form_utils.getForm (error, form) ->
    if error
      callback error
    else
      callback null, form

getRecords = (callback) ->
  record_utils.getRecords (error, records) ->
    if error
      callback error
    else
      callback null, records

formAndRecordsCallback = (error, results) ->
  if error
    console.log error
    return

  form_json = results[0]
  records   = results[1]

  form = new Form form_json

  features_layer.addData records
  map.fitBounds features_layer.getBounds()

  $('#new-record-a').on 'click', (event) ->
    event.preventDefault()
    record_creator = new RecordCreator(form)

async.parallel [getForm, getRecords], formAndRecordsCallback
