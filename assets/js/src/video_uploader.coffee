uuid = require 'node-uuid'
xhr  = require 'xhr'

class VideoUploader
  constructor: (@field_key) ->

  videoFormData: ->
    attrs =
      name: "video[access_key]"
      value: uuid.v4()
    [attrs]

  videoCount: ->
    @$uploads.find('.video').length

  init: ->
    @$container       = $("##{@field_key}")
    @$input_container = @$container.find '.input'
    @$uploads         = @$container.find '.uploads'
    @generateNewInput()

  renderVideo: (video_data) ->
    thumbnail_url = video_data.thumbnail_small_square
    access_key    = video_data.access_key
    html = "<div class='thumbnail video col-xs-6 col-md-3' data-access-key='#{access_key}'><img src='#{thumbnail_url}' /><input type='text' placeholder='Caption (optional)' class='caption form-control'></div>"
    @$uploads.append html

  generateNewInput: ->
    @$input_container.html ""
    @$input_container.html "<div class='add-video'><input type='file' accept='video/*;capture=camera' class='form-control video_upload' name='video[file]'><a href='#add_video'><i class='glyphicon glyphicon-plus'></i>Add video</a><div class='progress' style='display: none;'><div class='progress-bar' role='progressbar' style='width: 0%;'></div></div></div>"
    $input        = @$input_container.find '.video_upload'
    $progress     = @$input_container.find '.progress'
    $progress_bar = @$input_container.find '.progress-bar'
    $input.bind 'fileuploadprogress', (e, data) ->
      progress = parseInt(data.loaded / data.total * 100, 10)
      $progress.show()
      $progress_bar.css 'width', "#{progress}%"
    $input.fileupload({
      url       : '/api/videos'
      dataType  : 'json'
      formData  : @videoFormData()
      paramName : 'video[file]'
      done      : (e, data) =>
        @renderVideo data.result.video
        @generateNewInput()
    })
    $add_video_link = $input.siblings('a')
    $add_video_link.on 'click', (event) ->
      event.preventDefault()
      $input.trigger 'click'

  asJSON: ->
    @$uploads.find('.video').map((i, video) ->
      $video = $(video)
      {
        video_id : $video.data('access-key')
        caption  : $video.find('.caption').val() or ''
      }
    ).get()

module.exports = VideoUploader
