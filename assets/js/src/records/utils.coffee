xhr = require 'xhr'

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
  getRecords: getRecords
