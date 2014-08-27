class Creator
  constructor: ->
    @creator_modal = $('#new-record-modal')
    @init()

  init: ->
    @creator_modal.modal()

module.exports = Creator
