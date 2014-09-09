express = require 'express'
request = require 'request'

Fulcrum = require 'fulcrum-app'

constants = require '../constants'
utils     = require '../utils'

fulcrum = new Fulcrum({api_key: constants.api_key, url: 'https://edge.fulcrumapp.com/api/v2/'})
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
      res.send String(error), 500
    record_feature = recordToFeature record.record
    res.json record_feature
  fulcrum.records.create req.body, callback

router.post '/photos', (req, res) ->
  fulcrum_req = request('https://edge.fulcrumapp.com/api/v2/photos')
  fulcrum_req_headers =
    'X-ApiToken': constants.api_key
    'Accept': 'application/json'
  utils.extend fulcrum_req.headers, fulcrum_req_headers
  delete fulcrum_req.headers.cookie
  req.pipe(fulcrum_req)
  fulcrum_req.pipe(res)

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
    feature = recordToFeature record
    feature_collection.features.push feature

  feature_collection

recordToFeature = (record) ->
  geometry =
    type        : 'Point'
    coordinates : [record.longitude, record.latitude]
  feature =
    type       : 'Feature'
    id         : record.id
    properties : record.form_values
    geometry   : geometry
  feature

module.exports = router
