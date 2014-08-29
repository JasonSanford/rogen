class ClassificationSet
  constructor: (classification_set_json) ->
    @classification_set_obj = classification_set_json.classification_set

  name: ->
    @classification_set_obj.name

  id: ->
    @classification_set_obj.id

  getValueByID: (id) ->
    for item in @classification_set_obj.items
      if item.value is id
        return item.label
    return ''

module.exports = ClassificationSet
