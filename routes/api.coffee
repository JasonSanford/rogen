express = require 'express'

Fulcrum = require 'fulcrum-app'

constants = require '../constants'
utils     = require '../utils'

fulcrum = new Fulcrum({api_key: constants.api_key})
router  = express.Router()

router.get '/form', (req, res) ->
  callback = (error, form) ->
    if error
      console.log "Error: #{error}"
      res.send 'Error'
    res.json form
  fulcrum.forms.find constants.form_id, callback

router.get '/records', (req, res) ->
  callback = (error, records) ->
    if error
      console.log "Error: #{error}"
      res.send 'Error'
    res.json records
  params =
    form_id: constants.form_id
  utils.extend params, req.query
  fulcrum.records.search params, callback

module.exports = router
