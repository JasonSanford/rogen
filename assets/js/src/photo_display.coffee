class PhotoDisplay
  constructor: (@photo_obj) ->\
    @init()

  init: ->
    console.log @photo_obj

  render: ->
    console.log 'Rendering'

module.exports = PhotoDisplay
