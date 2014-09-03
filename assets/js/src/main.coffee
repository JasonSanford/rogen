async = require 'async'

Form          = require './form'
Record        = require './record'
map_utils     = require './map_utils'
form_utils    = require './form_utils'
record_utils  = require './records/utils'
RecordViewer  = require './records/viewer'
RecordCreator = require './records/creator'

jQuery.fn.serializeObject = ->
  arrayData = @serializeArray()
  objectData = {}

  $.each arrayData, ->
    if @value?
      value = @value
    else
      value = ''

    if objectData[@name]?
      unless objectData[@name].push
        objectData[@name] = [objectData[@name]]

      objectData[@name].push value
    else
      objectData[@name] = value

  return objectData

map = map_utils.createMap 'map-container'

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

nameApp = (app_name) ->
  document.title = app_name
  $('#brand').text app_name

formAndRecordsCallback = (error, results) ->
  if error
    console.log error
    return

  form_json = results.form
  records   = results.records

  form = new Form form_json

  nameApp form.name()

  geojson_layer_options =
    onEachFeature: (feature, layer) ->
      layer.on 'click', ->
        record = new Record feature, form
        record_display = new RecordViewer form, record
  features_layer = map_utils.createGeoJSONLayer geojson_layer_options

  map.addLayer features_layer

  features_layer.addData records
  map.fitBounds features_layer.getBounds()

  $('#new-record-a').on 'click', (event) ->
    event.preventDefault()
    record_creator = new RecordCreator form

async.parallel {form: getForm, records: getRecords}, formAndRecordsCallback
