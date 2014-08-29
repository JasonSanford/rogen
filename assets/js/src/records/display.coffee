PhotoDisplay = require '../photo_display'

class Display
  constructor: (@form, @record) ->
    @$modal_container = $('#record-modal')
    @init()

  photo_displays: []

  # TODO: This shit is NASTY, make not nasty.
  generateElementHTML: (element) ->
    panelBody = (panel_html) ->
      "<div class='panel-body'>#{panel_html}</div>"

    html_parts = ['<div class="panel panel-default">']
    if element.type in ['Section', 'PhotoField']
      html_parts.push "<div class='panel-heading'><h3 class='panel-title'>#{element.label}</h3></div>"
      if element.type is 'Section'
        for inner_element in element.elements
          inner_element_html = @generateElementHTML inner_element
          html_parts.push panelBody(inner_element_html)
      else if element.type is 'PhotoField'
        if @record.record_geojson.properties[element.key]
          photos_html_parts = []
          for photo in @record.record_geojson.properties[element.key]
            photos_html_parts.push "<div id='photo-#{photo.photo_id}'></div>"
            @photo_displays.push new PhotoDisplay(photo)
          html_parts.push panelBody(photos_html_parts.join '')
    else if element.type in ['YesNoField', 'ChoiceField', 'DateTimeField', 'TimeField']
      inner_html_parts = ["<dl><dt>#{element.label}</dt>"]
      if @record.record_geojson.properties[element.key]
        if element.type in ['YesNoField', 'DateTimeField', 'TimeField']
          inner_html_parts.push "<dd>#{@record.record_geojson.properties[element.key]}</dd>"
        else if element.type is 'ChoiceField'
          choice_values = @record.record_geojson.properties[element.key].choice_values
          other_values  = @record.record_geojson.properties[element.key].other_values
          value = if choice_values.length then choice_values[0] else other_values[0]
          value = '&nbsp;' if not value
          inner_html_parts.push "<dd>#{value}</dd>"
      else
        inner_html_parts.push '<dd>&nbsp;</dd>'
      inner_html_parts.push '</dl>'
      html_parts.push panelBody(inner_html_parts.join '')
    else if element.type is 'TextField'
      html_parts.push panelBody("<h4>#{element.label}</h4><p>#{@record.record_geojson.properties[element.key]}</p>")
    html_parts.push '</div>'
    html_parts.join ''

  generateHTMLContent: ->
    parts = []
    for element in @form.form_obj.elements
      html_part = @generateElementHTML element
      parts.push html_part
    @html_content = parts.join ''

  init: ->
    console.log @record
    console.log @form
    @generateHTMLContent()
    @$modal_container.find('.modal-title').html @record.title()
    @$modal_container.find('.modal-body').html @html_content
    @$modal_container.modal()
    for photo_display in @photo_displays
      photo_display.render()

module.exports = Display
