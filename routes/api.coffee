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

router.post '/records', (req, res) ->
  callback = (error, record) ->
    if error
      console.log "Error: #{error}"
      res.send 'Error'
    res.json record

  body = req.body

  latitude  = body.latitude
  longitude = body.longitude
  delete body.latitude
  delete body.longitude

  record_to_create =
    form_id: constants.form_id
    latitude: latitude
    longitude: longitude
    form_values: body
  record_to_create =
    record: record_to_create
  fulcrum.records.create record_to_create, callback

router.get '/photos/:photo_id', (req, res) ->
  callback = (error, photo) ->
    if error
      console.log "Error: #{error}"
      res.send 'Error'
    res.json photo
  fulcrum.photos.find req.params.photo_id, callback

router.get '/classification_sets/:classification_set_id', (req, res) ->
  callback = (error, classfication_set) ->
    if error
      console.log "Error: #{error}"
      res.send 'Error'
    res.json classfication_set
  fulcrum.classification_sets.find req.params.classification_set_id, callback

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
