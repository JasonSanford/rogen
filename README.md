## blart

observe and report.

Blart is an app that lets you quickly stand up an app that allows users to create Fulcrum records without authentication or authorization. This can be helpful in emergency response or damage assesment situations where managing users would just get in the way.

### Development

The server side is built on node.js and writter in CoffeeScript so you'll want to install the necessary dependencies first:

```bash
cd /path/to/blart
npm install
```

Start the web server with:

```bash
npm start
```

The front-end is also written in CoffeeScript and bundled with Browserify. Use the watch command to track any changes to files in `/assets/js/src` and automatically compile and bundle with browserify:

```bash
npm run watch
```

It's probably best, though, to simply use the dev command to run the seb server and watch the front-end at the same time:

```bash
npm run dev
```

#### Environment Variables

You'll need to set a couple environment variables that allow you to communicate with the Fulcrum API.

```bash
export FULCRUM_API_KEY=super_long_string_that_is_a_secret
export FULCRUM_FORM_ID=abc-123-def-456
```

### Deployment

Blart is easily deployed to Heroku. First create a Heroku app:

```bash
heroku create
```

For help with Heroku, [check out the docs](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction).

Then, set the envrionment variables from above:

```bash
heroku config:set FULCRUM_API_KEY=super_long_string_that_is_a_secret
heroku config:set FULCRUM_FORM_ID=abc-123-def-456
```

Then, deploy the app:

```bash
git push heroku master
```
