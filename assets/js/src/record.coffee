class Record
  constructor: (@record_geojson, @form) ->

  title: ->
    title_key = @form.record_title_key()
    if @record_geojson.properties[title_key]
      @record_geojson.properties[title_key]
    else
      ''

module.exports = Record
