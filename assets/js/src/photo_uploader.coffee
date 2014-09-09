uuid = require 'node-uuid'
xhr  = require 'xhr'

class PhotoUploader
  constructor: (@field_key) ->

  photoFormData: ->
    attrs =
      name: "photo[access_key]"
      value: uuid.v4()
    [attrs]

  photoCount: ->
    @$uploads.find('.photo').length

  init: ->
    @$container       = $("##{@field_key}")
    @$input_container = @$container.find '.input'
    @$uploads         = @$container.find '.uploads'
    @generateNewInput()

  renderPhoto: (photo_data) ->
    thumbnail_url = photo_data.thumbnail
    access_key    = photo_data.access_key
    html = "<div class='thumbnail photo col-xs-6 col-md-3' data-access-key='#{access_key}'><img src='#{thumbnail_url}' /></div>"
    @$uploads.append html

  generateNewInput: ->
    @$input_container.html ""
    @$input_container.html "<div class='add-photo'><input type='file' accept='image/*;capture=camera' class='form-control photo_upload' name='photo[file]'><a href='#add_photo'><i class='glyphicon glyphicon-plus'></i>Add photo</a></div>"
    $input = @$input_container.find('.photo_upload')
    $input.fileupload({
      url: '/api/photos'
      dataType: 'json'
      formData: @photoFormData()
      paramName: 'photo[file]'
      done: (e, data) =>
        @renderPhoto data.result.photo
        @generateNewInput()
    })
    $add_photo_link = $input.siblings('a')
    $add_photo_link.on 'click', (event) ->
      event.preventDefault()
      $input.trigger 'click'

  asJSON: ->
    @$uploads.find('.photo').map((i, photo) ->
      {
        photo_id: $(photo).data('access-key')
        caption: ''
      }
    ).get()

module.exports = PhotoUploader
