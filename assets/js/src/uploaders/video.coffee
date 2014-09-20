Base = require './base'

class Video extends Base
  singular_name : 'video'
  plural_name   : 'videos'
  thumbnail_key : 'thumbnail_small_square'
  media_accept  : 'video/*'

module.exports = Video
