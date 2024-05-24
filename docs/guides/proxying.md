---
title: Proxies
---

Proxies are useful in cases where you decide to only expose layout servers directly to the Internet.

Podium does not enforce a certain infrastructure setup. You can choose to have your podlets publicly available, in which case [proxies aren't strictly needed](#public-podlets-and-cross-origin-resource-sharing).

If you decide to not have podlets available publicly, proxies can help in two common scenarios:

- A podlet is expected to handle form submits.
- A podlet includes one or more API routes.

Podium includes a proxy feature to make this setup easier.

## Podium proxy

The Podium proxy is a transparent proxy that is mounted in the layout server based on a podlet's [manifest], making it possible to send any HTTP request through the layout to the podlet server.

The Podium proxy is the recommended way for a podlet to inform any layout servers that consume it that there are additional routes and that they should be given public access via routes on the layout server.

### How it works

- The podlet defines its proxy routes.
- The podlet lists the location of the proxy routes in its manifest.
- The layout reads the proxy information from the manifest.
- The layout creates namespaced proxy routes.
- The layout sends information to the podlet via [the context](/docs/guides/context) about the public location of these routes.
- The podlet uses the context to construct URLs pointing to the public location of the layout's proxy.

### The manifest

The `proxy` field in a podlet's [manifest] can be used to define up to 4 proxy routes:

```json
{
  "name": "myPodlet",
  "version": "1.0.0",
  "pathname": "/",
  "proxy": {
    "api": "/api"
  }
}
```

A layout reading this manifest will mount a proxy at this location:

```
/<layout-pathname>/<prefix>/<podlet-name>/<proxy-namespace>
```

where

- `<layout-pathname>` is the `pathname` option of the [Layout constructor](/docs/api/layout).
- `<prefix>` defaults to `podium-resource`, but can be configured in the Layout constructor
- `<podlet-name>` is the `name` value used when registering a podlet in a layout with `layout.client.register()`.
- `<proxy-namespace>` is the key of the key/value pair defined in the manifest.

## Defining proxy routes

The `podlet.proxy()` method lets you define proxy routes that are listed in the manifest.

```js
podlet.proxy({ target: "/api", name: "api" });
```

The method returns a `string` you can use to define the route itself at the same time:

```js
app.get(podlet.proxy({ target: "/api", name: "api" }), (req, res) => {
  res.json({ key: "value" });
});
```

There are a maximum of 4 proxies, however it is possible to mount multiple routes under a single proxy.

```js
podlet.proxy({ target: "/api", name: "api" });

app.get("/api/cats", (req, res) => {
  res.json([{ name: "fluffy" }]);
});
// http://localhost:1337/myLayout/podium-resource/myPodlet/api/cats

app.get("/api/dogs", (req, res) => {
  res.json([{ name: "rover" }]);
});
// http://localhost:1337/myLayout/podium-resource/myPodlet/api/dogs
```

Specifying an absolute URL is also possible in which case the layout will mount a proxy directly to the URL, bypassing the podlet entirely.

```js
podlet.proxy({ name: "remote-api", target: "http://<some-service:port>/api" });

// http://localhost:1337/myLayout/podium-resource/myPodlet/remote-api
```

## Using the proxy

When creating a podlet with proxy routes, it's necessary to be able to dynamically, programmatically determine the location of these proxy routes.

### Constructing Proxy URLs

The base URL can be constructed by joining together values plucked from the [Podium context](/docs/guides/context) like so.

```js
import { URL } from "url"; // not required in node >= 10;

app.get(podlet.content(), (req, res) => {
  const { mountOrigin, publicPathname } = res.locals.podium.context;
  const url = new URL(publicPathname, mountOrigin);

  // prints base URL under which all proxy routes are located
  console.log(url.href);
});
```

The path to a given endpoint can then be constructed by joining this base URL together with the namespace key given to the `podlet.proxy()` method like so:

```js
// define and create an API proxy route
app.get(podlet.proxy({ target: '/api', name: 'api' }), (req, res) => {
    res.json({...});
});

app.get(podlet.content(), (req, res) => {
    // construct an absolute URL to the API proxy route
     const { mountOrigin, publicPathname } = res.locals.podium.context;
    const url = new URL(publicPathname, mountOrigin);

    // prints specific absolute URL to API proxy endpoint
    console.log(url.href + 'api');
});
```

### Example: client side JavaScript fetching data from a /content route

```js
import express from "express";
import Podlet from "@podium/podlet";

const podlet = new Podlet({
  name: "myPodlet",
  version: "1.0.0",
  pathname: "/",
});

const app = express();

app.get(podlet.manifest(), (req, res) => {
  res.status(200).json(podlet);
});

app.get(podlet.proxy({ target: "/content", name: "content" }), (req, res) => {
  res.send("This is the actual content for the page");
});

app.get(podlet.content(), (req, res) => {
  const { mountOrigin, publicPathname } = res.locals.podium.context;
  const url = new URL(publicPathname, mountOrigin);

  res.send(`
        <div id="content-placeholder"></div>
        <script>
            fetch('${url.href + "content"}')
                .then((response) => response.text())
                .then(content => {
                    const el = document.getElementById('content-placeholder');
                    el.innerHTML = content;
                });
        </script>
    `);
});

app.listen(7100);
```

## Public podlets and cross-origin resource sharing

If your infrastructure is set up so podlet servers are publicly available you can choose to communicate with podlet servers directly by enabling [cross-origin resource sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). You can still use the Podium proxy if you prefer.

[manifest]: /docs/api/manifest
