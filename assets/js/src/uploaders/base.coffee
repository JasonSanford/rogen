uuid = require 'node-uuid'
xhr  = require 'xhr'

class Base
  constructor: (@field_key) ->

  mediaFormData: ->
    attrs =
      name: "#{@singular_name}[access_key]"
      value: uuid.v4()
    [attrs]

  mediaCount: ->
    @$uploads.find('.media').length

  init: ->
    @$container       = $("##{@field_key}")
    @$input_container = @$container.find '.input'
    @$uploads         = @$container.find '.uploads'
    @generateNewInput()

  renderMedia: (media_data) ->
    thumbnail_url = media_data["#{@thumbnail_key}"]
    access_key    = media_data.access_key
    html = "<div class='thumbnail media col-xs-6 col-md-3' data-access-key='#{access_key}'><img src='#{thumbnail_url}' /><input type='text' placeholder='Caption (optional)' class='caption form-control'></div>"
    @$uploads.append html

  generateNewInput: ->
    @$input_container.html ""
    @$input_container.html "<div class='add-media'><input type='file' accept='#{@media_accept};capture=camera' class='form-control media-upload' name='#{@singular_name}[file]'><a href='#add_media'><i class='glyphicon glyphicon-plus'></i>Add #{@singular_name}</a><div class='progress' style='display: none;'><div class='progress-bar' role='progressbar' style='width: 0%;'></div></div></div>"
    $input        = @$input_container.find '.media-upload'
    $progress     = @$input_container.find '.progress'
    $progress_bar = @$input_container.find '.progress-bar'
    $input.bind 'fileuploadprogress', (e, data) ->
      progress = parseInt(data.loaded / data.total * 100, 10)
      $progress.show()
      $progress_bar.css 'width', "#{progress}%"
    $input.fileupload({
      url       : "/api/#{@plural_name}"
      dataType  : 'json'
      formData  : @mediaFormData()
      paramName : "#{@singular_name}[file]"
      done      : (e, data) =>
        @renderMedia data.result["#{@singular_name}"]
        @generateNewInput()
    })
    $add_media_link = $input.siblings('a')
    $add_media_link.on 'click', (event) ->
      event.preventDefault()
      $input.trigger 'click'

  asJSON: ->
    @$uploads.find('.media').map((i, media) =>
      $media = $(media)
      obj =
        caption: $media.find('.caption').val() or ''
      obj["#{@singular_name}_id"] = $media.data('access-key')
      obj
    ).get()

module.exports = Base
