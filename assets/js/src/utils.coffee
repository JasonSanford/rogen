extend = (object, properties) ->
  for key, val of properties
    object[key] = val
  object

module.exports =
  extend: extend
