# 📦 Assets

One of the key challenges when using micro-frontends like Podium is how to handle client side assets in each page fragment when everything is stitched together into a page.

In the Podium world, a podlet may need to ship with client side JavaScript and/or CSS and when a layout consumes that podlet, it will also need to consume the podlets JavaScript and/or CSS.

Podium itself does not provide support for asset related tasks such as bundling or minification but we are currently iterating over better general solutions to these problems which will be published and documented as soon as they are ready.

While there are many ways to do so, the following examples illustrate a couple of possibilities for how you might tackle the asset problem currently. Both examples shown here share the same set of challenges:

-   how to isolate styling or behavior
-   how to handle duplication of shared libraries such as React
-   how to minimize client asset size and number of requests.

## Approach 1: inline code

This approach involves each podlet defining its assets as inline code in the podlet's manifest file so that the layout can then include this code directly in its HTML template.

**Step 1.**

In your podlet, use the podlet asset helper functions to define inline client code.

_Example_

```js
podlet.js(`<script>console.log('hello world');</script>`);
podlet.css(`<style>body { background-color: hot-pink; }</style>`);
```

**Step 2.**

Then, read the podlet code snippets using the layout client and insert these into your HTML.

_Example_

```js
app.get('/', (req, res) => {
    const js = layout.client.js();
    const css = layout.client.css();

    res.send(`
        <html>
            <head>
                ${css.join('\n')}
            </head>
            <body>
                ...
                ${js.join('\n')}
            </body>
        </html>
    `);
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
podlet.js('http://some-cdn.com/client.js');
podlet.css('http://some-cdn.com/style.css');
```

**Step 3.**

Finally, in your layout, read an array of URLs from the layout client and insert these into your HTML.

_Example_

```js
app.get('/', (req, res) => {
    const js = layout.client.js();
    const css = layout.client.css();

    res.send(`
        <html>
            <head>
                ${css
                    .map(href => `<link rel="stylesheet" href="${href}" />`)
                    .join('\n')}
            </head>
            <body>
                ...
                ${js.map(src => `<script src="${src}"></script>`).join('\n')}
            </body>
        </html>
    `);
});
```

## Next steps

-   [read about setting up a layout development workflow](/docs/layouts/local_development.html)
