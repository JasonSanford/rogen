## blart

observe and report.

Blart is an app that lets you quickly stand up an app that allows users to create Fulcrum records without authentication or authorization. This can be helpful in emergency response or damage assesment situations where managing users would just get in the way.

### Development

The server side is built on node.js and writter in CoffeeScript so you'll want to install the necessary dependencies first:

```
cd /path/to/blart
npm install
```

Start the web server with:

```
npm start
```

The front-end is also written in CoffeeScript and bundled with Browserify. Use the watch command to track any changes to files in `/assets/js/src` and automatically compile and bundle with browserify:

```
npm run watch
```

It's probably best, though, to simply use the dev command to run the seb server and watch the front-end at the same time:

```
npm run dev
```
