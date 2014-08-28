map_utils = require '../map_utils'

class Creator
  constructor: (@form) ->
    @$modal_container = $('#new-record-modal')
    @$map_container   = @$modal_container.find('.new-record-map-container')
    @init()

  createMap: ->
    @map = map_utils.createMap @$map_container[0], {zoomControl: false}

  initEvents: ->
    @$modal_container.on 'shown.bs.modal', (event) =>
      # We need to make sure animations are finished before creating the map
      @createMap()

  init: ->
    @initEvents()
    @$modal_container.modal()

module.exports = Creator
