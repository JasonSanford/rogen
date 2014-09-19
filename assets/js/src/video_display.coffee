xhr = require 'xhr'

class VideoDisplay
  constructor: (@video_obj, @caption) ->

  render: ->
    xhr_options =
      uri: "/api/videos/#{@video_obj.video_id}"
      json: true
    xhr_callback = (error, response, video_obj) =>
      if error
        console.log error
        return
      video_html_parts = [
        "<a href='#{video_obj.video.original}' target='_blank'>",
        "<img src='#{video_obj.video.thumbnail_medium_square}' />",
        "</a>",
        "<p>#{@caption}</p>"
      ]
      $("#video-#{@video_obj.video_id}").html video_html_parts.join('')
    xhr xhr_options, xhr_callback

module.exports = VideoDisplay
