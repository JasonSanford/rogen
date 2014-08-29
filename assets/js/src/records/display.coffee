PhotoDisplay = require '../photo_display'

class Display
  constructor: (@form, @record) ->
    @$modal_container = $('#record-modal')
    @init()

  photo_displays: []

  # TODO: This shit is NASTY, make not nasty.
  generateElementHTML: (element) ->
    panelBody = (panel_body_html) ->
      "<div class='panel-body'>#{panel_body_html}</div>"

    panel = (panel_html) ->
      "<div class='panel panel-default'>#{panel_html}</div>"

    html_parts = []
    if element.type in ['Section', 'PhotoField']
      html_parts.push "<div class='panel-heading'><h3 class='panel-title'>#{element.label}</h3></div>"
      if element.type is 'Section'
        for inner_element in element.elements
          inner_element_html = @generateElementHTML inner_element
          html_parts.push panelBody(inner_element_html)
          html = panel(html_parts.join '')
      else if element.type is 'PhotoField'
        if @record.record_geojson.properties[element.key]
          photos_html_parts = ['<div class="row photo-row">']
          for photo in @record.record_geojson.properties[element.key]
            photos_html_parts.push "<div class='thumbnail col-xs-6 col-md-3' id='photo-#{photo.photo_id}'></div>"
            @photo_displays.push new PhotoDisplay(photo)
          photos_html_parts.push '</div>'
          html_parts.push panelBody(photos_html_parts.join '')
          html = panel(html_parts.join '')
    else if element.type in ['YesNoField', 'ChoiceField', 'ClassificationField', 'DateTimeField', 'TimeField']
      inner_html_parts = ["<dl><dt>#{element.label}</dt>"]
      if @record.record_geojson.properties[element.key]
        if element.type in ['YesNoField', 'DateTimeField', 'TimeField']
          if element.type is 'YesNoField'
            value = @record.record_geojson.properties[element.key]
            if value
              if value is element.positive.value
                pos_neg_neu = 'positive'
                alert_klass = 'success'
                glyphicon   = 'thumbs-up'
              else if value is element.negative.value
                pos_neg_neu = 'negative'
                alert_klass = 'danger'
                glyphicon   = 'thumbs-down'
              else
                pos_neg_neu = 'neutral'
                alert_klass = 'warning'
                glyphicon   = 'adjust'
              label = element[pos_neg_neu].label
              value = "<div class='alert alert-#{alert_klass} yesno'><i class='glyphicon glyphicon-#{glyphicon}' /> <strong>#{label}</strong></div>"
            else
              value = '&nbsp;'
          else
            if @record.record_geojson.properties[element.key]
              value = @record.record_geojson.properties[element.key]
            else
              value = '&nbsp;'
          inner_html_parts.push "<dd>#{value}</dd>"
        else if element.type in ['ChoiceField', 'ClassificationField']
          choice_values = @record.record_geojson.properties[element.key].choice_values
          other_values  = @record.record_geojson.properties[element.key].other_values
          if element.multiple
            values = choice_values.concat other_values
          else
            values = [if choice_values.length then choice_values[0] else other_values[0]]
          if element.type is 'ClassificationField'
            values = values.map (value) => @form.classification_sets[element.classification_set_id].getValueByID(value)
            display = values.join ', '
          else
            display = values.join ', '
          display = '%nbsp;' if not display
          inner_html_parts.push "<dd>#{display}</dd>"
      else
        inner_html_parts.push '<dd>&nbsp;</dd>'
      inner_html_parts.push '</dl>'
      html_parts.push panelBody(inner_html_parts.join '')
      html = panel(html_parts.join '')
    else if element.type is 'TextField'
      if element.numeric
        if @record.record_geojson.properties[element.key]
          value = @record.record_geojson.properties[element.key]
        else
          value = '&nbsp;'
        html = panel(panelBody("<dl><dt>#{element.label}</dt><dd>#{value}</dd></dl>"))
      else
        if @record.record_geojson.properties[element.key]
          value = @record.record_geojson.properties[element.key]
        else
          value = '&nbsp;'
        html = panel(panelBody("<h4>#{element.label}</h4><p>#{value}</p>"))
    else if element.type is 'Label'
      html = "<div class='alert alert-info'>#{element.label}</div>"
    else if element.type is 'HyperlinkField'
      url = if @record.record_geojson.properties[element.key] then @record.record_geojson.properties[element.key] else element.default_url
      if url
        link = "<a target='_blank' href='#{url}'>#{url}</a>"
      else
        link = '&nbsp;'
      html = panel(panelBody("<h4>#{element.label}</h4><p>#{link}</p>"))
    html

  generateHTMLContent: ->
    parts = []
    for element in @form.form_obj.elements
      html_part = @generateElementHTML element
      parts.push html_part
    @html_content = parts.join ''

  init: ->
    @generateHTMLContent()
    @$modal_container.find('.modal-title').html @record.title()
    @$modal_container.find('.modal-body').html @html_content
    @$modal_container.modal()
    for photo_display in @photo_displays
      photo_display.render()

module.exports = Display
