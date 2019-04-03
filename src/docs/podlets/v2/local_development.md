# 🔥 Local Development

👉 This documentation is for Podium podlets version 2.0. [Version 3.0 documentation](/docs/podlets/local_development.html) is also available.

## Background

It is intended that Podlets be developed in isolation from layouts or other Podlets. This isolation can introduce challenges into local development due to some components normally provided by a layout (such as headers and Assets) not being available.

## A basic podlet development setup

At its most basic, the experience of developing a podlet on its own can be as simple as starting the podlet and visiting its URL in your favourite browser.

Consider the following very simple podlet server:

```js
const express = require('express');
const Podlet = require('@podium/podlet');

const podlet = new Podlet({
  name: 'myPodlet',
  version: '1.0.0'
});

const app = express();

app.get(podlet.manifest(), (req, res) => {
  res.json(podlet);
});

app.get(podlet.content(), (req, res) => {
  res.send(`<div>This is my content</div>`);
});

app.listen(7100);
```

If this content were saved in a file called `server.js` and run with the command:

```bash
node server.js
```

then you could simply visit the following routes to test your changes

- `http://localhost:7100/manifest.json`: the podlet's manifest route
- `http://localhost:7100`: the podlet's content route

## Problems and solutions

### Restarting the server

The first problem with the basic setup described above is that every time you make a change to your server, you will need to stop and restart your server before refreshing your browser window in order to see changes.

This is not so much a Podium problem as it is a common Node.js problem and it's easily solved. A common way to do so is to use a module such as [nodemon](http://nodemon.io) to monitor your file system and restart your server automatically anytime relevant files change.

_Use nodemon to run your server_

```bash
npx nodemon server.js
```

See the [nodemon docs](https://github.com/remy/nodemon#nodemon) for more information.

### Missing context headers

When a podlet is being run in the context of a layout server, the layout server will send a number of podium context headers with each request. If your podlet depends on these headers to get its work done, developing the podlet locally maybe be difficult or impossible out of the box.

Consider a podlet with the following content route:

```js
app.get(podlet.content(), (req, res) => {
  const { mountOrigin } = res.locals.podium.context;
  res.send(`<div>${mountOrigin}</div>`);
});
```

This podlet will behave correctly when send requests by a layout but it will throw an error if you try to visit `/` directly in your browser.

To solve this, we provide something called `defaults`. When enabled, you can set defaults for Podium context values that will be overwritten, and therefore not used, when requests are sent from the layout to the podlet.

To enable this feature, pass `defaults: true` to the podlet constructor like so:

```js
const podlet = new Podlet({
    ...
    defaults: true,
})
```

Then rewriting our previous example we can provide sensible development defaults for context values:

```js
podlet.defaults({
  mountOrigin: 'http://localhost:7100'
});

app.get(podlet.content(), (req, res) => {
  const { mountOrigin } = res.locals.podium.context;
  res.send(`<div>${mountOrigin}</div>`);
});
```

### HTML pages and page fragments

In production, your content route will be responding with an HTML fragment devoid of its wrapping `<html>` or `<body>` tags. However, in development you will want to wrap your fragment in a light HTML page wrapper, especially if your podlet makes use of client side assets such as JavaScript or CSS.

_In production_

In this example, the returned content is kept slim and simple, a single `<div>` is returned and client side assets are handled elsewhere.

```html
<div>My content fragment</div>
```

_In development_

When working on this podlet in isolation however, we want to be able to visit the podlet directly in a browser and see an HTML page so we wrap it in `<html>` and `<body>` tags. Once we do this, we gain the ability to link in JavaScript and CSS development assets so we can properly see what we are working on.

```html
<html>
  <head>
    <link rel="stylesheet" href="..." />
  </head>
  <body>
    <div>My content fragment</div>
    <script src="..."></script>
  </body>
</html>
```

While there are any number of ways to support client side JavaScript and CSS assets in your podlets, in many cases, you will run into the problem of wanting to serve your assets directly with your podlet while in development and not while running in production. How you handle this will depend on your needs and approach to assets as a whole. We are currently working on a general solution to this problem and will share more when we feel it ready.

### Proxying to absolute URLs

A slight edge case you may encounter when working locally with proxying is that absolute URLs are proxied to directly from layouts bypassing podlets entirely.

```js
podlet.proxy('http://google.com', 'google');
```

will generate the following entry in the podlet's manifest

```json
{
    ...
    "proxy": {
        "google": "http://google.com"
    }
}
```

When this is consumed by a layout, the layout will mount a proxy from the layout directly to `http://google.com` without sending any traffic to the podlet. When working locally on your podlet in isolation this will mean that the proxy is simply not available to you.

The preferred way to overcome this challenge is to mount a proxy in the podlet for development purposes

```js
podlet.proxy('http://google.com', 'google');

if (process.env.NODE_ENV === 'development') {
  const proxy = new Proxy();
  app.use(proxy.middleware());
  proxy.register(podlet);
}
```
