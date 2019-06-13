---
id: proxying
title: Proxying
---

While Podium does not enforce what type of infrastructure is used to run podlet and layout servers, a common decision that will have to be made when using Podium is whether podlet servers should be publicly accessible or whether they should be accessible only through the layout server. This decision can impact how client side code is written due to a common need to communicate back directly from client code to podlet server.

In some cases, you may not wish to expose your podlets to the outside world, instead prefering to expose only layouts and let the layouts do the work of fetching content from internally placed podlets.

A podlet server that is not exposed to the outside world except via a layout server that consumes its content will likely still need a way to define additional routes and make them publicly available.

Two very common use cases for this are when performing form submissions against a podlet and when making AJAX requests from client side code to a podlet. For example, a podlet might define an additional route at `/api` which is provided so that the client side JavaScript served by this podlet can fetch additional data asynchonously after page load.

By default, a podlet serves up its content at `/`. While you can change this to a different route, `/content` for example, out of the box, no other routes will be accessible. In our example above, it will not be possible for the client side JavaScript code to make a request to `/api` as this code is now running in the layout and the layout does not provide an `/api` route. And since the podlet itself has no public address, there's no way to send a request directly to the podlet's `/api` route using an absolute URL either.

To cater for this need to communicate directly with podlet servers, Podium provides a proxy feature. A Podium proxy is a transparent proxy that is mounted in the layout server making it possible to send any HTTP request through it back to the podlet server.

If your infrastructure is setup such that podlet servers are only available through layout servers then using the Podium Proxy is the prefered way to make parts of a podlet server publically available.

If, on the other hand, your infrastructure is setup such that podlet servers are fully publically available then the approach taken can simply be for client side code to communicate with the podlet server directly by enabling [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

## Podium Proxy

Podium proxying is the Podium way for a podlet to inform any layout servers that consume it that there are additional routes and that they should be given public access via routes on the layout server.

### How it works

For each proxy you define in a podlet, a namespaced route will be mounted on a layout which will proxy requests back to the podlet. This works as follows:

-   A podlet defines its proxy routes
-   A podlet puts the location of the proxy routes into its manifest file
-   A layout reads a podlets manifest file including proxy information
-   A layout creates namespaced proxy routes
-   A layout sends information to the podlet via context headers about the public location of these routes
-   A podlet uses context headers to construct URLs pointing to the layout's proxy endpoints

In a podlet's manifest, a proxy object can be used to define up to 4 proxy routes like so:

```json
{
    ...
    "name": "myPodlet",
    "proxy": {
        "api": "/api"
    }
    ...
}
```

This will result in a URL being mounted on the layout server at:

```bash
/<layout-pathname>/<prefix>/<podlet-name>/<proxy-namespace>
```

where:

-   `<layout-pathname>`: `pathname` argument given `new Layout({ pathname: '...' })`
-   `<prefix>`: defaults to `podium-resource`
-   `<podlet-name>`: `name` value used when registering a podlet in a layout with `layout.client.register({ name: '...' })`
-   `<proxy-namespace>`: podlet manifest `proxy.<key>`

So for a layout running locally on port `1337` using `pathname` 'myLayout' and consuming a podlet that serves the manifest file above we should be able to send requests to:

`http://localhost:1337/myLayout/podium-resource/myPodlet/api`

and expect that our requests would be proxied on to our podlet's `/api` route.

### Programmatically defining proxy routes

It's not necessary to define proxy routes in a manifest file manually. There is a `podlet.proxy()` helper method you should use to define proxy routes and have the manifest file fields populated for you. The following example will achieve the same thing as shown earlier using this helper.

_Example_

```js
podlet.proxy({ target: '/api', name: 'api' });
```

What's more, we can also define the route itself at the same time.

_Example_

```js
app.get(podlet.proxy({ target: '/api', name: 'api' }), (req, res) => {
    res.json({ key: 'value' });
});
```

There are a maximum of 4 proxies, however it is possible to mount multiple routes under a single proxy.

_Example_

```js
podlet.proxy({ target: '/api', name: 'api' });

app.get('/api/cats', (req, res) => {
    res.json([{ name: 'fluffy' }]);
});
// http://localhost:1337/myLayout/podium-resource/myPodlet/api/cats

app.get('/api/dogs', (req, res) => {
    res.json([{ name: 'rover' }]);
});
// http://localhost:1337/myLayout/podium-resource/myPodlet/api/dogs
```

Specifying an absolute URL is also possible in which case the layout will mount a proxy directly to the URL, bypassing the podlet entirely.

_Example_

```js
podlet.proxy({ name: 'remote-api', target: 'http://<some-service:port>/api' });

// http://localhost:1337/myLayout/podium-resource/myPodlet/remote-api
```

### Constructing Proxy URLs

When creating a podlet with proxy routes, it's necessary to be able to dynamically, programmatically determine the location of these proxy routes.

The base URL can be constructed by joining together values plucked from the Podium context like so.

```js
const { URL } = require('url'); // not required in node >=10

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
const express = require('express');
const Podlet = require('@podium/podlet');

const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
});

const app = express();

app.get(podlet.manifest(), (req, res) => {
    res.status(200).json(podlet);
});

app.get(podlet.proxy({ target: '/content', name: 'content' }), (req, res) => {
    res.send('This is the actual content for the page');
});

app.get(podlet.content(), (req, res) => {
    const { mountOrigin, publicPathname } = res.locals.podium.context;
    const url = new URL(publicPathname, mountOrigin);

    res.send(`
        <div id="content-placeholder"></div>
        <script>
            fetch('${url.href + 'content'}')
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
