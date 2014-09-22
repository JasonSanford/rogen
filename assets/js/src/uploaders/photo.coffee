Base = require './base'

class Photo extends Base
  singular_name : 'photo'
  plural_name   : 'photos'
  thumbnail_key : 'thumbnail'
  media_accept  : 'image/*'

module.exports = Photo
