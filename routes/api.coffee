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
    geojson = recordsToFeatureCollection records
    res.json geojson
  params =
    form_id: constants.form_id
  utils.extend params, req.query
  fulcrum.records.search params, callback

recordsToFeatureCollection = (records) ->
  feature_collection =
    type         : 'FeatureCollection'
    features     : []
    current_page : records.current_page
    total_pages  : records.total_pages
    total_count  : records.total_count
    per_page     : records.per_page

  for record in records.records
    geometry =
      type        : 'Point'
      coordinates : [record.longitude, record.latitude]
    feature =
      type       : 'Feature'
      id         : record.id
      properties : record.form_values
      geometry   : geometry
    feature_collection.features.push feature

  feature_collection

module.exports = router
