# 🐠 Proxying

## Background

In some cases, you may not wish to expose your podlets to the outside world, instead prefering to expose only layouts and let the layouts do the work of fetching content from internally placed podlets.

A podlet server that is not exposed to the outside world except via a layout server that consumes it's content may still need a way to define additional routes and make them publically available. A common example; a podlet defines an additional route at `/api` which is provided so that the client side JavaScript served by this podlet can fetch additional data asynchonously after page load.

By default, a podlet serves up it's content at `/`. While you can change this to a different route, `/content` for example, out of the box, no other routes will be accessible. In our example above, it will not be possible for the client side JavaScript code to make a request to `/api` as this code is now running in the layout and the layout does not provide an `/api` route. And since the podlet itself has no public address, there's no way to send a request directly to the podlet's `/api` route using an absolute URL either.

One solution of course is to simply make your podlets externally visible, use absolute URLs and set the correct [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) headers. If this approach works for you, read no further.

Another solution might be to use a reverse proxy like NGINX as an intermediary. However a third, baked in option, is to use Podium proxying.

## Podium Proxy

Podium proxying is the Podium way for a podlet to inform any layout servers that consume it that there are additional routes and that they should be given public access via routes on the layout server.

### How it works

For each proxy you define in a podlet, a namespaced route will be mounted on a layout which will proxy requests back to the podlet. This works as follows:

-   A podlet defines it's proxy routes
-   A podlet puts the location of the proxy routes into it's manifest file
-   A layout reads a podlets manifest file including proxy information
-   A layout creates namespaced proxy routes
-   A layout sends information to the podlet via context headers about the public location of these routes
-   A podlet uses context headers to construct URLs pointing to the layout's proxy endpoints

In a podlet's `/manifest.json` file, a proxy object can be used to define up to 4 proxy routes like so:

```json
{
    ...
    "name": "myPodlet",
    "proxy": {
        "api", "/api"
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
-   `<podlet-name>`: podlet manifest `name` value
-   `<proxy-namespace>`: podlet manifest `proxy.<key>`

So for a layout running locally on port '1337' using `pathname` 'myLayout' and consuming a podlet that serves the manifest file above we should be able to send requests to:

`http://localhost:1337/myLayout/podium-resource/myPodlet/api`

and expect that our requests would be proxyied on to our podlet's `/api` route.

### Programmatically defining proxy routes

It's not necessary to define proxy routes in a manifest file manually. There is a `podlet.proxy()` helper method you should use to define proxy routes and have the manifest file fields populated for you. The following example will achieve the same thing as shown earlier using this helper.

_Example_

```js
podlet.proxy('/api', 'api');
```

What's more, we can also define the route itself at the same time.

_Example_

```js
app.get(podlet.proxy('/api', 'api'), (req, res) => {
    res.json({ key: 'value' });
});
```

There are a maximum of 4 proxies, however it is possible to mount multiple routes under a single proxy.

_Example_

```js
podlet.proxy('/api', 'api');

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
podlet.proxy('remote-api', 'http://<some-service:port>/api');

// http://localhost:1337/myLayout/podium-resource/myPodlet/remote-api
```

### Constructing Proxy URLs

When creating a podlet with proxy routes, it's necessary to be able to dynamically, programmatically determine the location of these proxy routes.

The base URL can be constructed by joining together values plucked from the Podium context like so.

```js
const { URL } = require('url'); // not required in node >=10

app.get(podlet.content(), (req, res) => {
    const origin = res.locals.podium.context.mountOrigin;
    const pathname = res.locals.podium.context.publicPathname;
    const url = new URL(pathname, origin);

    // prints base URL under which all proxy routes are located
    console.log(url.href);
});
```

The path to a given endpoint can then be constructed by joining this base URL together with the namespace key given to the `podlet.proxy()` method like so:

```js
// define and create an API proxy route
app.get(podlet.proxy('/api', 'api'), (req, res) => {
    res.json({...});
});

app.get(podlet.content(), (req, res) => {
    // construct an absolute URL to the API proxy route
    const origin = res.locals.podium.context.mountOrigin;
    const pathname = res.locals.podium.context.publicPathname;
    const url = new URL(pathname, origin);

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
});

const app = express();

app.get(podlet.manifest(), (req, res) => {
    res.json(podlet);
});

app.get(podlet.proxy('/content', 'content'), (req, res) => {
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
```
