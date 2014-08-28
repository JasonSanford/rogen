class Display
  constructor: (@form, @record) ->
    @$modal_container = $('#record-modal')
    @init()

  init: ->
    console.log @record
    console.log @form
    @$modal_container.find('.modal-title').text @record.title()
    @$modal_container.modal()

module.exports = Display
