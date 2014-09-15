xhr = require 'xhr'

class PhotoDisplay
  constructor: (@photo_obj, @caption) ->

  render: ->
    xhr_options =
      uri: "/api/photos/#{@photo_obj.photo_id}"
      json: true
    xhr_callback = (error, response, photo_obj) =>
      if error
        console.log error
        return
      photo_html_parts = [
        "<a href='#{photo_obj.photo.large}' target='_blank'>",
        "<img src='#{photo_obj.photo.thumbnail}' />",
        "</a>",
        "<p>#{@caption}</p>"
      ]
      $("#photo-#{@photo_obj.photo_id}").html photo_html_parts.join('')
    xhr xhr_options, xhr_callback

module.exports = PhotoDisplay
