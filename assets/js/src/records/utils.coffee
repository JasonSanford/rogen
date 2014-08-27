xhr = require 'xhr'

showRecordData = (record_geojson) ->
  console.log record_geojson

getRecords = (cb) ->
  xhr_options =
    uri: '/api/records'
    json: true
  xhr_callback = (error, response, records) ->
    if error
      cb error, null
    else
      cb null, records
  xhr xhr_options, xhr_callback

module.exports =
  showRecordData : showRecordData
  getRecords     : getRecords
