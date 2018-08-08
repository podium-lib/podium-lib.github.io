# 📦 Assets

## Background

One of the key challenges when using micro-frontends like Podium is how to handle client side assets in each page fragment when everything is stitched together into a page.

In the Podium world, a podlet may need to ship with client side JavaScript and/or CSS and when a layout consumes that podlet, it will also need to consume the podlets JavaScript and/or CSS.

## Option 1: Inline assets

The simplest option for including assets in a podlet is to just include `<script>`, `<style>` or `<link>` tags in the content that a podlet serves.

_Example_

```js
app.use(podlet.content(), (req, res) => {
    res.send(`
        <link href="/path/to/style.css" rel="stylesheet">
        This is some content.
        <script src="/path/to/script.js"></script>
    `);
});
```

This works, and in some cases it may be all you need.

However, this approach also comes with a number of drawbacks:

-   Libraries shared across podlets get included multiple times (eg. React).
-   The lack of scoping means that styles and variables get overridden.
-   Assets do not get minified.

## Option 2. Distributed asset bundling (via the Asset Pipe project)

To solve this issue, we maintain a project called [Asset Pipe](https://github.com/asset-pipe). Asset Pipe provides a client library which can be used to upload a podlet's assets to a central [asset build server](https://github.com/asset-pipe/asset-pipe-build-server) for bundling and get back references that can be inserted into the podlet's manifest file which in turn will be consumed and utilized by layouts.

**👉 See also**

-   For information on setting up an Asset Pipe build server, see [@asset-pipe/server](https://github.com/asset-pipe/asset-pipe-build-server).
-   For information on consuming uploaded assets and creating bundles see the layout asset guides (coming soon) and the [@asset-pipe/client](https://github.com/asset-pipe/asset-pipe-client) documentation.

A rough guide to integrating Asset Pipe into a Podium podlet follows:

_1. Install the Asset Pipe client_

```bash
npm i @asset-pipe/client
```

_2. Include the client in a podlet_

Importing the client returns an `Assets` class

```js
const Assets = require('@asset-pipe/client');
```

_3. Create a new client instance_

In order to have the Asset Pipe client upload your assets to a central server, it necessary to configure the location of assets, the location of the Asset Pipe server and identify the upload with a tag. This tag should match the `name` field of the podlet's manifest file so that any layouts that make use of the podlet can work out where the podlet's assets are located. See [@asset-pipe/client](https://github.com/asset-pipe/asset-pipe-client/blob/master/README.md) for API documentation.

```js
const assets = new Assets({
    buildServerUri: 'http://some-asset-server.com',
    tag: podlet.name,
    js: __dirname + '/assets/script.js',
    css: __dirname + '/assets/style.css',
});
```

_4. Add browserify transforms and plugins (optional)_

Under the hood, Asset Pipe uses [Browserify](http://browserify.org/) to bundle JavaScript code. Browserify transforms and plugins can be used with the help of the `assets.transform()` and `assets.plugin()` methods. A common use case for this is transforming ES modules using [Babel](https://babeljs.io/) by way of the [Babelify](https://github.com/babel/babelify) Browserify transform.

```js
const babelify = require('babelify');

...

assets.transform(babelify);
```

_5. Include client middleware_

Once the Asset Pipe client instance has been created, the podlet app should include the client middleware in order to kick off uploading and to ensure that uploads are complete before route handlers are called.

```js
app.use(assets.middleware());
```

_6. Set asset identifiers in the podlet's manifest file_

Once the Asset Pipe client middleware we attached has run, the client will know the identifiers for any JavaScript or CSS assets on the asset server. This can then be accessed using the `assets.js()` and `assets.css()` methods.

```js
app.get(podlet.manifest(), (req, res) => {
    podlet.js(assets.js());
    podlet.css(assets.css());

    res.json(podlet);
});
```

_7. Wait for asset upload (optional)_

In some cases, you may want to wait for assets to be uploaded. A good example for this is Kubernetes health checks. This can be achieved using the `assets.ready()` method.

```js
await assets.ready();
```

### A complete example

```js
const Assets = require('@asset-pipe/client');
const Podlet = require('@podium/podlet');
const express = require('express');
const babelify = require('babelify');

const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
});

const assets = new Assets({
    buildServerUri: 'http://some-asset-server.com',
    tag: podlet.name,
    js: __dirname + '/assets/script.js',
    css: __dirname + '/assets/style.css',
});

assets.transform(babelify);

const app = express();

app.use(assets.middleware());
app.use(podlet.middleware());

app.get(podlet.manifest(), (req, res) => {
    podlet.js(assets.js());
    podlet.css(assets.css());

    res.json(podlet);
});

app.get(podlet.content(), (req, res) => {
    res.send(`Some content`);
});

app.listen(7100);
```
