class Display
  constructor: (@form, @record) ->
    @$modal_container = $('#record-modal')
    @init()

  generateElementHTML: (element) ->
    panelBody = (panel_html) ->
      "<div class='panel-body'>#{panel_html}</div>"

    html_parts = ['<div class="panel panel-default">']
    if element.type is 'Section'
      html_parts.push "<div class='panel-heading'><h3 class='panel-title'>#{element.label}</h3></div>"
      for inner_element in element.elements
        inner_element_html = @generateElementHTML inner_element
        html_parts.push panelBody(inner_element_html)
    else if element.type is 'YesNoField'
      inner_html_parts = ["<p><strong>#{element.label}</strong>"]
      if @record.record_geojson.properties[element.key]
        inner_html_parts.push @record.record_geojson.properties[element.key]
      inner_html_parts.push '</p>'
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

module.exports = Display
