xhr = require 'xhr'

ClassificationSet = require './classification_set'

class Form
  constructor: (form_json) ->
    @form_obj = form_json.form
    @init()

  classification_sets: {}

  init: ->
    @findClassificationSets @form_obj.elements

  findClassificationSets: (elements) ->
    for element in elements
      if element.type is 'Section'
        @findClassificationSets element.elements
      else if element.type is 'ClassificationField'
        @fetchClassificationSet element.classification_set_id

  fetchClassificationSet: (classification_set_id) ->
    xhr_options =
      uri: "/api/classification_sets/#{classification_set_id}"
      json: true
    xhr_callback = (error, response, classification_set_obj) =>
      if error
        console.log error
        return
      classification_set = new ClassificationSet classification_set_obj
      @classification_sets[classification_set_id] = classification_set
    xhr xhr_options, xhr_callback

  choiceFieldKeys: (iteratable) ->
    keys = []
    _iteratable = iteratable or @form_obj.elements
    for element in _iteratable
      if element.type is 'ChoiceField'
        keys.push element.key
      else if element.type is 'Section'
        section_keys = @choiceFieldKeys element.elements
        Array::push.apply keys, section_keys
    keys

  choiceFieldAllowOtherKeys: (iteratable) ->
    keys = []
    _iteratable = iteratable or @form_obj.elements
    for element in _iteratable
      # TODO: Support multiple choice with other
      if element.type is 'ChoiceField' and element.allow_other and not element.multiple
        keys.push element.key
      else if element.type is 'Section'
        section_keys = @choiceFieldKeys element.elements
        Array::push.apply keys, section_keys
    keys

  name: ->
    @form_obj.name

  id: ->
    @form_obj.id

  record_title_key: ->
    @form_obj.record_title_key

module.exports = Form
