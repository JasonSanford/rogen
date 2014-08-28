class Form
  constructor: (form_json) ->
    @form_obj = form_json.form

  name: ->
    @form_obj.name

  record_title_key: ->
    @form_obj.record_title_key

module.exports = Form
