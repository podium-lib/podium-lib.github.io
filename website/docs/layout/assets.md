---
id: assets
title: Assets
---

One of the key challenges when using micro-frontend systems like Podium is how to handle client side assets in each page fragment when everything is stitched together into a page.

In the Podium world, a podlet may need to ship with client side JavaScript and/or CSS and when a layout consumes that podlet, it will also need to consume the podlet's JavaScript and/or CSS.

Podium itself does not provide support for asset related tasks such as bundling or minification but we are currently iterating over better general solutions to these problems which will be published and documented as soon as they are ready.

While there are many ways to do so, the following examples illustrate a couple of possibilities for how you might tackle the asset problem currently. Both examples shown here share the same set of challenges:

-   how to isolate styling or behavior
-   how to handle duplication of shared libraries such as React
-   how to minimize client asset size and number of requests.

## Approach 1: podlet serves its own assets

This approach involves each podlet serving its assets so that the layout can then include these files in its HTML template.
Currently, this will only work if your podlets are publically available and dont require proxying to work though future changes may be made to suppor this feature.

**Step 1.**

In your podlet, use the podlet asset helper functions to define inline client code.

_Example_

```js
podlet.js({ value: `http://my-podlet.com/assets/scripts.js` });
podlet.css({ value: `http://my-podlet.com/assets/styles.js` });
```

Each of these functions can be called multiple times to add additional assets. For each call, you may also set a type (which will default to 'default' if not specified)

_Example_

```js
podlet.js({ value: `http://my-podlet.com/assets/scripts1.js`, type: 'esm' });
podlet.js({
    value: `http://my-podlet.com/assets/scripts2.js`,
    type: 'default',
});
```

**Step 2.**

Serve the assets from express.
Assuming the podlets client side assets have been placed in a directory called `assets`:

```js
app.use('/assets', express.static('assets'));
```

See the [express documentation](https://expressjs.com/en/starter/static-files.html) for more information.

**Step 3.**

Write your layout using the `podiumSend` method and the [document template](api/document.md) feature (Podium v4 and above) which will automatically include these assets.

_Example_

```js
app.get('/', (req, res) => {
    res.podiumSend(`<div>Content goes here</div>`);
});
```

## Approach 2: upload to a CDN or remote server

This approach involves each podlet uploading its assets to a predefined CDN location so that the layout can then include the CDN URLs in its HTML template.

**Step 1.**

In your podlet, upload your assets to a CDN by whatever means necessary. You might do this whenever your podlet server starts up to ensure the latest version is available on the CDN.

**Step 2.**

Next, tell the podlet the location of your assets so that it can populate the manifest file.

_Example_

```js
podlet.js({ value: 'http://some-cdn.com/client.js' });
podlet.css({ value: 'http://some-cdn.com/style.css' });
```

**Step 3.**

Write your layout using the `podiumSend` method and the [document template](api/document.md) feature (Podium v4 and above) which will automatically include these assets.

_Example_

```js
app.get('/', (req, res) => {
    res.podiumSend(`<div>Content goes here</div>`);
});
```
