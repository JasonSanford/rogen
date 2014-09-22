Base = require './base'

class Video extends Base
  singular_name : 'video'
  plural_name   : 'videos'
  thumbnail_key : 'thumbnail_small_square'
  media_accept  : 'video/*'

  #
  # Override base method because we probably don't have a thumbnail ready yet.
  # Show placeholder image instead.
  #
  renderMedia: (media_data) ->
    access_key = media_data.access_key
    html       = "<div class='thumbnail media col-xs-6 col-md-3' data-access-key='#{access_key}'><i class='glyphicon glyphicon-facetime-video'></i><input type='text' placeholder='Caption (optional)' class='caption form-control'></div>"
    @$uploads.append html

module.exports = Video
