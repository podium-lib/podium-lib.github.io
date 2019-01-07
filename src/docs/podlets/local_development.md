# 🔥 Local Development

👉 This documentation is for Podium podlets version 3.0. [Version 2.0 documentation](/podium-lib/docs/podlets/v2/local_development.html) is also available.

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
    version: '1.0.0',
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

-   `http://localhost:7100/manifest.json`: the podlet's manifest route
-   `http://localhost:7100`: the podlet's content route

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

To solve this, we provide a `development` mode. When enabled, you can set defaults for Podium context values that will be overwritten, and therefore not used, when requests are sent from the layout to the podlet.

To enable this feature, pass `development: true` in the podlet constructor like so:

```js
const podlet = new Podlet({
    ...
    development: true,
});
```

Then rewriting our previous example we can provide sensible development defaults for context values:

```js
podlet.defaults({
    mountOrigin: 'http://localhost:7100',
});

app.get(podlet.content(), (req, res) => {
    const { mountOrigin } = res.locals.podium.context;
    res.send(`<div>${mountOrigin}</div>`);
});
```

Even better, simply enabling `development` mode will result in some sane context defaults being provided, regardless of whether you call `.defaults` or not.

So the following should work when `development` mode is on as well:

```js
app.get(podlet.content(), (req, res) => {
    const { mountOrigin } = res.locals.podium.context;
    res.send(`<div>${mountOrigin}</div>`);
});
```

### HTML pages and page fragments

In production, your content route will be responding with an HTML fragment devoid of its wrapping `<html>` or `<body>` tags. However, in development you will want to wrap your fragment in a light HTML page wrapper, especially if your podlet makes use of client side assets such as JavaScript or CSS.

Once again, `development` mode can help us here. If we set `development` to `true` in the constructor and use the `res.podiumSend` method in our content and fallback routes then our HTML response will be decorated with an HTML page template. As soon as we set `development` to `false`, the decorating stops and the fragment is returned on its own.

Example

Write the same code, toggle HTML template wrapping by setting `development` mode to `true` or `false`

```js
const podlet = new Podlet({
    ...
    development: true,
});

app.get(podlet.content(), (req, res) => {
    res.status(200).podiumSend(`
        <div>
            The podlet's HTML content
        </div>
    `);
});
```

Additionally, if you set JavaScript or CSS assets using the `podlet.js()` or `podlet.css()` methods, script and style tags will be included in page decoration when in `development` mode and omitted when not.

```js
const podlet = new Podlet({
    ...
    development: true,
});

podlet.js('http://cdn.mysite.com/scripts.js');
podlet.css('http://cdn.mysite.com/styles.css');

app.get(podlet.content(), (req, res) => {
    res.status(200).podiumSend(`
        <div>
            The podlet's HTML content
        </div>
    `);
});
```

The decorated page template will include script and style tags to load in `http://cdn.mysite.com/scripts.js` and `http://cdn.mysite.com/styles.css`

These would not be included if `development` was then set to `false`

### Proxying to absolute URLs

Another case you may encounter when working locally with proxying is that absolute URLs are proxied to directly from layouts bypassing podlets entirely.

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

Fortunately, `development` mode takes care of this for us. When `development` is set to `true`, a dev only proxy will be mounted in the podlet. Furthermore, default development context values will reflect this so that your code can continue to dynamically calculate the location of the proxy's public address, even though this address now sits with the podlet and not the layout.

```js
const podlet = new Podlet({
    ...
    development: true,
});

podlet.proxy('http://google.com', 'google');

app.get(podlet.content(), (req, res) => {
    const { mountOrigin, publicPathname } = res.locals.podium.context;
    const url = new URL(publicPathname, mountOrigin);

    res.status(200).podiumSend(`
        <div>
            The url being proxied to google is ${url.href  + 'google'}
        </div>
    `);
});

app.listen(3000);
```

In development mode, the URL will be something like `http://localhost:3000/podium-resource/my-podlet/google`

When not in development mode, the URL will be be similar except that it will be pointing at the layout server instead of the podlet server. Something like `http://localhost:8080/podium-resource/my-podlet/google`

## In Summary

For the best experience when developing podlets:

-   install nodemon so your podlet server restarts on changes
-   turn on development mode when in dev (but not in production)
