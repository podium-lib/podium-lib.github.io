---
id: assets
title: Client-side assets
---

A podlet will likely depend on some CSS and maybe client-side JavaScript to work properly. When a layout composes podlets it has to include each podlet's assets in the final document. This poses some novel challenges.

- Where to host the client-side assets?
- How to handle duplication of shared libraries such as React?
- How to isolate styling or behavior between podlets and layout?

## Hosting assets

There are two main options for hosting assets:

- The podlet can serve its own assets
- Use a separate asset server or CDN

### Podlet serves assets

Note: this will only work if your podlets are publicly available.

This approach involves each podlet serving its assets so that the layout can then include these files in its HTML template.

**Step 1.**

In your podlet, use the podlet asset helper functions to define inline client code.

```js
podlet.js({ value: `http://my-podlet.com/assets/scripts.js` });
podlet.css({ value: `http://my-podlet.com/assets/styles.js` });
```

Each of these functions can be called multiple times to add additional assets. For each call, you may also set a type.

```js
podlet.js({ value: `http://my-podlet.com/assets/scripts1.js`, type: "esm" });
podlet.js({
  value: `http://my-podlet.com/assets/scripts2.js`,
  type: "default",
});
```

**Step 2.**

Serve the assets from express.
Assuming the podlets client side assets have been placed in a directory called `assets`:

```js
app.use("/assets", express.static("assets"));
```

See the [Express documentation](https://expressjs.com/en/starter/static-files.html) for more information on `static`.

**Step 3.**

Set `incoming.podlets` and use `podiumSend` in your layout's request handler. This way the [document template](api/document.md) can include the CSS and JS assets served by the podlet.

```js
app.get(layout.pathname(), (req, res) => {
  const incoming = res.locals.podium;
  const response = await myPodlet.fetch(incoming);

  incoming.podlets = [response];
  res.podiumSend(`<div>Hello, Layout</div>`);
});
```

### Use a CDN

This approach involves each podlet uploading its assets to a predefined CDN location so that the layout can then include the CDN URLs in its HTML response.

**Step 1.**

In your podlet, upload your assets to a CDN. You might do this whenever your podlet server is built or starts up to ensure the latest version is available on the CDN.

**Step 2.**

Next, tell the podlet the location of your assets so that it can populate the manifest file.

```js
podlet.js({ value: "http://some-cdn.com/client.js" });
podlet.css({ value: "http://some-cdn.com/style.css" });
```

**Step 3.**

Set `incoming.podlets` and use `podiumSend` in your layout's request handler. This way the [document template](api/document.md) can include the CSS and JS assets served by the podlet.

```js
app.get(layout.pathname(), (req, res) => {
  const incoming = res.locals.podium;
  const response = await myPodlet.fetch(incoming);

  incoming.podlets = [response];
  res.podiumSend(`<div>Hello, Layout</div>`);
});
```

## Deduplicating shared dependencies

It's likely one or more of your podlets share a common dependency, such as React. Unless you take action each podlet will bundle its own complete copy of React, wasting bandwith and execution time.

It's up to you to configure your build tools and infrastructure so you can avoid this duplication in your bundles and serve shared dependencies in a performant way.

You may want to look into [Eik](https://eik.dev/docs/overview) and its [build tool plugins](https://eik.dev/docs/mapping_plugins), which were built by the same team that maintains Podium to solve this performance problem.

## Isolation

A podlet should ideally not affect or be affected by the layout or other podlets. This can be tricky, particularly for CSS because of its global nature and the cascade.

### Unique selectors

You can work around the isolation problem by adopting a namespacing convention for all CSS selectors. CSS modules and other similar tools that generate unique selectors can also help mitigate the isolation problem.

Unique selectors can mitigate some of the isolation problems, but a podlet can still be affected by the layout's CSS.

### Declarative shadow DOM

Using the [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) you can isolate a podlet from its surroundings. By wrapping a podlet in a [declarative shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM#declaratively_with_html) you can still get the benefits of server-side rendering.

#### `podlet.css()` can't be used with shadow DOM

With `podlet.css()` the end result is a `<link />` tag in the HTML document's `<head />`. If your podlet's content renders inside a shadow DOM that CSS won't be able to reach the podlet.

With a declarative shadow DOM you have to include your own `<link />` to the CSS from inside the shadow DOM.
