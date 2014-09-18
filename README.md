## rogen

observe and report.

Rogen lets you quickly stand up an app that allows users to create Fulcrum records without authentication or authorization. This can be helpful in emergency response or damage assesment situations where managing users would just get in the way. Creating a data collection app is as simple as providing a Fulcrum API key and form id. All record creation form inputs are automatically set to their proper HTML form equivalents, including photos.

Setting Location

![Setting Location](https://dl.dropboxusercontent.com/u/10994537/Screenshot_2014-09-17-21-06-41.png)

HTML5 Date and Time Inputs

![HTML5 Date and Time Inputs](https://dl.dropboxusercontent.com/u/10994537/Screenshot_2014-09-17-21-07-06.png)

Upload Directly from Camera

![Upload Directly from Camera](https://dl.dropboxusercontent.com/u/10994537/Screenshot_2014-09-17-21-07-35.png)

### Development

The server side is built on node.js and written in CoffeeScript so you'll want to install the necessary dependencies first:

```bash
cd /path/to/rogen
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

It's probably best, though, to simply use the dev command to run the web server and watch the front-end at the same time:

```bash
npm run dev
```

To compile CoffeeScript for deployment, be sure to use the build command, not watch:

```bash
npm run build
```

#### Environment Variables

You'll need to set a couple environment variables that allow you to communicate with the Fulcrum API.

```bash
export FULCRUM_API_KEY=super_long_string_that_is_a_secret
export FULCRUM_FORM_ID=abc-123-def-456
```

### Deployment

Rogen is easily deployed to Heroku. First create a Heroku app:

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
