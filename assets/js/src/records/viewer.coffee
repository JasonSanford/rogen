PhotoDisplay = require '../photo_display'

panel = (panel_html, css_class) ->
  css_class = if css_class then " #{css_class}" else ''
  "<div class='panel panel-default#{css_class}'>#{panel_html}</div>"

panelBody = (panel_body_html) ->
  "<div class='panel-body'>#{panel_body_html}</div>"

class Viewer
  constructor: (@form, @record) ->
    @$modal_container = $('#record-modal')
    @init()

  photo_displays: []

  generateChoiceField: (element) ->
    if choice_values = @record.record_geojson.properties[element.key]
      choice_values = @record.record_geojson.properties[element.key].choice_values
      other_values  = @record.record_geojson.properties[element.key].other_values
      if element.multiple
        values = choice_values.concat other_values
      else
        values = [if choice_values.length then choice_values[0] else other_values[0]]
      display = values.join ', '
      display = '&nbsp;' if not display
    else
      display = '&nbsp;'
    panel panelBody("<dl><dt>#{element.label}</dt><dd>#{display}</dd></dl>")

  generateClassificationField: (element) ->
    if choice_values = @record.record_geojson.properties[element.key]
      choice_values = @record.record_geojson.properties[element.key].choice_values
      other_values  = @record.record_geojson.properties[element.key].other_values
      if element.multiple
        values = choice_values.concat other_values
      else
        values = [if choice_values.length then choice_values[0] else other_values[0]]
      values = values.map (value) => @form.classification_sets[element.classification_set_id].getValueByID(value)
      display = values.join ', '
      display = '&nbsp;' if not display
    else
      display = '&nbsp;'
    panel panelBody("<dl><dt>#{element.label}</dt><dd>#{display}</dd></dl>")

  generateDateTimeField: (element) ->
    @generateTimeFieldAndDateTimeField element

  generateTimeField: (element) ->
    @generateTimeFieldAndDateTimeField element

  generateTimeFieldAndDateTimeField: (element) ->
    value = @record.record_geojson.properties[element.key]
    value = '&nbsp;' if not value
    panel panelBody("<dl><dt>#{element.label}</dt><dd>#{value}</dd></dl>")

  generateHyperlinkField: (element) ->
    url = if @record.record_geojson.properties[element.key] then @record.record_geojson.properties[element.key] else element.default_url
    if url
      link = "<a target='_blank' href='#{url}'>#{url}</a>"
    else
      link = '&nbsp;'
    panel panelBody("<h4>#{element.label}</h4><p>#{link}</p>")

  generateLabel: (element) ->
    "<div class='alert alert-info'>#{element.label}</div>"

  generatePhotoField: (element) ->
    photos_html_parts = []
    if @record.record_geojson.properties[element.key]
      photos_html_parts.push '<div class="row photo-row">'
      for photo in @record.record_geojson.properties[element.key]
        photos_html_parts.push "<div class='thumbnail col-xs-6 col-md-3' id='photo-#{photo.photo_id}'></div>"
        caption = photo.caption or '&nbsp;'
        @photo_displays.push new PhotoDisplay(photo, caption)
      photos_html_parts.push '</div>'
    panel "<div class='panel-heading'><h3 class='panel-title'>#{element.label}</h3></div>#{panelBody(photos_html_parts.join '')}", 'photos'

  generateTextField: (element) ->
    if @record.record_geojson.properties[element.key]
      value = @record.record_geojson.properties[element.key]
    else
      value = '&nbsp;'
    if element.numeric
      panel panelBody("<dl><dt>#{element.label}</dt><dd>#{value}</dd></dl>")
    else
      panel panelBody("<h4>#{element.label}</h4><p>#{value}</p>")

  generateYesNoField: (element) ->
    value = @record.record_geojson.properties[element.key]
    if value
      if value is element.positive.value
        pos_neg_neu = 'positive'
      else if value is element.negative.value
        pos_neg_neu = 'negative'
      else
        pos_neg_neu = 'neutral'
      value = element[pos_neg_neu].label
    else
      value = '&nbsp;'
    panel panelBody("<dl><dt>#{element.label}</dt><dd>#{value}</dd></dl>")

  generateSection: (element) ->
    html_parts = []
    for inner_element in element.elements
      inner_element_html = @generateElement inner_element
      html_parts.push panelBody(inner_element_html)
      html = panel(html_parts.join '')
    panel "<div class='panel-heading'><h3 class='panel-title'>#{element.label}</h3></div>#{panelBody(html)}"

  generateElement: (element) ->
    if @["generate#{element.type}"]
      html = @["generate#{element.type}"](element)
    else
      console.log "Could not render element #{element.type}"
      html = ''
    html

  generateHTMLContent: ->
    parts = []
    for element in @form.form_obj.elements
      parts.push @generateElement element
    @html_content = parts.join ''

  init: ->
    @generateHTMLContent()
    @$modal_container.find('.modal-title').html @record.title()
    @$modal_container.find('.modal-body').html @html_content
    @$modal_container.modal()
    for photo_display in @photo_displays
      photo_display.render()

module.exports = Viewer
