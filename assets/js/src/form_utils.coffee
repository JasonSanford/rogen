xhr = require 'xhr'

getForm = (cb) ->
  xhr_options =
    uri: '/api/form'
    json: true
  xhr_callback = (error, response, records) ->
    if error
      cb error, null
    else
      cb null, records
  xhr xhr_options, xhr_callback

module.exports =
  getForm: getForm
