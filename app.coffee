express    = require 'express'
path       = require 'path'
logger     = require 'morgan'
bodyParser = require 'body-parser'

routes     = require './routes'
api_routes = require './routes/api'

app = express()

app.set 'views', path.join(__dirname, 'views')
app.set 'view engine', 'jade'

app.use logger('dev')
app.use bodyParser.json()
app.use bodyParser.urlencoded()
app.use '/static', express.static(path.join __dirname, 'assets')

app.use '/'   , routes
app.use '/api', api_routes

app.use (req, res, next) ->
  err = new Error('Not Found')
  err.status = 404
  next err

# development error handler
# will print stacktrace
if app.get 'env' is 'development'
  app.use (err, req, res, next) ->
    res.status err.status || 500
    res.render 'error', {
      message: err.message,
      error: err
    }

# production error handler
# no stacktraces leaked to user
app.use (err, req, res, next) ->
  res.status err.status || 500
  res.render 'error', {
    message: err.message,
    error: {}
  }


module.exports = app
